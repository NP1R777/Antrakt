import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import SiteReviewsPageAdmin from './SiteReviewsPageAdmin';
jest.mock('axios', () => ({ __esModule: true, default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() } }));
jest.mock('@chakra-ui/react', () => {
    const box = ({ children, role }: any) => <div role={role}>{children}</div>;
    return {
        Box: box, Container: box, VStack: box, HStack: box, Flex: box, SimpleGrid: box, FormControl: box,
        Heading: ({ children }: any) => <h2>{children}</h2>, Text: box, Badge: box, FormLabel: box,
        Divider: () => null, Spinner: () => <span>Загрузка</span>, chakra: () => () => null, useToast: () => () => {},
        Button: ({ children, onClick, isDisabled, isLoading }: any) => <button onClick={onClick} disabled={isDisabled || isLoading}>{children}</button>,
        IconButton: ({ onClick, 'aria-label': label }: any) => <button onClick={onClick} aria-label={label} />,
        Switch: ({ isChecked, onChange }: any) => <input type="checkbox" checked={isChecked} onChange={onChange} />,
        Input: ({ value, onChange, placeholder, type }: any) => <input type={type} value={value} onChange={onChange} placeholder={placeholder} />,
        Textarea: ({ value, onChange }: any) => <textarea value={value} onChange={onChange} />,
        Link: ({ href, children }: any) => <a href={href}>{children}</a>,
    };
});
const get = axios.get as jest.Mock, post = axios.post as jest.Mock, put = axios.put as jest.Mock;
let state: any, row: any;
beforeEach(() => {
    jest.useFakeTimers(); jest.clearAllMocks();
    state = { configured: true, interval_seconds: 1209600, job: null };
    row = { id: 7, author_name: 'Автор VK', text: 'Исходный отзыв', source: 'vk', position: 0, pinned: false, hidden: false, excluded: false };
    get.mockImplementation((url: string) => Promise.resolve({ data: url.includes('vk-reviews') ? state : [{ ...row }] }));
    put.mockResolvedValue({ data: {} });
});
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });
it('queues import and displays background progress', async () => {
    post.mockResolvedValue({ data: { created: true, job: { id: 9, status: 'pending', stage: 'Ожидает запуска', stats: {} } } });
    render(<SiteReviewsPageAdmin />); await screen.findByDisplayValue('Исходный отзыв');
    fireEvent.click(screen.getByRole('button', { name: 'Обновить из ВК' }));
    expect(await screen.findByText('Ожидает запуска…')).toBeInTheDocument();
    expect(post).toHaveBeenCalledWith(expect.stringContaining('/vk-reviews/parse/'), {});
    expect(screen.getByRole('button', { name: 'Обновить из ВК' })).toBeDisabled();
});
it('poll completion preserves dirty fields and saving permits refresh', async () => {
    state.job = { id: 9, status: 'running', stage: 'Чтение стены', stats: {} };
    render(<SiteReviewsPageAdmin />);
    fireEvent.change(await screen.findByDisplayValue('Исходный отзыв'), { target: { value: 'Несохранённая правка' } });
    state = { ...state, job: { id: 9, status: 'success', stage: 'Завершено', stats: { added: 1 } } };
    await act(async () => { jest.advanceTimersByTime(5000); });
    expect(screen.getByDisplayValue('Несохранённая правка')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Обновить список' })).toBeDisabled();
    expect(screen.getByText(/Есть обновления списка/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Обновить список' })).not.toBeDisabled());
    expect(put).toHaveBeenCalledWith(expect.stringContaining('/site-review7/'), expect.objectContaining({ text: 'Несохранённая правка' }));
});
it('restores excluded VK review explicitly', async () => {
    row.excluded = true; render(<SiteReviewsPageAdmin />);
    fireEvent.click(await screen.findByRole('button', { name: 'Восстановить' }));
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
    await waitFor(() => expect(screen.queryByText('Не сохранено')).not.toBeInTheDocument());
    expect(put).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ excluded: false }));
});
it('saves edited pin order', async () => {
    row.pinned = true; row.position = 2; render(<SiteReviewsPageAdmin />);
    fireEvent.change(await screen.findByDisplayValue('2'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
    await waitFor(() => expect(screen.queryByText('Не сохранено')).not.toBeInTheDocument());
    expect(put).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ position: 1 }));
});
it('unconfigured integration does not block manual reviews', async () => {
    state = { configured: false, error: 'VK не настроен', interval_seconds: 1209600 };
    render(<SiteReviewsPageAdmin />); await screen.findByDisplayValue('Исходный отзыв');
    expect(screen.getByRole('button', { name: 'Обновить из ВК' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Добавить' })).not.toBeDisabled();
});
