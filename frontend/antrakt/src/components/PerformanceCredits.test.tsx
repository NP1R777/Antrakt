import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PerformanceCredits from './PerformanceCredits';

jest.mock('@chakra-ui/react', () => {
    const React = require('react');
    return {
        Box: ({ children }: any) => <div>{children}</div>,
        SimpleGrid: ({ children }: any) => <div>{children}</div>,
        Heading: ({ children }: any) => <h2>{children}</h2>,
        Text: ({ as, to, children }: any) => React.createElement(as || 'p', to ? { to } : {}, children),
    };
});

it('uses IDs for identically named productions and preserves unlinked historical roles', () => {
    render(<MemoryRouter><PerformanceCredits credits={[
        { performance_id: 7, title: 'Одинаковое название', role: 'Первая роль', legacy: false },
        { performance_id: 9, title: 'Одинаковое название', role: 'Вторая роль', legacy: false },
        { performance_id: null, title: 'Историческая постановка', role: 'Сохранённая роль', legacy: true },
    ]} /></MemoryRouter>);
    const links = screen.getAllByRole('link');
    expect(links.map(link => link.getAttribute('href'))).toEqual(['/performance/7', '/performance/9']);
    expect(screen.getByText('Историческая постановка').closest('a')).toBeNull();
    expect(screen.getByText('Сохранённая роль')).toBeInTheDocument();
});

it('keeps the target after a production is renamed', () => {
    render(<MemoryRouter><PerformanceCredits credits={[
        { performance_id: 7, title: 'Новое название', year: 2020, team: 'Коллектив', legacy: false },
    ]} /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Новое название' })).toHaveAttribute('href', '/performance/7');
    expect(screen.getByText('Год: 2020')).toBeInTheDocument();
    expect(screen.getByText('Коллектив: Коллектив')).toBeInTheDocument();
});
