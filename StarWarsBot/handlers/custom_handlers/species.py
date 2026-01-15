from telebot.types import Message, CallbackQuery
from telebot.states.sync.context import StateContext
from telebot.custom_filters import TextFilter

from loader import bot, client, history_rep
from state.states import StateStarWars
from keyboards import create_inline_keyboard, create_reply_keyboard
from api.services import SpecieProcessor
from database.connection_db import get_connection


def get_all_species(message: Message, state: StateContext) -> None:
    """Возвращает в Telegram список всех разновидностей в виде inline клавиатуры."""

    bot.send_message(message.chat.id, "🤖")

    reply_keyboard = create_reply_keyboard(("Вернуться к выбору тем",))
    bot.send_message(
        message.chat.id, "Загружаю разновидности!", reply_markup=reply_keyboard
    )

    response = client.get("species")
    species = ((specie["name"], specie["url"]) for specie in response)

    inline_keyboard = create_inline_keyboard(species, row_width=3)
    bot.send_message(
        message.chat.id, "Список разновидностей", reply_markup=inline_keyboard
    )

    state.set(StateStarWars.species)


@bot.message_handler(
    text=TextFilter(equals="Разновидности"), state=StateStarWars.choosing_a_topic
)
@bot.message_handler(
    text=TextFilter(equals="Разновидности"), state=StateStarWars.species
)
def get_all_species_handler(message: Message, state: StateContext) -> None:
    """Хендлер для получения списка разновидностей."""

    get_all_species(message, state)

    with get_connection() as conn:
        history_rep.save_history(conn, message.from_user.id, message.text)


@bot.callback_query_handler(func=lambda call: True, state=StateStarWars.species)
def get_specie_handler(call: CallbackQuery):
    """Callback возвращает в Telegram данные о выбранной разновидности."""

    bot.answer_callback_query(call.id, "Загружаю данные о разновидности")

    specie = SpecieProcessor(call)
    specie_data = specie.process_sync()
    specie_message = specie.format_message()
    bot.send_message(call.message.chat.id, specie_message, parse_mode="HTML")

    reply_keyboard = create_reply_keyboard(("Вернуться к выбору тем",))
    bot.send_message(
        call.message.chat.id,
        "Можешь выбрать еще фильм или вернуться к темам👇",
        reply_markup=reply_keyboard,
    )

    with get_connection() as conn:
        history_rep.save_history(conn, call.from_user.id, specie_data["name"])
