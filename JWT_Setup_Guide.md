# 🔐 Полная настройка JWT с автообновлением токенов

## ✅ Что уже выполнено:

### Backend (Django):
1. **Исправлена модель User** - поле `access_token` вместо `acess_token`
2. **Добавлены новые JWT endpoints:**
   - `POST /login/` - аутентификация пользователя
   - `POST /token/refresh/` - обновление токенов
   - `POST /logout/` - выход с blacklist токена
   - `GET /token/verify/` - проверка действительности токена
3. **Настроен SimpleJWT в settings.py:**
   - ACCESS_TOKEN_LIFETIME = 60 минут
   - REFRESH_TOKEN_LIFETIME = 1 день
   - ROTATE_REFRESH_TOKENS = True (новый refresh при каждом обновлении)
   - BLACKLIST_AFTER_ROTATION = True (безопасность)
4. **Обновлены views для сохранения токенов** в базе данных
5. **Создана миграция** для исправления поля access_token

### Frontend (React + TypeScript):
1. **Создан AuthService.ts** - полноценный сервис с:
   - Автоматическим обновлением токенов за 5 минут до истечения
   - Axios interceptors для обработки 401 ошибок
   - Сохранением токенов в localStorage
   - Методами login, register, logout, getCurrentUser
2. **Создан AuthContext.tsx** - React контекст для управления состоянием аутентификации

## 🔧 Следующие шаги для завершения:

### 1. Исправить типы TypeScript (опционально)
```bash
cd frontend/antrakt
npm install --save-dev @types/node
```

### 2. Обновить App.tsx
Оберните приложение в AuthProvider:

```tsx
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Box bg="black" color="white" minH="100vh">
            <Navigation />
            <Header />
            <Hero />
            <Performances />
            <NewsSection />
            <Testimonials />
            <Footer />
          </Box>
        </AuthProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
}
```

### 3. Обновить Navigation.tsx
Заменить существующую логику аутентификации на использование AuthService:

```tsx
// В начале файла добавить:
import { useAuth } from "../contexts/AuthContext";

// В компоненте Navigation заменить состояние на:
const { user, isAuthenticated, login, register, logout } = useAuth();

// Обновить обработчики:
const handleLogin = async (email: string, password: string) => {
  const success = await login(email, password);
  if (success) {
    setIsAuthModalOpen(false);
    toast({
      title: "Вход выполнен!",
      description: "Добро пожаловать!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }
  return success;
};

const handleRegister = async (email: string, password: string, phone: string) => {
  const success = await register(email, password, phone);
  if (success) {
    toast({
      title: "Успешная регистрация!",
      description: "Теперь войдите в свой аккаунт.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setAuthMode("login");
  }
  return success;
};

const handleLogout = async () => {
  await logout();
  toast({
    title: "Вы вышли из системы",
    status: "info",
    duration: 2000,
    isClosable: true,
  });
};
```

### 4. Настроить PostgreSQL и применить миграции
```bash
# 1. Запустить PostgreSQL
sudo systemctl start postgresql

# 2. Создать базу данных
sudo -u postgres createdb antrakt

# 3. Применить миграции
cd backend/app
source ../venv/bin/activate
python manage.py migrate

# 4. Создать суперпользователя
python manage.py createsuperuser
```

### 5. Запустить проекты
```bash
# Backend (в первом терминале)
cd backend/app
source ../venv/bin/activate
python manage.py runserver

# Frontend (во втором терминале) 
cd frontend/antrakt
npm start
```

## 🚀 Особенности реализации:

### Автообновление токенов
- Токены обновляются автоматически за 5 минут до истечения
- При получении 401 ошибки токен обновляется автоматически
- Если обновление не удается, пользователь выходит из системы

### Безопасность
- Refresh токены помещаются в blacklist после использования
- Новый refresh токен генерируется при каждом обновлении
- Токены хранятся в localStorage (в продакшене лучше использовать httpOnly cookies)

### Управление состоянием
- Централизованное управление через AuthContext
- Автоматическая проверка аутентификации при загрузке приложения
- Синхронизация состояния между компонентами

## 🎯 Готовность к админ-панели

После завершения этих шагов система аутентификации будет готова для:
1. **Разграничения доступа** - проверка `user.is_superuser`
2. **Админ-панели** - безопасный доступ к управлению контентом
3. **Защищенных endpoints** - автоматическая авторизация запросов

## 📝 Тестирование

1. **Регистрация** - создайте нового пользователя
2. **Вход** - войдите в систему
3. **Автообновление** - оставьте страницу открытой на час, токены должны обновиться автоматически
4. **Выход** - проверьте, что токены удаляются из localStorage
5. **Админские права** - создайте суперпользователя и проверьте отображение админ-панели

JWT система с автообновлением готова! 🎭