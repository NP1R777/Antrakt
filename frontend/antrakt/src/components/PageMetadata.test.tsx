import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageMetadata from './PageMetadata';
jest.mock('axios', () => ({ __esModule: true, default: { get: jest.fn() } }));
const get = axios.get as jest.Mock;
const data = (path: string, noindex = false) => ({ path, title: `Запись ${path}`, description: 'Описание', image: `https://images.example${path}.jpg`,
    canonical: noindex ? null : `https://theatre.example${path}`, type: 'article', noindex });
function Navigate() { const navigate = useNavigate(); return <><button onClick={() => navigate('/news/2')}>Следующая</button><button onClick={() => navigate('/missing')}>Нет страницы</button></>; }
const show = (path = '/news/1') => render(<MemoryRouter initialEntries={[path]}><PageMetadata /><Navigate /></MemoryRouter>);
const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');
beforeEach(() => { get.mockReset(); document.head.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[name="robots"], link[rel="canonical"], #page-metadata').forEach(node => node.remove()); });
it('uses metadata already in the initial server HTML without another request', () => {
    const script = document.createElement('script'); script.id = 'page-metadata'; script.type = 'application/json'; script.textContent = JSON.stringify(data('/news/1')); document.head.appendChild(script);
    show();
    expect(canonical()).toBe('https://theatre.example/news/1'); expect(get).not.toHaveBeenCalled();
    expect(document.getElementById('page-metadata')).toBeNull();
});
it('updates image and canonical on SPA navigation and ignores a stale response', async () => {
    let firstResolve: (value: any) => void = () => {};
    get.mockImplementationOnce(() => new Promise(resolve => { firstResolve = resolve; })).mockResolvedValueOnce({ data: data('/news/2') });
    show(); fireEvent.click(screen.getByText('Следующая'));
    await waitFor(() => expect(canonical()).toBe('https://theatre.example/news/2'));
    await act(async () => { firstResolve({ data: data('/news/1') }); });
    expect(canonical()).toBe('https://theatre.example/news/2');
    expect(document.head.querySelector('meta[property="og:image"]')).toHaveAttribute('content', 'https://images.example/news/2.jpg');
    expect(get.mock.calls[0][1].signal.aborted).toBe(true);
});
it('clears previous canonical and image while an unknown page loads', async () => {
    get.mockResolvedValueOnce({ data: data('/news/1') }).mockResolvedValueOnce({ data: data('/missing', true) });
    show(); await waitFor(() => expect(canonical()).toBe('https://theatre.example/news/1'));
    fireEvent.click(screen.getByText('Нет страницы'));
    await waitFor(() => expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow'));
    expect(canonical()).toBeUndefined();
    expect(document.head.querySelectorAll('meta[property="og:url"]')).toHaveLength(0);
});
it('failed request does not preserve metadata for another page', async () => {
    get.mockResolvedValueOnce({ data: data('/news/1') }).mockRejectedValueOnce(new Error('offline'));
    show(); await waitFor(() => expect(canonical()).toBe('https://theatre.example/news/1'));
    fireEvent.click(screen.getByText('Следующая'));
    await waitFor(() => expect(get).toHaveBeenCalledTimes(2));
    expect(canonical()).toBeUndefined();
    expect(document.head.querySelector('meta[property="og:title"]')).not.toHaveAttribute('content', 'Запись /news/1');
});
