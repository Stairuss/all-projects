from loader import bot
from utils.set_bot_commands import set_default_commands
from database.init_database import init_database
from handlers import default_handlers, custom_handlers


if __name__ == "__main__":
    init_database()
    set_default_commands(bot)
    try:
        bot.infinity_polling(timeout=5, long_polling_timeout=5)
    except Exception as e:
        print(e)
