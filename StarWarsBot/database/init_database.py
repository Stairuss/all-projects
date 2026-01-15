from pathlib import Path
from sqlite3 import Cursor

from utils.read_file import read_file
from config import SQL_SCRIPTS_DIR
from .connection_db import get_connection


sql_scripts = Path(SQL_SCRIPTS_DIR)


def init_database() -> None:
    """Инициализация БД"""
    sql_query = read_file(sql_scripts / "schema.sql")

    with get_connection() as conn:
        cursor: Cursor = conn.cursor()
        cursor.executescript(sql_query)
