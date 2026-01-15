from telebot.types import Message, CallbackQuery
from telebot.states.sync.context import StateContext
from telebot.custom_filters import TextFilter

from loader import bot, client, history_rep
from state.states import StateStarWars
from keyboards import create_inline_keyboard, create_reply_keyboard
from api.services import FilmProcessor
from database.connection_db import get_connection
from utils.telegram_sticker import MR_CAT_ID


def get_all_films(message: Message, state: StateContext) -> None:
    """Возвращает в Telegram список всех фильмов в виде inline клавиатуры."""

    bot.send_sticker(message.chat.id, MR_CAT_ID)

    reply_keyboard = create_reply_keyboard(("Вернуться к выбору тем",))
    bot.send_message(message.chat.id, "Загружаю фильмы!", reply_markup=reply_keyboard)

    response = client.get("films")
    films = ((film["title"], film["url"]) for film in response)

    inline_keyboard = create_inline_keyboard(films)
    bot.send_message(message.chat.id, "Список фильмов", reply_markup=inline_keyboard)

    state.set(StateStarWars.films)


@bot.message_handler(
    text=TextFilter(equals="Фильмы"), state=StateStarWars.choosing_a_topic
)
@bot.message_handler(text=TextFilter(equals="Фильмы"), state=StateStarWars.films)
def get_all_films_handler(message: Message, state: StateContext) -> None:
    """Хендлер для получения списка фильмов."""

    get_all_films(message, state)

    with get_connection() as conn:
        history_rep.save_history(conn, message.from_user.id, message.text)


@bot.callback_query_handler(func=lambda call: True, state=StateStarWars.films)
def get_film_handler(call: CallbackQuery):
    """Callback возвращает в Telegram данные о выбранном фильме."""

    bot.answer_callback_query(call.id, "Загружаю данные о фильме")

    film = FilmProcessor(call)
    film_data = film.process_sync()
    film_message = film.format_message()
    bot.send_message(call.message.chat.id, film_message, parse_mode="HTML")

    reply_keyboard = create_reply_keyboard(("Вернуться к выбору тем",))
    bot.send_message(
        call.message.chat.id,
        "Можешь выбрать еще фильм или вернуться к темам👇",
        reply_markup=reply_keyboard,
    )

    with get_connection() as conn:
        history_rep.save_history(conn, call.from_user.id, film_data["title"])
