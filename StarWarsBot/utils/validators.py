"""Валидаторы для StarWarsBot."""


def is_number(string: str) -> bool:
    """
    Проверяет, является ли строка числом.

    string (str): Входные данные для проверки.

    Returns:
        bool
    """

    try:
        float(string)
        return True
    except ValueError:
        return False


def is_positive_int(string: str) -> bool:
    """
    Проверяет положительное целое число.

    string (str): Входные данные для проверки.

    Returns:
        bool
    """

    return is_number(string) and int(string) > 0
