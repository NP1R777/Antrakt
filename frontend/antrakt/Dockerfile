# Многоэтапная сборка для React приложения
FROM node:18-alpine as build

# Установка необходимых системных пакетов
RUN apk add --no-cache git

WORKDIR /app

# Копируем файлы зависимостей для лучшего кэширования
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci --only=production --silent

# Копируем исходный код
COPY . .

# Собираем приложение для production
RUN npm run build

# Production стадия с nginx
FROM nginx:alpine

# Устанавливаем дополнительные пакеты для безопасности
RUN apk add --no-cache curl

# Удаляем стандартную конфигурацию nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем собранное приложение
COPY --from=build /app/build /usr/share/nginx/html

# Копируем кастомную конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Создаем пользователя nginx для безопасности
RUN addgroup -g 101 -S nginx && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# Устанавливаем правильные права доступа
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Переключаемся на пользователя nginx
USER nginx

# Проверка здоровья
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Expose порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]