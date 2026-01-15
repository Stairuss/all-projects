from telebot.types import Message
from telebot.states.sync.context import StateContext
from loader import bot, user_rep, history_rep
from keyboards import create_reply_keyboard
from state.states import StateStarWars
from database.connection_db import get_connection
from utils.telegram_sticker import RESISTANCE_DOG_ID


@bot.message_handler(commands=["start"])
def start_habdler(message: Message, state: StateContext) -> None:
    """Хендлер запуска бота и регистрация пользователя."""

    bot.send_sticker(message.chat.id, RESISTANCE_DOG_ID)

    keyboard = create_reply_keyboard(
        ("Фильмы", "Персонажи", "Планеты", "Разновидности", "Транспорт", "Звездолеты")
    )

    bot.send_message(
        message.chat.id,
        f"Привет {message.from_user.first_name} я бот который все знает о звездных войнах, выбери тему о которой хотел бы узнать.",
        reply_markup=keyboard,
    )

    state.set(StateStarWars.choosing_a_topic)

    with get_connection() as conn:
        user_rep.create_user(conn, message.from_user.id, message.from_user.first_name)
        history_rep.save_history(conn, message.from_user.id, message.text)
