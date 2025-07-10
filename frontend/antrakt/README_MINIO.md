# Интеграция MinIO во Frontend

## Обзор

Frontend театральной студии "Антракт" интегрирован с MinIO для автоматической загрузки и управления изображениями. Система предоставляет удобный интерфейс для загрузки изображений с предварительным просмотром, валидацией и автоматическим сохранением в MinIO.

## Компоненты

### 1. ImageService (`src/services/ImageService.ts`)

Сервис для работы с изображениями и MinIO:

- **uploadImage(file, folder)** - загрузка изображения в MinIO
- **deleteImage(imageUrl)** - удаление изображения из MinIO
- **validateImageFile(file)** - валидация файла изображения
- **createImagePreview(file)** - создание предварительного просмотра
- **getFolderByContentType(contentType)** - получение папки по типу контента
- **handleUploadError(error)** - обработка ошибок загрузки

### 2. ImageUpload (`src/components/ImageUpload.tsx`)

Универсальный компонент для загрузки изображений:

**Пропсы:**
- `currentImageUrl` - текущий URL изображения
- `onImageUpload` - callback при успешной загрузке
- `onImageRemove` - callback при удалении изображения
- `contentType` - тип контента (actors, perfomances, news, etc.)
- `maxSize` - максимальный размер файла в MB
- `disabled` - состояние блокировки

**Функции:**
- Предварительный просмотр изображения
- Валидация файлов (тип, размер)
- Прогресс загрузки
- Обработка ошибок
- Просмотр текущего изображения
- Удаление изображения

## Интеграция в страницы

### Страница актеров (`src/pages/admin/ActorsPage.tsx`)

```typescript
// Добавлен импорт
import ImageUpload from '../../components/ImageUpload';

// Добавлены обработчики
const handleImageUpload = (imageUrl: string) => {
    setCurrentActor(prev => ({
        ...prev,
        image_url: imageUrl
    }));
};

const handleImageRemove = () => {
    setCurrentActor(prev => ({
        ...prev,
        image_url: ''
    }));
};

// Заменено поле ввода URL на компонент загрузки
<ImageUpload
    currentImageUrl={currentActor.image_url}
    onImageUpload={handleImageUpload}
    onImageRemove={handleImageRemove}
    contentType="actors"
    maxSize={10}
    disabled={isSubmitting}
/>
```

### Страница спектаклей (`src/pages/admin/PerformancesPage.tsx`)

Полноценная CRUD страница с интеграцией загрузки изображений:

- Создание/редактирование спектаклей
- Загрузка постеров спектаклей
- Управление жанрами, продолжительностью, датами
- Отображение карточек спектаклей с изображениями

### Страница новостей (`src/pages/admin/NewsPage.tsx`)

CRUD страница для управления новостями:

- Создание/редактирование новостей
- Загрузка изображений для новостей
- Управление статусом публикации
- Краткое описание и полное содержание

## Поддерживаемые типы контента

Система автоматически организует изображения по папкам в MinIO:

- `actors` - фотографии актеров
- `perfomances` - постеры спектаклей
- `directors` - фотографии режиссеров
- `news` - изображения для новостей
- `archive` - архивные изображения
- `achievements` - изображения достижений

## Валидация файлов

### Поддерживаемые форматы
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Ограничения
- Максимальный размер: 10MB
- Минимальное разрешение: не ограничено
- Рекомендуемое соотношение сторон: зависит от типа контента

## Обработка ошибок

Система предоставляет детальную обратную связь:

- Ошибки валидации файлов
- Ошибки загрузки в MinIO
- Ошибки сети
- Ошибки удаления файлов

## Безопасность

- Валидация типов файлов на клиенте и сервере
- Ограничение размера файлов
- Автоматическая очистка при удалении записей
- Безопасные URL для доступа к изображениям

## Использование

### Базовое использование

```typescript
import ImageUpload from '../components/ImageUpload';

const MyComponent = () => {
    const [imageUrl, setImageUrl] = useState('');

    const handleImageUpload = (url: string) => {
        setImageUrl(url);
    };

    const handleImageRemove = () => {
        setImageUrl('');
    };

    return (
        <ImageUpload
            currentImageUrl={imageUrl}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            contentType="my-content-type"
            maxSize={5}
        />
    );
};
```

### Интеграция в форму

```typescript
const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: ''
});

const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
        ...prev,
        image_url: imageUrl
    }));
};

// В форме
<FormControl>
    <FormLabel>Изображение</FormLabel>
    <ImageUpload
        currentImageUrl={formData.image_url}
        onImageUpload={handleImageUpload}
        contentType="content-type"
    />
</FormControl>
```

## Настройка

### Конфигурация API

В `src/services/ImageService.ts` настроен базовый URL API:

```typescript
const API_BASE_URL = 'http://localhost:8000';
```

### Настройка папок

Папки для разных типов контента настраиваются в методе `getFolderByContentType`:

```typescript
const folderMap: Record<string, string> = {
    'perfomances': 'perfomances',
    'actors': 'actors',
    'directors': 'directors',
    'news': 'news',
    'archive': 'archive',
    'achievements': 'achievements'
};
```

## Требования

- React 18+
- TypeScript 4.9+
- Chakra UI 2.10+
- Axios 1.10+
- React Icons 5.5+

## Зависимости

Убедитесь, что установлены все необходимые зависимости:

```bash
npm install axios @chakra-ui/react @emotion/react @emotion/styled framer-motion react-icons
```

## Troubleshooting

### Ошибки загрузки

1. Проверьте подключение к backend
2. Убедитесь, что MinIO запущен
3. Проверьте права доступа к bucket'у
4. Проверьте размер и формат файла

### Ошибки отображения

1. Проверьте URL изображения
2. Убедитесь, что изображение доступно в MinIO
3. Проверьте CORS настройки MinIO

### Ошибки удаления

1. Проверьте права на удаление
2. Убедитесь, что файл существует
3. Проверьте логи backend'а

## Разработка

### Добавление нового типа контента

1. Добавьте новый тип в `folderMap` в `ImageService.ts`
2. Создайте соответствующую страницу админ-панели
3. Интегрируйте компонент `ImageUpload`
4. Добавьте роут в `App.tsx`

### Кастомизация компонента

Компонент `ImageUpload` можно кастомизировать:

- Изменить максимальный размер файла
- Добавить дополнительные валидации
- Изменить UI/UX
- Добавить дополнительные callback'и

## Лицензия

Проект разработан для театральной студии "Антракт".