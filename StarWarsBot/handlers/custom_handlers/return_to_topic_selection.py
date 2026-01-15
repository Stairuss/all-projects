from telebot.custom_filters import TextFilter
from telebot.states.sync.context import StateContext
from telebot.types import Message

from loader import bot, history_rep
from keyboards import create_reply_keyboard
from state.states import StateStarWars
from database.connection_db import get_connection


def return_to_topic_selection(message: Message, state: StateContext):
    """Возвращает в Telegram список всех тем в виде reply клавиатуры."""

    keyboard = create_reply_keyboard(
        ("Фильмы", "Персонажи", "Планеты", "Разновидности", "Транспорт", "Звездолеты")
    )

    bot.send_message(message.chat.id, "Выбери тему", reply_markup=keyboard)

    state.set(StateStarWars.choosing_a_topic)


@bot.message_handler(text=TextFilter(equals="Вернуться к выбору тем"), state="*")
def return_to_topic_selection_handler(message: Message, state: StateContext) -> None:
    """Хендлер для получения списка тем."""

    return_to_topic_selection(message, state)

    with get_connection() as conn:
        history_rep.save_history(conn, message.from_user.id, message.text)
