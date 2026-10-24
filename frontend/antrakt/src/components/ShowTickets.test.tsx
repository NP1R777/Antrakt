import React from 'react';
import { render, screen } from '@testing-library/react';
import ShowTickets from './ShowTickets';

jest.mock('@chakra-ui/react', () => ({
    Box: ({ children }: any) => <div>{children}</div>,
    VStack: ({ children }: any) => <div>{children}</div>,
    Heading: ({ children }: any) => <h3>{children}</h3>,
    Text: ({ children }: any) => <p>{children}</p>,
    Button: ({ href, children, 'aria-label': label }: any) => <a href={href} aria-label={label}>{children}</a>,
}));

it('does not offer tickets for a past show, missing URL or unsafe URL', () => {
    render(<ShowTickets shows={[
        { id: 1, show_datetime: '2000-01-01T12:00:00Z', ticket_url: 'https://tickets.example/past' },
        { id: 2, show_datetime: '2031-11-10T12:00:00Z', ticket_url: null },
        { id: 3, show_datetime: '2031-11-11T12:00:00Z', ticket_url: 'javascript:alert(1)' },
    ]} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Показ уже начался')).toBeInTheDocument();
});

it('keeps a general ticket link when no dates have been added', () => {
    render(<ShowTickets shows={[]} generalUrl="https://tickets.example/general" />);
    expect(screen.getByRole('link', { name: 'Купить билет' })).toHaveAttribute('href', 'https://tickets.example/general');
    expect(screen.getByText('Даты показов уточняются.')).toBeInTheDocument();
});

it('sorts performances by date without detaching their ticket URLs', () => {
    render(<ShowTickets shows={[
        { id: 2, show_datetime: '2031-11-15T12:00:00Z', ticket_url: 'https://tickets.example/second' },
        { id: 1, show_datetime: '2031-11-10T12:00:00Z', ticket_url: 'https://tickets.example/first' },
    ]} />);
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['https://tickets.example/first', 'https://tickets.example/second']);
});

beforeEach(() => jest.spyOn(Date, 'now').mockReturnValue(Date.parse('2030-01-01T00:00:00Z')));
afterEach(() => jest.restoreAllMocks());
