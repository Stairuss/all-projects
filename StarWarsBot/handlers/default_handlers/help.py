from telebot.types import Message
from loader import bot, user_rep, history_rep
from database.connection_db import get_connection
from utils.telegram_sticker import BODJELLYFISH_ID


def get_help(message: Message) -> None:
    """Возвращает в Telegram список доступных команд."""

    bot.send_message(
        message.chat.id,
        """
Доступные команды:                     
/start - Запуск бота
/history - Получить историю последних 10 запросов 
/help - Получить список доступных команд                    
""",
    )


@bot.message_handler(commands=["help"])
def get_help_handler(message: Message) -> None:
    """Хендлер для получения списка команд."""

    bot.send_sticker(message.chat.id, BODJELLYFISH_ID)
    get_help(message)

    with get_connection() as conn:
        user_rep.create_user(conn, message.from_user.id, message.from_user.first_name)
        history_rep.save_history(conn, message.from_user.id, message.text)
