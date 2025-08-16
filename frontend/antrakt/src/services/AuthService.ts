import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Адрес Django backend

export interface User {
  id: number;
  email: string;
  phone_number: string;
  is_superuser: boolean;
  profile_photo: string;
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
    if (!this.accessToken) return;

    const expirationTime = this.getTokenExpirationTime(this.accessToken);
    const refreshTime = expirationTime - Date.now() - 300000; // Обновляем за 5 минут до истечения

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshTokens();
      }, refreshTime);
    } else {
      // Токен уже истек или скоро истечет, обновляем сразу
      this.refreshTokens();
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
  private async refreshTokens(): Promise<void> {
    if (!this.refreshToken) {
      this.logout();
      return;
    }

    try {
      const response: AxiosResponse<RefreshResponse> = await axios.post(
        `${API_BASE_URL}/token/refresh/`,
        { refresh: this.refreshToken }
      );

      const { access, refresh } = response.data;
      this.saveTokensToStorage(access, refresh || this.refreshToken);
      this.startAutoRefresh(); // Запускаем следующий цикл обновления
    } catch (error) {
      console.error('Ошибка обновления токенов:', error);
      this.logout(); // Принудительный выход при ошибке
    }
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

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshTokens();
            originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            this.logout();
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
   * Выход из системы
   */
  async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        await axios.post(`${API_BASE_URL}/logout/`, {
          refresh_token: this.refreshToken
        });
      } catch (error) {
        console.error('Ошибка при выходе:', error);
      }
    }

    this.clearTokens();
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