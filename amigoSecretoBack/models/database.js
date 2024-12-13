const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Create tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS grupos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_group TEXT NOT NULL UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS user_grupos (
        id_group INTEGER NOT NULL,
        id_user INTEGER NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS sorteio (
        id_group INTEGER NOT NULL,
        id_user_secreto INTEGER NOT NULL,
        id_user_presenteado INTEGER NOT NULL
    )`);
});

module.exports = db;
