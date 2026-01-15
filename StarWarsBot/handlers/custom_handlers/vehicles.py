from telebot.types import Message, CallbackQuery
from telebot.states.sync.context import StateContext
from telebot.custom_filters import TextFilter

from loader import bot, client, history_rep
from state.states import StateStarWars
from keyboards import create_inline_keyboard, create_reply_keyboard
from api.services import VehicleProcessor
from database.connection_db import get_connection
from utils.telegram_sticker import TONY_STAR_ID


def get_all_vehicles(message: Message, state: StateContext) -> None:
    """Возвращает в Telegram список всех транспортов в виде inline клавиатуры."""

    bot.send_sticker(message.chat.id, TONY_STAR_ID)

    reply_keyboard = create_reply_keyboard(("Вернуться к выбору тем",))
    bot.send_message(
        message.chat.id, "Загружаю транспорт!", reply_markup=reply_keyboard
    )

    response = client.get("vehicles")
    vehicles = ((vehicle["name"], vehicle["url"]) for vehicle in response)

    inline_keyboard = create_inline_keyboard(vehicles)
    bot.send_message(
        message.chat.id, "Список транспортов", reply_markup=inline_keyboard
    )

    state.set(StateStarWars.vehicles)


@bot.message_handler(
    text=TextFilter(equals="Транспорт"), state=StateStarWars.choosing_a_topic
)
@bot.message_handler(text=TextFilter(equals="Транспорт"), state=StateStarWars.vehicles)
def get_all_vehicles_handler(message: Message, state: StateContext) -> None:
    """Хендлер для получения списка транспортов."""

    get_all_vehicles(message, state)

    with get_connection() as conn:
        history_rep.save_history(conn, message.from_user.id, message.text)


@bot.callback_query_handler(func=lambda call: True, state=StateStarWars.vehicles)
def get_vehicle_handler(call: CallbackQuery):
    """Callback возвращает в Telegram данные о выбранном транспорте."""

    bot.answer_callback_query(call.id, "Загружаю данные о транспорте")

    vehicle = VehicleProcessor(call)
    vehicle_data = vehicle.process_sync()
    vehicle_message = vehicle.format_message()
    bot.send_message(call.message.chat.id, vehicle_message, parse_mode="HTML")

    reply_keyboard = create_reply_keyboard(("Вернуться к выбору тем",))
    bot.send_message(
        call.message.chat.id,
        "Можешь выбрать еще фильм или вернуться к темам👇",
        reply_markup=reply_keyboard,
    )

    with get_connection() as conn:
        history_rep.save_history(conn, call.from_user.id, vehicle_data["name"])
