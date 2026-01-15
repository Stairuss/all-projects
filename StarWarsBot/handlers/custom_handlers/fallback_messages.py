from telebot.types import Message, CallbackQuery
from telebot.states.sync.context import StateContext
from telebot.custom_filters import TextFilter

from loader import bot, client
from state.states import StateStarWars
from keyboards import create_inline_keyboard, create_reply_keyboard
from api.services import FilmProcessor
from ..default_handlers.help import get_help
from .peoples import get_all_peoples
from .films import get_all_films
from .planets import get_all_planets
from .species import get_all_species
from .starships import get_all_starships
from .vehicles import get_all_vehicles


@bot.message_handler(func=lambda message: True, state=StateStarWars.choosing_a_topic)
def fallback_choosing_a_topic_handler(message: Message) -> None:
    """Fallback для НЕ распознанных сообщений при состоянии StateStarWars.choosing_a_topic"""
    bot.reply_to(message, "❌ Не понял команду")
    keyboard = create_reply_keyboard(
        ("Фильмы", "Персонажи", "Планеты", "Разновидности", "Транспорт", "Звездолеты")
    )
    bot.send_message(message.chat.id, f"Выбери тему", reply_markup=keyboard)


@bot.message_handler(func=lambda message: True, state=StateStarWars.peoples)
def fallback_peoples_handler(message: Message, state: StateContext) -> None:
    """Fallback для НЕ распознанных сообщений при состоянии StateStarWars.peoples"""
    bot.reply_to(message, "❌ Не понял команду, выбери персонажа.")
    get_all_peoples(message, state)


@bot.message_handler(func=lambda message: True, state=StateStarWars.films)
def fallback_films_handler(message: Message, state: StateContext) -> None:
    """Fallback для НЕ распознанных сообщений при состоянии StateStarWars.films"""
    bot.reply_to(message, "❌ Не понял команду, выбери фильм.")
    get_all_films(message, state)


@bot.message_handler(func=lambda message: True, state=StateStarWars.planets)
def fallback_planets_handler(message: Message, state: StateContext) -> None:
    """Fallback для НЕ распознанных сообщений при состоянии StateStarWars.planets"""
    bot.reply_to(message, "❌ Не понял команду, выбери планету.")
    get_all_planets(message, state)


@bot.message_handler(func=lambda message: True, state=StateStarWars.species)
def fallback_species_handler(message: Message, state: StateContext) -> None:
    """Fallback для НЕ распознанных сообщений при состоянии StateStarWars.species"""
    bot.reply_to(message, "❌ Не понял команду, выбери разновидность.")
    get_all_species(message, state)


@bot.message_handler(func=lambda message: True, state=StateStarWars.starships)
def fallback_starships_handler(message: Message, state: StateContext) -> None:
    """Fallback для НЕ распознанных сообщений при состоянии StateStarWars.starships"""
    bot.reply_to(message, "❌ Не понял команду, выбери звездолет.")
    get_all_starships(message, state)


@bot.message_handler(func=lambda message: True, state=StateStarWars.vehicles)
def fallback_vehicles_handler(message: Message, state: StateContext) -> None:
    """Fallback для НЕ распознанных сообщений при состоянии StateStarWars.vehicles"""
    bot.reply_to(message, "❌ Не понял команду, выбери транспорт.")
    get_all_vehicles(message, state)


@bot.message_handler(func=lambda message: True)
def fallback_handler(message: Message) -> None:
    """Fallback для НЕ распознанных сообщений при любом состоянии"""
    bot.reply_to(message, "❌ Не понял команду.")
    get_help(message)
