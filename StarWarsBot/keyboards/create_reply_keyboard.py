from typing import Tuple, Generator

from telebot.types import ReplyKeyboardMarkup, KeyboardButton


def create_reply_keyboard(button_data: Tuple[str]) -> ReplyKeyboardMarkup:
    """
    Создание reply клавиатуры.

    Args:
       button_data (Tuple[str]): Текст создаваемых кнопок.

    Returns:
       ReplyKeyboardMarkup.
    """

    markup: ReplyKeyboardMarkup = ReplyKeyboardMarkup(resize_keyboard=True)
    buttons: Generator[KeyboardButton, None, None] = (
        KeyboardButton(i_button) for i_button in button_data
    )
    markup.add(*buttons)
    return markup
