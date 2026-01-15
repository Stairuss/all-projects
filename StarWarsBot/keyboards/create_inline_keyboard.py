from typing import Tuple

from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton


def create_inline_keyboard(
    button_data: Tuple[Tuple[str, str]], row_width: int = 2
) -> InlineKeyboardMarkup:
    """
    Создание inline клавиатуры.

    Args:
        button_data (Tuple[str, str]): Данные кнопки (текст кнопки, callback).
        row_width (int): Кол-во кнопок в строке. Default = 2

    Returns:
        InlineKeyboardMarkup.
    """

    markup: InlineKeyboardMarkup = InlineKeyboardMarkup(row_width=row_width)
    buttons = (
        InlineKeyboardButton(i_button[0], callback_data=i_button[1])
        for i_button in button_data
    )
    markup.add(*buttons)
    return markup
