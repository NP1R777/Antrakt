import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AfishaDetail from './AfishaDetail';

jest.mock('axios', () => ({ __esModule: true, default: { get: jest.fn() } }));
jest.mock('../../components/Navigation', () => () => null);
jest.mock('../../components/Footer', () => () => null);
jest.mock('../../components/PageFetchError', () => ({ message, onRetry }: any) => <div role="alert">{message}<button onClick={onRetry}>Повторить попытку</button></div>);
jest.mock('@chakra-ui/icons', () => ({ ChevronLeftIcon: () => null }));
jest.mock('framer-motion', () => ({ motion: (Component: any) => Component }));
jest.mock('@chakra-ui/react', () => {
    const React = require('react');
    const container = ({ children, role }: any) => <div role={role}>{children}</div>;
    return {
        forwardRef: React.forwardRef,
        Box: container, VStack: container, Grid: container, GridItem: container,
        Heading: ({ as, children }: any) => React.createElement(as || 'h2', {}, children),
        Text: ({ children, role }: any) => <p role={role}>{children}</p>,
        Image: ({ src, alt }: any) => <img src={src} alt={alt} />,
        Button: ({ as, children, onClick, href, target, rel, 'aria-label': label }: any) => React.createElement(as || 'button', { onClick, href, target, rel, 'aria-label': label }, children),
        chakra: () => () => null,
    };
});

const get = axios.get as jest.Mock;
const future = '2031-11-10T12:00:00Z';
const item = { id: 7, title: 'Премьера', description: 'Описание', afisha: true, image_url: '', ticket_url: 'https://tickets.example/general', shows: [
    { id: 1, show_datetime: future, ticket_url: 'https://tickets.example/first' },
    { id: 2, show_datetime: '2031-11-15T11:00:00Z', ticket_url: null },
] };

function SwitchRoute() {
    const navigate = useNavigate();
    return <button onClick={() => navigate('/afisha/performance/8')}>Другая запись</button>;
}
const show = (path = '/afisha/performance/7', state?: any) => render(<MemoryRouter initialEntries={[{ pathname: path, state }]}>
    <SwitchRoute /><Routes>
        <Route path="/afisha/:type/:id" element={<AfishaDetail />} />
        <Route path="/performance/:id" element={<p>Постоянная страница спектакля</p>} />
        <Route path="/projects/:id" element={<p>Постоянная страница проекта</p>} />
    </Routes>
</MemoryRouter>);

beforeEach(() => { get.mockReset(); get.mockResolvedValue({ data: item }); });

it('loads a direct URL without state and pairs each show with its own or fallback ticket', async () => {
    show();
    expect(await screen.findByRole('heading', { name: 'Премьера' })).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith(expect.stringContaining('/perfomance7/'), expect.objectContaining({ signal: expect.any(AbortSignal) }));
    const links = screen.getAllByRole('link');
    expect(links.map(link => link.getAttribute('href'))).toEqual(['https://tickets.example/first', 'https://tickets.example/general']);
    expect(links[0]).toHaveAccessibleName('Купить билет на 10.11.2031, 19:00');
    expect(screen.getByText('Выберите эту дату на странице продажи билетов.')).toBeInTheDocument();
});

it('ignores stale navigation state and uses current server data', async () => {
    show('/afisha/performance/7', { item: { ...item, title: 'Устаревшее название' } });
    expect(screen.queryByText('Устаревшее название')).not.toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Премьера' })).toBeInTheDocument();
});

it('loads archive records from their own endpoint even when IDs coincide', async () => {
    get.mockResolvedValue({ data: { id: 7, afisha: true, title: 'Мероприятие', description: 'Текст', premiere_date: '2031-11-10' } });
    show('/afisha/archive/7');
    expect(await screen.findByRole('heading', { name: 'Мероприятие' })).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith(expect.stringContaining('/archive7/'), expect.anything());
    expect(screen.queryByRole('link', { name: /Купить билет/ })).not.toBeInTheDocument();
});

it('shows not-found for missing records and rejects malformed routes without fetching', async () => {
    get.mockRejectedValue({ response: { status: 404 } });
    const view = show();
    expect(await screen.findByRole('heading', { name: 'Запись не найдена' })).toBeInTheDocument();
    view.unmount(); get.mockClear();
    show('/afisha/unknown/not-a-number');
    expect(screen.getByRole('heading', { name: 'Запись не найдена' })).toBeInTheDocument();
    expect(get).not.toHaveBeenCalled();
});

it('lets the user retry a network failure', async () => {
    get.mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce({ data: item });
    show();
    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить');
    fireEvent.click(screen.getByRole('button', { name: 'Повторить попытку' }));
    expect(await screen.findByRole('heading', { name: 'Премьера' })).toBeInTheDocument();
    expect(get).toHaveBeenCalledTimes(2);
});

it.each(['performance', 'archive'])('keeps old afisha links usable after %s leaves the schedule', async type => {
    get.mockResolvedValue({ data: { ...item, afisha: false } });
    show(`/afisha/${type}/7`);
    expect(await screen.findByText(type === 'performance' ? 'Постоянная страница спектакля' : 'Постоянная страница проекта')).toBeInTheDocument();
});

it('does not overwrite the new record with a slow response from the previous URL', async () => {
    let resolveFirst!: (data: any) => void;
    get.mockReturnValueOnce(new Promise(resolve => { resolveFirst = resolve; })).mockResolvedValueOnce({ data: { ...item, id: 8, title: 'Вторая премьера' } });
    show();
    fireEvent.click(screen.getByRole('button', { name: 'Другая запись' }));
    expect(await screen.findByRole('heading', { name: 'Вторая премьера' })).toBeInTheDocument();
    await act(async () => { resolveFirst({ data: item }); });
    expect(screen.queryByRole('heading', { name: 'Премьера' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Вторая премьера' })).toBeInTheDocument();
});

beforeEach(() => jest.spyOn(Date, 'now').mockReturnValue(Date.parse('2030-01-01T00:00:00Z')));
afterEach(() => jest.restoreAllMocks());
