import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from typing import Dict, Any
from utils.validators import is_positive_int
from .exceptions import ApiExeption, NotFoundError, RateLimitError


class ApiClient:
    """Клиент для синхронных HTTP запросов."""

    def __init__(self, base_url: str, max_retries: int = 3, timeout: int = 15) -> None:
        """
        Настройка клиента для работы с API.

        Args:
            base_url (str): Базовый URL API.
            max_retries (int): Кол-во повторных запросов при ошибке.
            timeout (int): Таймаут ожидания ответа (сек).

        Returns: 
            None
        """

        self.session: requests.Session = requests.Session()
        self.base_url: str = base_url
        self.timeout: int = timeout

        retry_strategy: Retry = Retry(
            total=max_retries,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )

        adapter: HTTPAdapter = HTTPAdapter(
            pool_connections=10,
            pool_maxsize=30,
            max_retries=retry_strategy,
        )

        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
        self.session.headers.update({"Accept": "application/json"})

    def __enter__(self) -> "ApiClient":
        """Вход в контекст."""

        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> bool:
        """Выход из контекста."""

        self.session.close()
        return False

    def _create_url(self, resource: str, id: int | None = None) -> str:
        """
        Сборка готового URL для обращения к API.

        Args:
            resource (str): Ресурс запроса.
            id (int | None): Идентификатор запроса.

        Returns:
            str: Полный URL.
        """

        if not isinstance(resource, str) or not resource.strip():
            raise ValueError("resource должен быть непустой строкой")
        resource = resource.strip("/")

        if self.base_url in resource:
            return resource

        if id is not None and is_positive_int(id):
            return f"{self.base_url}/{resource}/{id}"

        return f"{self.base_url}{resource}"

    def _request(
        self, method: str, resource: str, id: int | None = None
    ) -> Dict[str, Any]:
        """
        Универсальный HTTP запрос.

        Args:
            method (str): HTTP метод.
            resource (str): Ресурс запроса.
            id (int | None): Идентификатор запроса.

        Returns:
            Dict[str, Any]: JSON ответ API.
        """

        url: str = self._create_url(resource, id)
        try:
            response: requests.Response = self.session.request(
                method=method,
                url=url,
                timeout=self.timeout,                
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if response.status_code == 404:
                raise NotFoundError(f"Ресурс не найден: {url}")
            elif response.status_code == 429:
                raise RateLimitError("Превышен лимит запросов")
            raise ApiExeption(f"Ошибка API: {response.status_code}")
        except requests.exceptions.Timeout:
            raise ApiExeption("Таймаут запроса")
        except requests.exceptions.RequestException as e:
            raise ApiExeption("Сетевая ошибка")

    def get(self, resource: str, id: str | None = None) -> Dict[str, Any]:
        """GET запрос к API."""

        return self._request("GET", resource, id)
