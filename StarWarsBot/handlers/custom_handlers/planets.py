from telebot.types import Message, CallbackQuery
from telebot.states.sync.context import StateContext
from telebot.custom_filters import TextFilter

from loader import bot, client, history_rep
from state.states import StateStarWars
from keyboards import create_inline_keyboard, create_reply_keyboard
from api.services import PlanetProcessor
from database.connection_db import get_connection
from utils.telegram_sticker import FOXY_COMRADE_ID


def get_all_planets(message: Message, state: StateContext) -> None:
    """Возвращает в Telegram список всех планет в виде inline клавиатуры."""

    bot.send_sticker(message.chat.id, FOXY_COMRADE_ID)

    reply_keyboard = create_reply_keyboard(("Вернуться к выбору тем",))
    bot.send_message(message.chat.id, "Загружаю планеты!", reply_markup=reply_keyboard)

    response = client.get("planets")
    planets = ((planet["name"], planet["url"]) for planet in response)

    inline_keyboard = create_inline_keyboard(planets, row_width=3)
    bot.send_message(message.chat.id, "Список планет", reply_markup=inline_keyboard)

    state.set(StateStarWars.planets)


@bot.message_handler(
    text=TextFilter(equals="Планеты"), state=StateStarWars.choosing_a_topic
)
@bot.message_handler(text=TextFilter(equals="Планеты"), state=StateStarWars.planets)
def get_all_planets_handler(message: Message, state: StateContext) -> None:
    """Хендлер для получения списка планет."""

    get_all_planets(message, state)

    with get_connection() as conn:
        history_rep.save_history(conn, message.from_user.id, message.text)


@bot.callback_query_handler(func=lambda call: True, state=StateStarWars.planets)
def get_planet_handler(call: CallbackQuery):
    """Callback возвращает в Telegram данные о выбранной планете."""

    bot.answer_callback_query(call.id, "Загружаю данные о планете")

    planet = PlanetProcessor(call)
    planet_data = planet.process_sync()
    planet_message = planet.format_message()
    bot.send_message(call.message.chat.id, planet_message, parse_mode="HTML")

    reply_keyboard = create_reply_keyboard(("Вернуться к выбору тем",))
    bot.send_message(
        call.message.chat.id,
        "Можешь выбрать еще планету или вернуться к темам👇",
        reply_markup=reply_keyboard,
    )

    with get_connection() as conn:
        history_rep.save_history(conn, call.from_user.id, planet_data["name"])
