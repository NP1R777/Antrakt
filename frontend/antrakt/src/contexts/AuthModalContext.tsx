import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';

type AuthMode = 'login' | 'register';

interface AuthModalContextType {
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const openAuthModal = useCallback((mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const value = useMemo(
    () => ({ openAuthModal, closeAuthModal, isAuthModalOpen, authMode, setAuthMode }),
    [openAuthModal, closeAuthModal, isAuthModalOpen, authMode]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = (): AuthModalContextType => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error('useAuthModal должен использоваться внутри AuthModalProvider');
  }
  return ctx;
};
