import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService, { User } from '../services/AuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<boolean>;
  register: (emailOrPhone: string, password: string, phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updatedUser: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Функция для обновления данных пользователя в контексте
  const updateUser = (updatedUser: User | null) => {
    setUser(updatedUser);
    setIsAuthenticated(!!updatedUser);

    // Обновляем данные в localStorage
    if (updatedUser) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      updateUser(currentUser); // Используем updateUser вместо setUser
    } catch (error) {
      console.error('Ошибка получения пользователя:', error);
      updateUser(null);
    }
  };

  const login = async (emailOrPhone: string, password: string): Promise<boolean> => {
    const success = await AuthService.login(emailOrPhone, password);
    if (success) {
      await refreshUser();
    }
    return success;
  };

  const register = async (emailOrPhone: string, password: string, phone: string): Promise<boolean> => {
    return await AuthService.register(emailOrPhone, password, phone);
  };

  const logout = async (): Promise<void> => {
    await AuthService.logout();
    updateUser(null); // Используем updateUser вместо setUser
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      // Проверяем наличие пользователя в localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          updateUser(parsedUser);
        } catch (e) {
          console.error('Ошибка при парсинге пользователя из localStorage', e);
          localStorage.removeItem('user');
        }
      }

      if (AuthService.isAuthenticated()) {
        await refreshUser();
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    updateUser, // Добавлено
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};