const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3-offline').verbose();

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// Подключение к БД (файл olimp.db должен лежать в корне проекта)
const db = new sqlite3.Database(path.join(__dirname, 'olimp.db'), (err) => {
    if (err) console.error('Ошибка подключения:', err.message);
    else console.log('Подключено к базе SQLite.');
});

// Создание таблиц (если их нет)
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
        items TEXT,
        total REAL,
        status TEXT,
        date TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        className TEXT,
        day TEXT,
        time TEXT,
        createdAt TEXT
    )`);
});

// ========== API ЭНДПОИНТЫ ==========

// Регистрация
app.post('/api/register', (req, res) => {
    const { name, email, phone, password, createdAt } = req.body;
    const sql = `INSERT INTO users (name, email, phone, password, createdAt) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [name, email, phone, password, createdAt], function(err) {
        if (err) return res.status(400).json({ error: "Email уже занят" });
        res.json({ id: this.lastID });
    });
});

// Логин
app.post('/api/login', (req, res) => {
    const { login, password } = req.body;
    db.get(`SELECT * FROM users WHERE (email = ? OR phone = ?) AND password = ?`, [login, login, password], (err, user) => {
        if (err || !user) return res.status(401).json({ error: "Неверные данные" });
        res.json(user);
    });
});

// Создать заказ
app.post('/api/orders', (req, res) => {
    const { userId, items, total, status, date } = req.body;
    const sql = `INSERT INTO orders (userId, items, total, status, date) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [userId, JSON.stringify(items), total, status, date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: "Заказ успешно оформлен!" });
    });
});

// Получить заказы пользователя
app.get('/api/orders/:userId', (req, res) => {
    const sql = `SELECT * FROM orders WHERE userId = ? ORDER BY id DESC`;
    db.all(sql, [req.params.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const orders = rows.map(row => ({ ...row, items: JSON.parse(row.items) }));
        res.json(orders);
    });
});

// Запись на тренировку
app.post('/api/bookings', (req, res) => {
    const { userId, className, day, time, createdAt } = req.body;
    const sql = `INSERT INTO bookings (userId, className, day, time, createdAt) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [userId, className, day, time, createdAt], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: "Вы успешно записаны!" });
    });
});

// Получить записи пользователя
app.get('/api/bookings/:userId', (req, res) => {
    const sql = `SELECT * FROM bookings WHERE userId = ? ORDER BY id DESC`;
    db.all(sql, [req.params.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Экспортируем app для Vercel (serverless)
module.exports = app;