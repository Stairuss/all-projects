def read_file(path_to_file: str) -> str:
    """
    Читает текстовый файл и возвращает содержимое.

    Args:
        path_to_file (str): Путь к файлу.

    Returns:
        str: Содержимое файла.
    """
    
    with open(path_to_file, "r", encoding="utf-8") as file:
        return file.read()
