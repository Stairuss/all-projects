/*
 * Создание базовых таблиц users и history
*/

PRAGMA foreign_keys = ON;

-- Создание таблицы users
CREATE TABLE IF NOT EXISTS users (    
    telegram_id INTEGER UNIQUE NOT NULL,
    first_name TEXT NOT NULL,    
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Создание таблицы history
CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_telegram_id  INTEGER,    
    searched_at TEXT DEFAULT (datetime('now', 'localtime')),
    command TEXT NOT NULL, 
    FOREIGN KEY (user_telegram_id) REFERENCES users (telegram_id)
);