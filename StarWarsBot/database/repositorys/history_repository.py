from sqlite3 import Cursor, Connection
from pathlib import Path
from typing import List

from config import SQL_SCRIPTS_DIR
from models.models import History
from utils.read_file import read_file


class HistoryRepository:
    """
    Repository для работы с историей запросов.

    Attributes:
        sql_scripts (Path): Путь к SQL скриптам.
    """

    sql_scripts: Path = Path(SQL_SCRIPTS_DIR)

    def save_history(
        self, connection: Connection, user_telegram_id: int, command: str
    ) -> None:
        """
        Сохраняет новый запрос в БД.

        Args:
            connection (Connection): Обьект соединения с БД.
            user_telegram_id (int): Идентификатор пользователя в телеграме, FOREIGN KEY -> users.
            command (str): Команда запроса от пользователя в Telegram.
        """

        history: History = History(user_telegram_id, command)
        sql_query = read_file(self.sql_scripts / "save_history.sql")

        cursor: Cursor = connection.cursor()
        cursor.execute(sql_query, vars(history))

    def get_history(
        self, connection: Connection, user_telegram_id: int
    ) -> List[History]:
        """
        Получает 10 последних запросов пользователя в Telegram из БД.

        Args:
            connection (Connection): Обьект соединения с БД.
            user_telegram_id (int): Идентификатор пользователя в телеграме, FOREIGN KEY -> users.

        Returns:
           List[History] список обьектов History.
        """

        sql_query = read_file(self.sql_scripts / "get_history.sql")

        cursor: Cursor = connection.cursor()
        cursor.execute(sql_query, (user_telegram_id,))
        row = cursor.fetchall()

        if not row:
            return []

        historys: List[History] = []
        for id, comand, searched_at in row:
            history = History(user_telegram_id, comand)
            history.id = id
            history.searched_at = searched_at
            historys.append(history)

        return historys
