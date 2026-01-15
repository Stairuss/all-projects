class ApiExeption(Exception):
    """Базовая ошибка API."""

    pass


class NotFoundError(Exception):
    """Ресурс не найден (404)."""

    pass


class RateLimitError(Exception):
    """Превышен лимит запросов (429)."""

    pass
