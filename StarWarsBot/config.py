from dotenv import load_dotenv, find_dotenv
import os
import sys
from typing import Tuple


def check_variables(const_name: str, error_message: str) -> str:
    """
    Проверка наличия переменной окружения на существование.

    Args:
        const_name (str): Название переменной окружение.
        error_message (str): Сообщение об ошибке при отсутствии переменной.

    Return: str
    """
    env_const = os.getenv(const_name)
    if env_const is None:
        sys.exit(error_message)

    return env_const


if not find_dotenv():
    exit("Переменные окружения не загружены т.к отсутствует файл .env")
else:
    load_dotenv()


BOT_TOKEN = check_variables("BOT_TOKEN", "BOT_TOKEN отсутствует в переменных окружения")

API_BASE_URL = check_variables("API_BASE_URL", "Отсутствует url используемого API")

DB_STAR_WARS = check_variables("DB_STAR_WARS", "Отсутствует путь к базе данных")

SQL_SCRIPTS_DIR = check_variables("SQL_SCRIPTS_DIR", "Отсутствует путь к sql скриптам")

DEFAULT_COMMANDS: Tuple[Tuple[str, str]] = (
    ("start", "Запустить бота"),
    ("help", "Вывести справку"),
    ("history", "Вывести историю последних 10 запросов"),
)
