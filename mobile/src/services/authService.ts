import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8000';

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
	refresh?: string;
}

class MobileAuthService {
	private accessToken: string | null = null;
	private refreshToken: string | null = null;
	private refreshTimer: ReturnType<typeof setTimeout> | null = null;

	constructor() {
		this.init();
	}

	private async init() {
		await this.loadTokensFromStorage();
		this.setupInterceptors();
	}

	private async loadTokensFromStorage(): Promise<void> {
		this.accessToken = await AsyncStorage.getItem('access_token');
		this.refreshToken = await AsyncStorage.getItem('refresh_token');
		if (this.accessToken && this.refreshToken) {
			this.startAutoRefresh();
		}
	}

	private async saveTokensToStorage(access: string, refresh: string): Promise<void> {
		await AsyncStorage.setItem('access_token', access);
		await AsyncStorage.setItem('refresh_token', refresh);
		this.accessToken = access;
		this.refreshToken = refresh;
	}

	private async clearTokens(): Promise<void> {
		await AsyncStorage.removeItem('access_token');
		await AsyncStorage.removeItem('refresh_token');
		this.accessToken = null;
		this.refreshToken = null;
		this.stopAutoRefresh();
	}

	private getTokenExpirationTime(token: string): number {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return payload.exp * 1000;
		} catch {
			return 0;
		}
	}

	private isTokenValid(token: string): boolean {
		const expirationTime = this.getTokenExpirationTime(token);
		return expirationTime > Date.now() + 60000;
	}

	private startAutoRefresh(): void {
		if (!this.accessToken) return;
		const expirationTime = this.getTokenExpirationTime(this.accessToken);
		const refreshTime = expirationTime - Date.now() - 300000;
		if (refreshTime > 0) {
			this.refreshTimer = setTimeout(() => {
				this.refreshTokens();
			}, refreshTime);
		} else {
			this.refreshTokens();
		}
	}

	private stopAutoRefresh(): void {
		if (this.refreshTimer) {
			clearTimeout(this.refreshTimer);
			this.refreshTimer = null;
		}
	}

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
			await this.saveTokensToStorage(access, refresh || this.refreshToken);
			this.startAutoRefresh();
		} catch (error) {
			console.error('Ошибка обновления токенов:', error);
			this.logout();
		}
	}

	private setupInterceptors(): void {
		axios.interceptors.request.use(
			(config) => {
				if (this.accessToken && this.isTokenValid(this.accessToken)) {
					config.headers = config.headers || {};
					config.headers.Authorization = `Bearer ${this.accessToken}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		axios.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest: any = error.config;
				if (error.response?.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true;
					try {
						await this.refreshTokens();
						originalRequest.headers = originalRequest.headers || {};
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
			await this.saveTokensToStorage(access, refresh);
			this.startAutoRefresh();
			return true;
		} catch (error) {
			console.error('Ошибка авторизации:', error);
			return false;
		}
	}

	async logout(): Promise<void> {
		if (this.refreshToken) {
			try {
				await axios.post(`${API_BASE_URL}/logout/`, {
					refresh_token: this.refreshToken,
				});
			} catch (error) {
				console.error('Ошибка при выходе:', error);
			}
		}
		await this.clearTokens();
	}

	isAuthenticated(): boolean {
		return this.accessToken !== null && this.isTokenValid(this.accessToken);
	}

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
}

export default new MobileAuthService();