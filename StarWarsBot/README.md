# Star Wars Telegram Bot

**🤖 Бот для изучения вселенной Star Wars через Telegram API**


## ✨ Функционал
- 📋 Выбор тем: персонажи, фильмы, планеты, разновидности, звездолеты, транспортные средства
- 🔍 Поиск по категориям SWAPI
- 💾 SQLite база пользователей
- 📜 Сохранение истории запросов и регистрация пользователей


## 📱 Команды бота

### Основные команды
**/start** — Приветствие пользователя и показ главного меню с выбором категорий

**/help** — Показать справку по доступным командам и категориям

**/history** — Показать историю последних 10 запросов

### Поиск по SWAPI (через интерактивные кнопки)
**Выбор категории** → **поиск по названию** → **результаты SWAPI**

**Любая категория** (Персонажи, Фильмы, Планеты, Разновидности, Звездолеты, Транспорт):


## 🌐 Используемые онлайн сервисы

### SWAPI.dev (Star Wars API)
**Базовый URL:** [https://swapi.info/]

**Доступные endpoints:**

| Метод |   Endpoint   |             Описание             |
|-------|--------------|----------------------------------|
| `GET` | `/people`    | Список всех персонажей           |
| `GET` | `/planets`   | Список всех планет               |
| `GET` | `/films`     | Список всех фильмов              |
| `GET` | `/species`   | Список всех видов                |
| `GET` | `/starships` | Список всех звездолётов          |
| `GET` | `/vehicles`  | Список всех транспортных средств |

**Пример запроса**
```bash
curl "https://swapi.info/{category}/{id}"
```

**Пример запроса всех персонажей**
```bash
curl "https://swapi.info/people"
```

**Пример запроса персонажа "Luke Skywalker":**
```bash
curl "https://swapi.info/people/1"
```

**Что возвращает каждый endpoint:**

### `/people` — персонажи
```json
{
    "name": "Luke Skywalker",
    "height": "172",
	"mass": "77",
	"hair_color": "blond",
    "skin_color": "fair",
    "eye_color": "blue",
    "birth_year": "19BBY",
    "gender": "male",
    "homeworld": "https://swapi.info/api/planets/1",
	"films": [
		"https://swapi.info/api/films/1",
		"https://swapi.info/api/films/2",
		"https://swapi.info/api/films/3",
		"https://swapi.info/api/films/6"
	],
	"species": [],
	"vehicles": [
		"https://swapi.info/api/vehicles/14",
		"https://swapi.info/api/vehicles/30"
	],
	"starships": [
		"https://swapi.info/api/starships/12",
		"https://swapi.info/api/starships/22"
	]
}
```

### `/films` — фильмы
```json
{
    "title": "A New Hope",
	"episode_id": 4,
	"opening_crawl": "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
	"director": "George Lucas",
	"producer": "Gary Kurtz, Rick McCallum",
	"release_date": "1977-05-25",
	"characters": [
		"https://swapi.info/api/people/1",
		"https://swapi.info/api/people/2",
		"https://swapi.info/api/people/3",
		"https://swapi.info/api/people/4",
		"https://swapi.info/api/people/5",
		"https://swapi.info/api/people/6",
		"https://swapi.info/api/people/7",
		"https://swapi.info/api/people/8",
		"https://swapi.info/api/people/9",
		"https://swapi.info/api/people/10",
		"https://swapi.info/api/people/12",
		"https://swapi.info/api/people/13",
		"https://swapi.info/api/people/14",
		"https://swapi.info/api/people/15",
		"https://swapi.info/api/people/16",
		"https://swapi.info/api/people/18",
		"https://swapi.info/api/people/19",
		"https://swapi.info/api/people/81"
	],
	"planets": [
		"https://swapi.info/api/planets/1",
		"https://swapi.info/api/planets/2",
		"https://swapi.info/api/planets/3"
	],
	"starships": [
		"https://swapi.info/api/starships/2",
		"https://swapi.info/api/starships/3",
		"https://swapi.info/api/starships/5",
		"https://swapi.info/api/starships/9",
		"https://swapi.info/api/starships/10",
		"https://swapi.info/api/starships/11",
		"https://swapi.info/api/starships/12",
		"https://swapi.info/api/starships/13"
	],
	"vehicles": [
		"https://swapi.info/api/vehicles/4",
		"https://swapi.info/api/vehicles/6",
		"https://swapi.info/api/vehicles/7",
		"https://swapi.info/api/vehicles/8"
	],
	"species": [
		"https://swapi.info/api/species/1",
		"https://swapi.info/api/species/2",
		"https://swapi.info/api/species/3",
		"https://swapi.info/api/species/4",
		"https://swapi.info/api/species/5"
	]
}
```

### `/planets` — планеты
```json
{
    "name": "Tatooine",
	"rotation_period": "23",
	"orbital_period": "304",
	"diameter": "10465",
	"climate": "arid",
	"gravity": "1 standard",
	"terrain": "desert",
	"surface_water": "1",
	"population": "200000",
	"residents": [
		"https://swapi.info/api/people/1",
		"https://swapi.info/api/people/2",
		"https://swapi.info/api/people/4",
		"https://swapi.info/api/people/6",
		"https://swapi.info/api/people/7",
		"https://swapi.info/api/people/8",
		"https://swapi.info/api/people/9",
		"https://swapi.info/api/people/11",
		"https://swapi.info/api/people/43",
		"https://swapi.info/api/people/62"
	],
	"films": [
		"https://swapi.info/api/films/1",
		"https://swapi.info/api/films/3",
		"https://swapi.info/api/films/4",
		"https://swapi.info/api/films/5",
		"https://swapi.info/api/films/6"
	]
}
```

### `/species` — разновидности
```json
{
    "name": "Human",
	"classification": "mammal",
	"designation": "sentient",
	"average_height": "180",
	"skin_colors": "caucasian, black, asian, hispanic",
	"hair_colors": "blonde, brown, black, red",
	"eye_colors": "brown, blue, green, hazel, grey, amber",
	"average_lifespan": "120",
	"homeworld": "https://swapi.info/api/planets/9",
	"language": "Galactic Basic",
	"people": [
		"https://swapi.info/api/people/66",
		"https://swapi.info/api/people/67",
		"https://swapi.info/api/people/68",
		"https://swapi.info/api/people/74"
	],
	"films": [
		"https://swapi.info/api/films/1",
		"https://swapi.info/api/films/2",
		"https://swapi.info/api/films/3",
		"https://swapi.info/api/films/4",
		"https://swapi.info/api/films/5",
		"https://swapi.info/api/films/6"
	]
}
```

### `/starships` — звездолеты
```json
{
    "name": "CR90 corvette",
	"model": "CR90 corvette",
	"manufacturer": "Corellian Engineering Corporation",
	"cost_in_credits": "3500000",
	"length": "150",
	"max_atmosphering_speed": "950",
	"crew": "30-165",
	"passengers": "600",
	"cargo_capacity": "3000000",
	"consumables": "1 year",
	"hyperdrive_rating": "2.0",
	"MGLT": "60",
	"starship_class": "corvette",
	"pilots": [],
	"films": [
		"https://swapi.info/api/films/1",
		"https://swapi.info/api/films/3",
		"https://swapi.info/api/films/6"
	]
}
```

### `/vehicles` — транспорт
```json
{
    "name": "Sand Crawler",
	"model": "Digger Crawler",
	"manufacturer": "Corellia Mining Corporation",
	"cost_in_credits": "150000",
	"length": "36.8 ",
	"max_atmosphering_speed": "30",
	"crew": "46",
	"passengers": "30",
	"cargo_capacity": "50000",
	"consumables": "2 months",
	"vehicle_class": "wheeled",
	"pilots": [],
	"films": [
		"https://swapi.info/api/films/1",
		"https://swapi.info/api/films/5"
	]
}
```


## 🏗️ Архитектура
```
StarWarsBot/
│
├── 📡 api/                   # Клиент SWAPI (requests/aiohttp)
├── 🗄️ database/              # SQLite модели + CRUD
├── ⚙️ handlers/              # Хендлеры запросов Telegram
├── ⌨️ keyboards/             # InlineKeyboardMarkup и ReplyKeyboardMarkup клавиатуры
├── 🔧 models/                # Модели сущностей в виде @dataclasses
├── 🧠 state/                 # Состояние клиента
├── 🛠️ utils/                 # Утилиты
│
├── ⚙️ .env.template          # Шаблон конфигурации .env
├── 🚫 .gitignore             # Список игнорируемых файлов
├── 🚀 loader.py              # Инициализация и настройка бота
├── 🎯 main.py                # Запуск бота
└── 📦 requirements.txt       # Зависимости

```


## 🚀 Быстрый старт

1. **Клонируй проект**
```bash
git clone <repo>
cd StarWarsBot
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
- **pyTelegramBotAPI** — синхронный Telegram Bot API 
- **aiohttp** — асинхронный HTTP клиент для SWAPI запросов
- **sqlite3** — легковесная БД для пользователей и истории
- **Type hints** — полная типизация
- **Black** — автоформатирование кода


## 🧪 FSM Состояния
```
StateStarWars (pyTelegramBotAPI):
│
├── choosing_a_topic    # 📋 Выбор категории
├── peoples             # 👤 Поиск персонажей
├── films               # 🎬 Поиск фильмов
├── planets             # 🌌 Поиск планет
├── species             # 🧬 Поиск видов
├── starships           # 🚀 Поиск звездолётов
└── vehicles            # 🚗 Поиск транспорта

```

