from telebot.types import Message, CallbackQuery
from telebot.states.sync.context import StateContext
from telebot.custom_filters import TextFilter

from loader import bot, client, history_rep
from state.states import StateStarWars
from keyboards import create_inline_keyboard, create_reply_keyboard
from api.services import PeopleProcessor
from database.connection_db import get_connection
from utils.telegram_sticker import PANDA_EMIC_ID


def get_all_peoples(message: Message, state: StateContext) -> None:
    """Возвращает в Telegram список всех персонажей в виде inline клавиатуры."""

    bot.send_sticker(message.chat.id, PANDA_EMIC_ID)

    reply_keyboard = create_reply_keyboard(("Вернуться к выбору тем",))
    bot.send_message(
        message.chat.id, "Загружаю персонажей!", reply_markup=reply_keyboard
    )

    response = client.get("people")
    peoples = ((people["name"], people["url"]) for people in response)

    inline_keyboard = create_inline_keyboard(peoples, row_width=3)
    bot.send_message(message.chat.id, "Список персонажей", reply_markup=inline_keyboard)

    state.set(StateStarWars.peoples)


@bot.message_handler(
    text=TextFilter(equals="Персонажи"), state=StateStarWars.choosing_a_topic
)
@bot.message_handler(text=TextFilter(equals="Персонажи"), state=StateStarWars.peoples)
def get_all_peoples_handler(message: Message, state: StateContext) -> None:
    """Хендлер для получения списка персонажей."""

    get_all_peoples(message, state)

    with get_connection() as conn:
        history_rep.save_history(conn, message.from_user.id, message.text)


@bot.callback_query_handler(func=lambda call: True, state=StateStarWars.peoples)
def get_people_handler(call: CallbackQuery):
    """Callback возвращает в Telegram данные о выбранном персонаже."""

    bot.answer_callback_query(call.id, "Загружаю данные о персонаже")

    people = PeopleProcessor(call)
    people_data = people.process_sync()
    people_message = people.format_message()
    bot.send_message(call.message.chat.id, people_message, parse_mode="HTML")

    reply_keyboard = create_reply_keyboard(("Вернуться к выбору тем",))
    bot.send_message(
        call.message.chat.id,
        "Можешь выбрать еще персонажа или вернуться к темам👇",
        reply_markup=reply_keyboard,
    )

    with get_connection() as conn:
        history_rep.save_history(conn, call.from_user.id, people_data["name"])
