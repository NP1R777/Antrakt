import axios, { AxiosResponse } from 'axios';
import { API_URL } from '../config';

const API_BASE_URL = `${API_URL}`; // Адрес Django backend

export interface User {
  id: number;
  email: string;
  phone_number: string;
  is_superuser: boolean;
  profile_photo?: string | null;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user?: User;
}

export interface RefreshResponse {
  access: string;
  refresh?: string; // Новый refresh при ротации
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  private refreshPromise: Promise<void> | null = null;
  // Refresh failures must not enter the global 401 interceptor recursively.
  private refreshClient = axios.create();

  constructor() {
    this.loadTokensFromStorage();
    this.setupInterceptors();
  }

  /**
   * Загрузка токенов из localStorage
   */
  private loadTokensFromStorage(): void {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');

    if (this.accessToken && this.refreshToken) {
      this.startAutoRefresh();
    }
  }

  /**
   * Сохранение токенов в localStorage
   */
  private saveTokensToStorage(access: string, refresh: string): void {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    this.accessToken = access;
    this.refreshToken = refresh;
  }

  /**
   * Очистка токенов
   */
  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.accessToken = null;
    this.refreshToken = null;
    this.stopAutoRefresh();
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth:logout'));
  }

  /**
   * Получение времени до истечения токена
   */
  private getTokenExpirationTime(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Конвертируем в миллисекунды
    } catch {
      return 0;
    }
  }

  /**
   * Проверка валидности токена
   */
  private isTokenValid(token: string): boolean {
    const expirationTime = this.getTokenExpirationTime(token);
    return expirationTime > Date.now() + 60000; // Запас 1 минута
  }

  /**
   * Автоматическое обновление токенов
   */
  private startAutoRefresh(): void {
    this.stopAutoRefresh();
    if (!this.accessToken) return;

    const expirationTime = this.getTokenExpirationTime(this.accessToken);
    const refreshTime = expirationTime - Date.now() - 300000; // Обновляем за 5 минут до истечения

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        void this.refreshTokens().catch(() => undefined);
      }, refreshTime);
    } else {
      // Токен уже истек или скоро истечет, обновляем сразу
      void this.refreshTokens().catch(() => undefined);
    }
  }

  /**
   * Остановка автоматического обновления
   */
  private stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Обновление токенов
   */
  private refreshTokens(): Promise<void> {
    if (this.refreshPromise) return this.refreshPromise;
    if (!this.refreshToken) {
      this.clearTokens();
      return Promise.reject(new Error('Сеанс завершён'));
    }
    const refreshToken = this.refreshToken;
    this.refreshPromise = this.refreshClient.post<RefreshResponse>(
      `${API_BASE_URL}/token/refresh/`, { refresh: refreshToken }
    ).then(({ data }) => {
      // Do not restore a session if the user logged out or logged in again
      // while this refresh request was in flight.
      if (this.refreshToken !== refreshToken) throw new Error('Сеанс изменился');
      this.saveTokensToStorage(data.access, data.refresh || refreshToken);
      this.startAutoRefresh();
    }).catch((error) => {
      if (this.refreshToken === refreshToken) this.clearTokens();
      throw error;
    }).finally(() => {
      this.refreshPromise = null;
    });
    return this.refreshPromise;
  }

  /**
   * Настройка interceptors для axios
   */
  private setupInterceptors(): void {
    // Request interceptor - добавляем токен к каждому запросу
    axios.interceptors.request.use(
      (config) => {
        if (this.accessToken && this.isTokenValid(this.accessToken)) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - обрабатываем 401 ошибки
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as any;

        const authEndpoint = /\/(login|logout|token\/refresh)\/?$/.test(originalRequest?.url || '');
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !authEndpoint) {
          originalRequest._retry = true;

          try {
            await this.refreshTokens();
            originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Авторизация пользователя (email или телефон)
   */
  async login(emailOrPhone: string, password: string): Promise<boolean> {
    try {
      const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailOrPhone);
      const requestData = isEmail 
        ? { email: emailOrPhone, password }
        : { phone_number: emailOrPhone, password };

      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${API_BASE_URL}/login/`,
        requestData
      );

      const { access, refresh } = response.data;
      this.saveTokensToStorage(access, refresh);
      this.startAutoRefresh();
      return true;
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      return false;
    }
  }

  /**
   * Регистрация обычного пользователя (email обязателен, телефон опционален)
   */
  async register(email: string, password: string, phone: string = ''): Promise<boolean> {
    // Шаг 1: отправка кода подтверждения на почту (пользователь ещё не создаётся).
    await axios.post(`${API_BASE_URL}/register/`, {
      email,
      password,
      phone_number: phone || undefined,
    });
    return true;
  }

  /**
   * Шаг 2: подтверждение кода из письма — создаёт пользователя.
   */
  async verifyRegistration(email: string, code: string): Promise<boolean> {
    await axios.post(`${API_BASE_URL}/register/verify/`, { email, code });
    return true;
  }

  /**
   * Повторная отправка кода подтверждения.
   */
  async resendCode(email: string): Promise<boolean> {
    await axios.post(`${API_BASE_URL}/register/resend/`, { email });
    return true;
  }

  /**
   * Восстановление пароля: на указанную почту приходит одноразовая ссылка.
   */
  async requestPasswordReset(email: string): Promise<boolean> {
    await axios.post(`${API_BASE_URL}/password-reset/`, { email });
    return true;
  }

  /**
   * Выход из системы
   */
  async logout(): Promise<void> {
    const refresh = this.refreshToken;
    const access = this.accessToken;
    this.clearTokens();
    if (refresh) {
      try {
        await this.refreshClient.post(`${API_BASE_URL}/logout/`, {
          refresh_token: refresh,
        }, { headers: { Authorization: `Bearer ${access}` } });
      } catch (error) {
        console.error('Ошибка при выходе:', error);
      }
    }
  }

  /**
   * Проверка авторизации
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null && this.isTokenValid(this.accessToken);
  }

  /**
   * Получение текущего пользователя
   */
  async getCurrentUser(): Promise<User | null> {
    if (!this.isAuthenticated()) return null;

    try {
      const response: AxiosResponse<{ user: User }> = await axios.get(
        `${API_BASE_URL}/token/verify/`
      );
      return response.data.user;
    } catch (error) {
      console.error('Ошибка получения пользователя:', error);
      return null;
    }
  }

  /**
   * Получение access токена
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }
}

// Создаем singleton
const authService = new AuthService();

// Экспортируем singleton
export default authService;
export { authService };