FROM node:18 as build

WORKDIR /app

# Копируем файлы зависимостей npm
COPY package.json package-lock.json ./

# Устанавливаем зависимости с помощью npm
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем проект
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf