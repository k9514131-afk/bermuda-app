# Dockerfile - Bermuda Full Stack App

FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# --- Backend Stage ---

FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    curl \
    nginx \
    mysql-client \
    composer

WORKDIR /app

# نسخ الواجهة الأمامية
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/package.json ./package.json

# نسخ الخلفية
COPY ./laravel-backend /app/laravel-backend

WORKDIR /app/laravel-backend

RUN composer install --no-dev --optimize-autoloader

RUN php artisan key:generate

EXPOSE 8000 3000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
