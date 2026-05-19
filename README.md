<<<<<<< HEAD
# СПОРТКОМПЛЕКС «ОЛИМП» — сайт

Современный адаптивный сайт фитнес-клуба на чистом HTML, CSS и JavaScript.

## Структура

```
olimp-site/
├── index.html, services.html, trainers.html, price.html
├── schedule.html, shop.html, cart.html, about.html, contacts.html
├── login.html, registration.html, profile.html
├── css/ (style.css, adaptive.css, animations.css)
├── js/ (main, auth, cart, schedule, map, slider, services, trainers, contacts)
└── assets/
```

## Запуск локально

Откройте `index.html` через локальный сервер (рекомендуется):

```bash
npx serve .
```

или расширение **Live Server** в VS Code/Cursor.

> Геолокация и часть API карт работают только по HTTPS или на `localhost`.

## Функционал

- Тёмная премиальная тема, glassmorphism, AOS-анимации, Swiper-отзывы
- Бургер-меню на мобильных
- Регистрация / вход / личный кабинет (`localStorage`)
- Корзина мерча (12 товаров), расписание с записью
- Демо-оплата картой, геолокация и расстояние до клуба (Haversine)

## Публикация

### GitHub Pages

1. Создайте репозиторий на GitHub и загрузите проект.
2. **Settings → Pages → Source**: ветка `main`, папка `/ (root)`.
3. Сайт будет доступен по адресу `https://username.github.io/repo-name/`.

### Reg.ru / Timeweb

1. Закажите хостинг и домен (например `olimp-fit.ru`).
2. Загрузите файлы в `public_html` через FTP или файловый менеджер.
3. В панели хостинга привяжите домен к каталогу сайта.

### SSL

- **GitHub Pages** — HTTPS включён автоматически.
- **Reg.ru / Timeweb** — включите бесплатный Let's Encrypt в панели хостинга для вашего домена.

### Домен

В DNS добавьте A-запись на IP хостинга или CNAME для GitHub Pages (`username.github.io`).

## Демо-данные

Координаты клуба (для карты и расстояния): `55.751244, 37.618423` — ул. Спортивная, 15, Москва.
=======
# olimp-fit.github.io
>>>>>>> ac16ee55d73ddbcf7ef71eb57ac3c42ecd602b0b
