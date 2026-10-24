import React, { useEffect } from 'react';
import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFoundPage() {
    usePageMeta('Страница не найдена', 'Такой страницы нет. Перейдите на главную или посмотрите афишу театра.');
    useEffect(() => {
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex';
        document.head.appendChild(meta);
        return () => meta.remove();
    }, []);
    return <Box bg="black" color="white" minH="100vh" display="flex" flexDirection="column">
        <Navigation />
        <Box as="main" flex="1" textAlign="center" px={6} py={{ base: 20, md: 32 }}>
            <Text color="gray.400" fontSize="4xl">404</Text>
            <Heading as="h1" mb={6}>Страница не найдена</Heading>
            <Text mb={8}>Возможно, ссылка устарела или в адресе есть опечатка.</Text>
            <Stack direction={{ base: 'column', sm: 'row' }} justify="center" spacing={4}>
                <Button as={RouterLink} to="/" colorScheme="gray">На главную</Button>
                <Button as={RouterLink} to="/afisha" colorScheme="yellow">Смотреть афишу</Button>
            </Stack>
        </Box>
        <Footer />
    </Box>;
}
