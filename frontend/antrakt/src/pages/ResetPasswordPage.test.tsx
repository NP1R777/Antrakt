import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import ResetPasswordPage from './ResetPasswordPage';

jest.mock('axios', () => {
    const post = jest.fn();
    return { __esModule: true, default: { post, create: () => ({ post }) } };
});
jest.mock('../components/Navigation', () => () => null);
jest.mock('../components/Footer', () => () => null);
jest.mock('../contexts/AuthModalContext', () => ({ useAuthModal: () => ({ openAuthModal: jest.fn() }) }));
// The existing CRA Jest resolver cannot load Chakra's context package. Keep the
// form behavior tests independent of Chakra rendering, using native controls.
jest.mock('@chakra-ui/react', () => {
    const React = require('react');
    return {
        Box: ({ as, children, onSubmit }: any) => React.createElement(as || 'div', { onSubmit }, children),
        VStack: ({ children }: any) => <div>{children}</div>,
        Heading: ({ children }: any) => <h1>{children}</h1>,
        Text: ({ children, role }: any) => <p role={role}>{children}</p>,
        FormControl: ({ children }: any) => <div>{children}</div>,
        FormLabel: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
        Input: (props: any) => <input {...props} />,
        Button: ({ children, isLoading, ...props }: any) => <button disabled={isLoading} {...props}>{children}</button>,
    };
});

const post = axios.post as jest.Mock;
const show = (url = '/reset-password#uid=MQ&token=one-time') => render(
    <MemoryRouter initialEntries={[url]}><ResetPasswordPage /></MemoryRouter>
);
const fill = (confirmation = 'Replacement2026!') => {
    fireEvent.change(screen.getByLabelText('Новый пароль'), { target: { value: 'Replacement2026!' } });
    fireEvent.change(screen.getByLabelText('Повторите пароль'), { target: { value: confirmation } });
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить пароль' }));
};

beforeEach(() => post.mockReset());

it('does not submit mismatching passwords', async () => {
    show();
    fill('different');
    expect(await screen.findByRole('alert')).toHaveTextContent('Пароли не совпадают');
    expect(post).not.toHaveBeenCalled();
});

it('submits the link token and offers login after success', async () => {
    post.mockResolvedValue({ data: {} });
    show();
    fill();
    expect(await screen.findByRole('heading', { name: 'Пароль изменён' })).toBeInTheDocument();
    expect(post).toHaveBeenCalledWith('/password-reset/confirm/', { uid: 'MQ', token: 'one-time', new_password: 'Replacement2026!' });
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Новый пароль')).not.toBeInTheDocument();
});

it('offers a new link when the token has expired and sends the new request', async () => {
    post.mockRejectedValueOnce({ response: { data: { code: 'invalid_link', error: 'Ссылка истекла' } } });
    show();
    fill();
    expect(await screen.findByRole('heading', { name: 'Нужна новая ссылка' })).toBeInTheDocument();
    post.mockResolvedValueOnce({ data: {} });
    fireEvent.change(screen.getByLabelText('Электронная почта'), { target: { value: 'user@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Отправить новую ссылку' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Если аккаунт с такой почтой существует');
    expect(post).toHaveBeenLastCalledWith('/password-reset/', { email: 'user@test.com' });
});

it('keeps the form available after a password validation error', async () => {
    post.mockRejectedValueOnce({ response: { data: { new_password: ['Слишком распространённый пароль.'] } } });
    show();
    fill();
    expect(await screen.findByRole('alert')).toHaveTextContent('Слишком распространённый пароль');
    expect(screen.getByLabelText('Новый пароль')).toBeInTheDocument();
});

it('does not submit a confirmation when the link is missing', () => {
    show('/reset-password');
    expect(screen.getByRole('heading', { name: 'Нужна новая ссылка' })).toBeInTheDocument();
    expect(post).not.toHaveBeenCalled();
});
