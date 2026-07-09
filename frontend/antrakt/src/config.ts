// Базовый адрес backend API.
// В разработке — http://localhost:8000. В продакшене задайте REACT_APP_API_URL
// на этапе сборки (например, https://api.example.com). Завершающий слэш убирается.
export const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

// Публичный адрес хранилища изображений (MinIO/S3). Прежние захардкоженные
// ссылки вида http://localhost:9000 заменяются на этот адрес.
export const MEDIA_URL = (process.env.REACT_APP_MEDIA_URL || 'http://localhost:9000').replace(/\/+$/, '');
