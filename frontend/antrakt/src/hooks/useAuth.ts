import apiClient from '../utils/apiClient.ts';
import { useState, useEffect, useCallback } from 'react';
import { setTokens, getTokens, clearTokens } from '../utils/tokenStorage';


interface User {
    id: number;
    email: string;
    name: string;
    is_superuser: boolean;
}

export default function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Проверка аутентификации при загрузке
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const accessToken = localStorage.getItem('access');
                if (!accessToken) {
                    setLoading(false);
                    return;
                }

                const response = await apiClient.get('/api/profile/');
                setUser(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                clearTokens();
            }
        };
        checkAuth();
    }, []);

    // Функция входа
    const login = useCallback(async (email: string, password: string) => {
        try {
            const response = await apiClient.post('/login/', { email, password });

            setTokens(response.data.access, response.data.refresh);

            const userResponse = await apiClient.get('/api/profile/');
            setUser(userResponse.data);
            setIsAuthenticated(true);

            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }, []);

    // Функция регистрации
    const register = useCallback(async (email: string, password: string, phone: string) => {
        try {
            await apiClient.post('/register/', { email, password, phone_number: phone });
            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            return false;
        }
    }, []);

    // Функция выхода
    const logout = useCallback(async () => {
        try {
            const { refresh } = getTokens();
            if (refresh) {
                await apiClient.post('/logout/', { refresh });
            }
        } finally {
            clearTokens();
            setUser(null);
            setIsAuthenticated(false);
        }
    }, []);

    return {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout
    };
}