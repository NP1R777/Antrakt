# Развёртывание в продакшене

Стек: Django (gunicorn) + PostgreSQL + MinIO (изображения) + React (nginx),
единый вход через Caddy с автоматическим HTTPS.

Публичные адреса после запуска:
- `https://<DOMAIN>` — сайт (React);
- `https://api.<DOMAIN>` — backend (Django/DRF), админка Django: `https://api.<DOMAIN>/admin/`;
- `https://s3.<DOMAIN>` — изображения (MinIO);
- `https://<DOMAIN>/sitemap.xml` — динамическая карта сайта (Django через Caddy);
- `https://<DOMAIN>/robots.txt` — robots с ссылкой на sitemap.

---

## 1. Что нужно подготовить самому (обязательно)

1. **Сервер** с Docker и Docker Compose (Linux, 2+ ГБ RAM), открытые порты **80** и **443**.
2. **Домен** и DNS `A`-записи на **IP вашего VPS** для трёх имён:
   - `DOMAIN` (например `nskfolktheatre.ru`),
   - `api.DOMAIN`,
   - `s3.DOMAIN`.
   (Caddy сам получит SSL-сертификаты Let’s Encrypt для всех трёх.)

   **Если домен куплен не там же, где VPS** (например домен на Reg.ru, сервер на BeGet):
   1. В панели BeGet узнайте **публичный IP** VPS.
   2. В панели Reg.ru → домен → **DNS-серверы и зона** (или «Управление зоной»):
      - запись `@` (или `nskfolktheatre.ru`) типа **A** → IP VPS BeGet;
      - запись `api` типа **A** → тот же IP;
      - запись `s3` типа **A** → тот же IP;
      - если есть **AAAA** (IPv6) на старый хостинг Reg.ru — удалите или поправьте,
        иначе браузер может ходить на старый сервер.
   3. Отключите/не используйте «сайт на хостинге» Reg.ru для этого домена —
      иначе открывается заглушка Reg.ru («Сайт размещен некорректно»), а не ваш VPS.
   4. Проверка с любого ПК (подставьте свой IP VPS):
      ```bash
      dig +short nskfolktheatre.ru A
      dig +short api.nskfolktheatre.ru A
      dig +short s3.nskfolktheatre.ru A
      ```
      Все три должны вернуть IP BeGet. DNS может обновляться от минут до 24 часов.
3. **Файл `.env.prod`** — скопируйте из примера и заполните:
   ```bash
   cp .env.prod.example .env.prod
   ```
   - `DOMAIN` — ваш домен.
   - `SECRET_KEY` — длинный случайный ключ:
     `python -c "import secrets; print(secrets.token_urlsafe(64))"`.
   - `DATABASE_PASSWORD` — надёжный пароль БД.
   - `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` — логин/пароль хранилища.
   - Почта (см. раздел 3) и, при необходимости, ВК-парсер (раздел 4).

## 2. Запуск

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

Что произойдёт автоматически:
- поднимутся PostgreSQL и MinIO (с постоянными томами), создастся бакет с публичным чтением;
- backend дождётся БД, применит миграции, соберёт статику и запустит gunicorn;
- соберётся и раздастся фронтенд;
- Caddy получит HTTPS-сертификаты и проксирует все три поддомена.

Создать суперпользователя (админа сайта):
```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```
> Важно: у пользователя должен быть уникальный `phone_number` (в БД поле NOT NULL).
> Роль «админ» на сайте определяется флагом `is_superuser`.

Обновление после изменений в коде:
```bash
git pull
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

## 3. Почта (ОБЯЗАТЕЛЬНО для регистрации и восстановления пароля)

Без SMTP код подтверждения регистрации и новый пароль **не отправляются**
(в dev они просто печатаются в консоль). Для реальной отправки нужен почтовый
ящик и **пароль приложения**.

Пример для Яндекс.Почты:
1. Заведите/используйте ящик `...@yandex.ru`.
2. Яндекс ID → **Безопасность** → **Пароли приложений** → тип **«Почта (SMTP)»** → создайте пароль.
3. В `.env.prod` укажите:
   ```env
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.yandex.ru
   EMAIL_PORT=465
   EMAIL_USE_SSL=True
   EMAIL_HOST_USER=ваш_ящик@yandex.ru
   EMAIL_HOST_PASSWORD=пароль_приложения
   DEFAULT_FROM_EMAIL=ваш_ящик@yandex.ru
   ```
   `DEFAULT_FROM_EMAIL` должен совпадать с `EMAIL_HOST_USER` (требование Яндекса).

Другой провайдер — поменяйте `EMAIL_HOST`/`EMAIL_PORT` и режим SSL/TLS.

## 4. Парсер отзывов ВК (необязательно)

Чтобы секция «Что говорят о нас» наполнялась из группы ВК, задайте **одно** из:
- `VK_SESSION_COOKIE` — значение cookie `remixsid` из браузера, где вы вошли во ВКонтакте (HTML-парсинг), **либо**
- `VK_ACCESS_TOKEN` — сервисный ключ вашего приложения `dev.vk.com` (надёжнее).

Запуск парсера вручную / по расписанию (раз в 2 недели, cron на сервере):
```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml exec backend python manage.py parse_vk_reviews
```
Также есть кнопка «Обновить из ВК» в админке сайта.

## 5. Безопасность — что сделать самому

- **Смените ранее засветившиеся секреты.** В истории git были реальные значения
  пароля почты и ВК-токена/куки — их нужно **отозвать/сменить** (сменить пароль
  приложения почты, разлогинить сессии ВК). В коде значения по умолчанию убраны —
  всё берётся из окружения.
- Не коммитьте `.env.prod` (уже в `.gitignore`).
- Регулярно делайте бэкапы томов `pg_data` (БД) и `minio_data` (изображения).

## 6. Проверка после запуска

- Сайт открывается по `https://<DOMAIN>`, изображения грузятся.
- Логин/регистрация работают, письма приходят.
- Админка сайта (`https://<DOMAIN>/admin`) и Django-админка (`https://api.<DOMAIN>/admin/`) доступны.
