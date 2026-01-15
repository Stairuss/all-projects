from telebot.types import Message, CallbackQuery
from telebot.states.sync.context import StateContext
from telebot.custom_filters import TextFilter

from loader import bot, client, history_rep
from state.states import StateStarWars
from keyboards import create_inline_keyboard, create_reply_keyboard
from api.services import StarshipProcessor
from database.connection_db import get_connection
from utils.telegram_sticker import BODDY_BEAR_ID


def get_all_starships(message: Message, state: StateContext) -> None:
    """Возвращает в Telegram  список всех звездолетов в виде inline клавиатуры."""

    bot.send_sticker(message.chat.id, BODDY_BEAR_ID)

    reply_keyboard = create_reply_keyboard(("Вернуться к выбору тем",))
    bot.send_message(
        message.chat.id, "Загружаю звездолеты! ", reply_markup=reply_keyboard
    )

    response = client.get("starships")
    starships = ((starship["name"], starship["url"]) for starship in response)

    inline_keyboard = create_inline_keyboard(starships)
    bot.send_message(
        message.chat.id, "Список звездолетов!", reply_markup=inline_keyboard
    )

    state.set(StateStarWars.starships)


@bot.message_handler(
    text=TextFilter(equals="Звездолеты"), state=StateStarWars.choosing_a_topic
)
@bot.message_handler(
    text=TextFilter(equals="Звездолеты"), state=StateStarWars.starships
)
def get_all_starships_handler(message: Message, state: StateContext) -> None:
    """Хендлер для получения списка звездолетов."""

    get_all_starships(message, state)

    with get_connection() as conn:
        history_rep.save_history(conn, message.from_user.id, message.text)


@bot.callback_query_handler(func=lambda call: True, state=StateStarWars.starships)
def get_starship_handler(call: CallbackQuery):
    """Callback возвращает в Telegram данные о выбранном звездолете."""

    bot.answer_callback_query(call.id, "Загружаю данные о звездолете")

    starship = StarshipProcessor(call)
    starship_data = starship.process_sync()
    starship_message = starship.format_message()
    bot.send_message(call.message.chat.id, starship_message, parse_mode="HTML")

    reply_keyboard = create_reply_keyboard(("Вернуться к выбору тем",))
    bot.send_message(
        call.message.chat.id,
        "Можешь выбрать еще фильм или вернуться к темам👇",
        reply_markup=reply_keyboard,
    )

    with get_connection() as conn:
        history_rep.save_history(conn, call.from_user.id, starship_data["name"])
