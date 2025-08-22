FROM node:18-alpine

WORKDIR /app

# Копирование package.json и установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Установка serve для обслуживания статических файлов
RUN npm install -g serve

# Запуск приложения
CMD ["serve", "-s", "build", "-l", "3000"]