from dataclasses import dataclass, field


@dataclass
class User:
    """
    Модель пользователя.

    Params:
        telegram_id (int): Идентификатор пользователя в телеграме.
        first_name (str): Имя пользователя в телеграме.
        created_at (str): Дата и время создания регистрации.
    """

    telegram_id: int
    first_name: str
    created_at: str = field(init=False)


@dataclass
class History:
    """
    Модель истории запросов.

    Params:
        user_telegram_id (int): Внешний ключ -> User.telegram_id .
        command (str): Команда телеграм бота.
        searched_at (str): Дата и время выполнения запроса.
    """

    id: int = field(init=False)
    user_telegram_id: int
    command: str
    searched_at: str = field(init=False)
