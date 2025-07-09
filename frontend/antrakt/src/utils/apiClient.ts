import axios from 'axios';
import { getTokens } from './tokenStorage';

const API_URL = 'http://127.0.0.1:8000';
const REFRESH_URL = `${API_URL}/login/`;

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Интерцептор для добавления токена к запросам
apiClient.interceptors.request.use(
    (config) => {
        const { access } = getTokens();
        if (access) {
            config.headers.Authorization = `Bearer ${access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Интерцептор для обработки 401 ошибки и обновления токена
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Если ошибка 401 и это не запрос на обновление токена
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { refresh } = getTokens();
                if (!refresh) throw new Error('No refresh token');

                // Запрашиваем новый access-токен
                const refreshResponse = await axios.post(REFRESH_URL, {
                    refresh: refresh
                });

                // Сохраняем новые токены
                localStorage.setItem('access', refreshResponse.data.access);
                localStorage.setItem('refresh', refreshResponse.data.refresh);

                // Обновляем заголовок авторизации
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;

                // Повторяем оригинальный запрос
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Очищаем токены и перенаправляем на страницу входа
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;