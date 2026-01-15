# Star Wars Telegram Bot

**🤖 Асинхронный бот для изучения вселенной Star Wars через Telegram API**

## ✨ Функционал
- 📋 Выбор тем: персонажи, фильмы, планеты, разновидности, звездолеты, транспортные средства
- 🔍 Поиск по категориям SWAPI
- 💾 SQLite база пользователей
- 📜 Сохранение истории запросов и регистрация пользователей

## 🏗️ Архитектура
```
python_basic_diploma/ 
├── api/
├── database/
├── handlers/
├── keyboards/
├── models/
├── state/
├── utils/
├── .env.template
├── .gitignore
├── loader.py
├── main.py
└── requirements.txt
```

## 🚀 Быстрый старт

1. **Клонируй проект**
```bash
git clone <repo>
cd python_basic_diploma
```

2. **Создай виртуальное окружение**
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate  # Windows
```

3. **Установи зависимости**
```bash
pip install -r requirements.txt
```

4. **Настрой конфиг**
```env
# config/.env
BOT_TOKEN='Ваш токен для бота, полученный от @BotFather'
```

5. **Запусти**
```bash
python main.py
```

## 📚 Используемые технологии
- **pyTelegramBotAPI** — Telegram Bot API
- **sqlite3** — легковесная БД
- **Black** — автоформатирование кода
- **Type hints** — полная типизация


## 🧪 FSM Состояния
```
StateStarWars:
├── choosing_a_topic → peoples|films|planets|species|starships|vehicles
```

