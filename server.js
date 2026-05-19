const express = require('express');
const path = require('path');
// Заменяем обычный sqlite3 на sqlite3-offline, чтобы Vercel не ругался при сборке
const sqlite3 = require('sqlite3-offline').verbose(); 
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// Раскомментировали базу данных, чтобы переменная db снова существовала!
const db = new sqlite3.Database(path.join(__dirname, 'olimp.db'), (err) => {
    if (err) console.error(err.message);
    else console.log('Подключено к базе SQLite.');
});


db.serialize(() => {
    
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        phone TEXT,
        password TEXT,
        createdAt TEXT
    )`);

    
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        items TEXT,     -- Здесь будем хранить товары в формате JSON
        total REAL,     -- Итоговая сумма
        status TEXT,    -- Статус ("Оплачено", "В обработке")
        date TEXT       -- Дата заказа
    )`);

    
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        className TEXT, -- Название тренировки (например, "Йога")
        day TEXT,       -- День недели
        time TEXT,      -- Время
        createdAt TEXT
    )`);
});

/* =========================================
   ЭНДПОИНТЫ (API ПУТИ)
========================================= */

// --- АВТОРИЗАЦИЯ ---
app.post('/api/register', (req, res) => {
    const { name, email, phone, password, createdAt } = req.body;
    const sql = `INSERT INTO users (name, email, phone, password, createdAt) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [name, email, phone, password, createdAt], function(err) {
        if (err) return res.status(400).json({ error: "Email уже занят" });
        res.json({ id: this.lastID });
    });
});

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;
    db.get(`SELECT * FROM users WHERE (email = ? OR phone = ?) AND password = ?`, [login, login, password], (err, user) => {
        if (err || !user) return res.status(401).json({ error: "Неверные данные" });
        res.json(user);
    });
});

// --- ЗАКАЗЫ (Orders) ---

// Сохранить новый заказ
app.post('/api/orders', (req, res) => {
    const { userId, items, total, status, date } = req.body;
    const sql = `INSERT INTO orders (userId, items, total, status, date) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [userId, JSON.stringify(items), total, status, date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: "Заказ успешно оформлен!" });
    });
});

// Получить все заказы конкретного пользователя (для профиля)
app.get('/api/orders/:userId', (req, res) => {
    const sql = `SELECT * FROM orders WHERE userId = ? ORDER BY id DESC`;
    db.all(sql, [req.params.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Обратно превращаем строку в нормальный массив перед отправкой на сайт
        const orders = rows.map(row => ({...row, items: JSON.parse(row.items)}));
        res.json(orders);
    });
});

// --- ЗАПИСИ (Bookings) ---

// Сохранить новую запись на тренировку
app.post('/api/bookings', (req, res) => {
    const { userId, className, day, time, createdAt } = req.body;
    const sql = `INSERT INTO bookings (userId, className, day, time, createdAt) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [userId, className, day, time, createdAt], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: "Вы успешно записаны!" });
    });
});

// Получить записи конкретного пользователя (для профиля)
app.get('/api/bookings/:userId', (req, res) => {
    const sql = `SELECT * FROM bookings WHERE userId = ? ORDER BY id DESC`;
    db.all(sql, [req.params.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Подключение к БД
const db = new sqlite3.Database('olimp.db');

// Настройка API для заказов
app.post('/api/orders', (req, res) => {
    const { userId, items, total, date } = req.body;
    
    // Вставляем заказ в таблицу orders
    const sql = `INSERT INTO orders (userId, items, total, status, date) VALUES (?, ?, ?, ?, ?)`;
    const params = [userId, JSON.stringify(items), total, 'Оплачено', date];

    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'Заказ сохранен в базе' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});