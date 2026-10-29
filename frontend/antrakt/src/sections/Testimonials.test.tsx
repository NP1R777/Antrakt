import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import Testimonials from './Testimonials';
jest.mock('axios', () => ({ __esModule: true, default: { get: jest.fn() } }));
jest.mock('framer-motion', () => ({ motion: (component: any) => component }));
jest.mock('@chakra-ui/react', () => {
    const box = ({ children }: any) => <div>{children}</div>;
    return { Box: box, Grid: box, GridItem: box, Heading: ({ children }: any) => <h2>{children}</h2>, Text: ({ children }: any) => <p>{children}</p>,
        Flex: ({ children, 'aria-label': label }: any) => <div aria-label={label}>{children}</div>,
        Link: ({ href, children }: any) => <a href={href}>{children}</a>, Avatar: () => null, chakra: () => () => <span /> };
});
const get = axios.get as jest.Mock;
it('VK has original link and no invented stars; manual rating remains', async () => {
    get.mockResolvedValue({ data: [
        { id: 1, author_name: 'Зритель VK', text: 'Спасибо театру', source: 'vk', rating: 5, source_url: 'https://vk.com/wall-10_20?reply=123' },
        { id: 2, author_name: 'Ручной', text: 'Ручной отзыв', source: 'manual', rating: 4 },
        { id: 3, author_name: 'Без оценки', text: 'Без оценки', source: 'manual', rating: null },
    ] });
    render(<Testimonials />);
    expect(await screen.findByText('Зритель VK')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Оригинал в VK' })).toHaveAttribute('href', 'https://vk.com/wall-10_20?reply=123');
    expect(screen.queryByLabelText('Оценка: 5 из 5')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Оценка: 4 из 5')).toBeInTheDocument();
});
it('rejects unsafe source URLs', async () => {
    get.mockResolvedValue({ data: [{ id: 1, author_name: 'Автор', text: 'Текст', source: 'vk', source_url: 'javascript:alert(1)' }] });
    render(<Testimonials />); await screen.findByText('Автор');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
