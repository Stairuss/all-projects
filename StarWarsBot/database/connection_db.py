import sqlite3
from contextlib import contextmanager
from typing import Generator

from config import DB_STAR_WARS


@contextmanager
def get_connection() -> Generator[sqlite3.Connection, None, None]:
    """Контекстный менеджер подключения к БД"""
    conn: sqlite3.Connection = sqlite3.connect(DB_STAR_WARS)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.commit()
        conn.close()
