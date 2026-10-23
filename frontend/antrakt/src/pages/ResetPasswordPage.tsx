import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Heading, Input, Text, VStack } from '@chakra-ui/react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { API_URL } from '../config';
import { useAuthModal } from '../contexts/AuthModalContext';
import { usePageMeta } from '../hooks/usePageMeta';

// Public recovery must also work when the browser contains an expired JWT.
const recoveryClient = axios.create({ baseURL: API_URL });

export default function ResetPasswordPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.hash.slice(1));
    const uid = params.get('uid');
    const token = params.get('token');
    const { openAuthModal } = useAuthModal();
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [email, setEmail] = useState('');
    const [busy, setBusy] = useState(false);
    const [success, setSuccess] = useState(false);
    const [invalid, setInvalid] = useState(!uid || !token);
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);
    usePageMeta('Новый пароль', 'Восстановление доступа к аккаунту театра.');

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmation) {
            setMessage('Пароли не совпадают.');
            return;
        }
        setBusy(true);
        setMessage('');
        try {
            await recoveryClient.post('/password-reset/confirm/', { uid, token, new_password: password });
            setPassword('');
            setConfirmation('');
            setSuccess(true);
            navigate('/reset-password', { replace: true });
        } catch (error: any) {
            const data = error.response?.data;
            if (data?.code === 'invalid_link') {
                setInvalid(true);
                navigate('/reset-password', { replace: true });
            }
            setMessage(data?.new_password?.join(' ') || data?.error ||
                (error.response?.status === 429 ? 'Слишком много попыток. Попробуйте позже.' : 'Не удалось изменить пароль. Попробуйте ещё раз.'));
        } finally {
            setBusy(false);
        }
    };

    const requestAgain = async (event: React.FormEvent) => {
        event.preventDefault();
        setBusy(true);
        setMessage('');
        try {
            await recoveryClient.post('/password-reset/', { email });
            setSent(true);
        } catch (error: any) {
            setMessage(error.response?.data?.error || (error.response?.status === 429
                ? 'Слишком много запросов. Попробуйте позже.' : 'Не удалось отправить запрос. Попробуйте ещё раз.'));
        } finally {
            setBusy(false);
        }
    };

    return (
        <Box bg="black" color="white" minH="100vh" display="flex" flexDirection="column">
            <Navigation />
            <Box flex="1" w="100%" maxW="480px" mx="auto" px={5} py={16}>
                <VStack spacing={6} align="stretch">
                    <Heading size="lg">{success ? 'Пароль изменён' : invalid ? 'Нужна новая ссылка' : 'Новый пароль'}</Heading>
                    {message && <Text role="alert" color="red.300">{message}</Text>}
                    {success ? <>
                        <Text>Прежние сеансы завершены. Войдите с новым паролем.</Text>
                        <Button onClick={() => openAuthModal('login')}>Войти</Button>
                    </> : invalid ? <>
                        <Text>Ссылка недействительна, уже использована или срок её действия истёк. Запросите новую ссылку.</Text>
                        {sent ? <Text role="status">Если аккаунт с такой почтой существует, на неё отправлена ссылка восстановления.</Text> :
                            <Box as="form" onSubmit={requestAgain}>
                                <FormControl isRequired mb={4}>
                                    <FormLabel htmlFor="reset-email">Электронная почта</FormLabel>
                                    <Input id="reset-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
                                </FormControl>
                                <Button type="submit" isLoading={busy}>Отправить новую ссылку</Button>
                            </Box>}
                    </> : <Box as="form" onSubmit={submit}>
                        <FormControl isRequired mb={4}>
                            <FormLabel htmlFor="reset-password">Новый пароль</FormLabel>
                            <Input id="reset-password" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
                        </FormControl>
                        <FormControl isRequired mb={4}>
                            <FormLabel htmlFor="reset-confirmation">Повторите пароль</FormLabel>
                            <Input id="reset-confirmation" type="password" autoComplete="new-password" value={confirmation} onChange={e => setConfirmation(e.target.value)} />
                        </FormControl>
                        <Button type="submit" isLoading={busy}>Сохранить пароль</Button>
                    </Box>}
                </VStack>
            </Box>
            <Footer />
        </Box>
    );
}
