from sqlite3 import Cursor, Connection
from pathlib import Path

from config import SQL_SCRIPTS_DIR
from ..connection_db import get_connection
from models.models import User
from utils.read_file import read_file


class UserRepository:
    """
    Repository для работы с пользователями.

    Attributes:
        sql_scripts (Path): Путь к SQL скриптам.
    """

    sql_scripts: Path = Path(SQL_SCRIPTS_DIR)

    def create_user(
        self, connection: Connection, telegram_id: int, first_name: str
    ) -> None:
        """
        Создает нового пользователя (если он еще не создан).

        Args:
            connection (Connection): Обьект соединения с БД.
            telegram_id (int): Идентификатор пользователя в телеграме.
            first_name (str): Имя пользователя в Telegram.
        """

        user: User = User(telegram_id, first_name)
        sql_query = read_file(self.sql_scripts / "create_user.sql")

        cursor: Cursor = connection.cursor()
        cursor.execute(sql_query, vars(user))

    def _get_user_for_telegram_id(
        self, cursor: Cursor, telegram_id: int
    ) -> User | None:
        """
        Получить пользователя из БД.

        Args:
            telegram_id (int): Идентификатор пользователя в телеграме.

        Return:
            User | None
        """

        sql_query = read_file(self.sql_scripts / "get_user_for_telegram_id.sql")

        cursor.execute(sql_query, {"telegram_id": telegram_id})
        row = cursor.fetchone()

        if row is None:
            return None

        user = User(telegram_id=row["telegram_id"], first_name=row["first_name"])
        user.id = row["id"]
        user.created_at = row["created_at"]
        return user

    def get_or_create(self, telegram_id: int, first_name: str) -> User:
        """
        Создает нового пользователя (если он еще не создан) и возвращает его.

        Args:
            telegram_id (int): Идентификатор пользователя в телеграме.
            first_name (str): Имя пользователя в телеграме.

        Return:
            User
        """

        with get_connection() as conn:
            cursor: Cursor = conn.cursor()

            self.create_user(cursor, telegram_id, first_name)
            return self._get_user_for_telegram_id(cursor, telegram_id)
