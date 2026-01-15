import aiohttp
import asyncio
from typing import Dict, Any, List


class AsyncApiClient:
    """
    Клиент для асинхронных HTTP-запросов с aiohttp.

    Предоставляет методы для одиночных и массовых GET-запросов.
    Зависимости: aiohttp, asyncio.
    """

    async def one_fetch(
        self, url: str, session: aiohttp.ClientSession
    ) -> Dict[str, Any]:
        """
        Отправляет асинхронный GET запрос на ресурс url.

        Args:
           url (str): URL ресурса для запроса.
           session (aiohttp.ClientSession): Асинхронная HTTP-сессия.

        Return:
            Dict[str, Any]: JSON-ответ от сервера.
        """

        async with session.get(url) as response:
            return await response.json()

    async def all_fetch(
        self, urls: List[str], session: aiohttp.ClientSession
    ) -> List[Dict[str, Any]]:
        """
        Выполняет несколько асинхронных GET-запросов параллельно.

        Args:
           urls (List[str]): Список URL для запросов.
           session (aiohttp.ClientSession): Асинхронная HTTP-сессия.

        Return:
            List[Dict[str, Any]]: Список JSON-ответов в том же порядке, что и urls.
        """

        tasks = [self.one_fetch(i_url, session) for i_url in urls]
        return await asyncio.gather(*tasks)
