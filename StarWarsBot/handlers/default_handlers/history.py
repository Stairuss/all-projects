from telebot.types import Message
from loader import bot, user_rep, history_rep
from database.connection_db import get_connection
from utils.telegram_sticker import SHAITAN_CHICK_ID


@bot.message_handler(commands=["history"])
def get_history_handler(message: Message) -> None:
    """Хендлер для получения истории последних 10 запросов."""

    bot.send_sticker(message.chat.id, SHAITAN_CHICK_ID)

    with get_connection() as conn:
        user_rep.create_user(conn, message.from_user.id, message.from_user.first_name)
        history_rep.save_history(conn, message.from_user.id, message.text)
        historys = history_rep.get_history(conn, message.from_user.id)

        if not historys:
            bot.send_message(message.chat.id, "История пустая")
        else:
            lines = [
                f"{index + 1}.  {history.command} - {history.searched_at}\n"
                for index, history in enumerate(historys)
            ]

            result = "".join(lines)

            bot.send_message(message.chat.id, result)
