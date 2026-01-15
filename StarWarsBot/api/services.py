import asyncio
import aiohttp
from typing import Dict, Any, List, Set

from telebot.types import CallbackQuery

from loader import client, async_client


class Processor:
    """
    Процессор данных Star Wars API.

    Attributes:
        RESOURCE_KEYS (List[str]): Список ВСЕХ ключей значения которых массивы с ресурсами.
        SKIP_KEYS (Set[str]): Имена ключей которые будут удалены из ответа.
    """

    RESOURCE_KEYS: List[str] = [
        "characters",
        "people",
        "films",
        "species",
        "vehicles",
        "starships",
        "planets",
        "residents",
        "pilots",
    ]
    SKIP_KEYS: Set[str] = {"created", "edited", "url"}

    def __init__(self, call: CallbackQuery) -> None:
        """
        Инициализирует обработчик CallbackQuery.

        Attributes:
            raw_data (Dict[str, Any]): Объект без SKIP_KEYS и пустых значений.
            processed_data (Dict[str, Any]): Обьект с готовыми данными.

        Args:
            call (CallbackQuery): Входящий callback query от Telegram.
        """

        self.call = call
        self.raw_data: Dict[str, Any] = {}
        self.processed_data: Dict[str, Any] = {}

    def fetch_raw(self) -> Dict[str, Any]:
        """
        Получает сырые данные ресурса и фильтрует SKIP_KEYS + пустые значения.

        Returns:
            Dict[str, Any]: Отфильтрованные данные ресурса.
        """

        self.raw_data = client.get(self.call.data)
        self.processed_data = {
            k: v for k, v in self.raw_data.items() if k not in self.SKIP_KEYS and v
        }
        return self.processed_data

    async def _process_arrays(self, session: aiohttp.ClientSession) -> None:
        """
        Обрабатывает массивы ресурсов из self.RESOURCE_KEYS параллельно.

        Args:
            session: Асинхронная HTTP-сессия.
        """

        resource_tasks = {
            key: asyncio.create_task(
                async_client.all_fetch(self.processed_data[key], session)
            )
            for key in self.RESOURCE_KEYS
            if key in self.processed_data and self.processed_data[key]
        }

        if resource_tasks:
            tasks_result = await asyncio.gather(
                *resource_tasks.values(), return_exceptions=True
            )

            # Сопоставление результатов по порядку ключей
            for index, key in enumerate(resource_tasks.keys()):
                if (
                    index < len(tasks_result)
                    and not isinstance(tasks_result[index], Exception)
                    and isinstance(tasks_result[index], list)
                ):

                    data = tasks_result[index]
                    self.processed_data[key] = [
                        item["title"] if key == "films" else item["name"]
                        for item in data
                        if isinstance(item, dict)
                    ]

    async def _process(self) -> Dict[str, Any]:
        """
        Обработка даннных сущности.

        Returns:
            Dict[str, Any]: Словарь с данными сущности.
        """

        self.fetch_raw()

        async with aiohttp.ClientSession() as session:
            await self._process_arrays(session)

        return self.processed_data


class PeopleProcessor(Processor):
    """Процессор данных персонажей (people) Star Wars API."""

    def __init__(self, call: CallbackQuery) -> None:
        """Инициализация для персонажей."""
        super().__init__(call)

    async def _process_homeworld(self, session: aiohttp.ClientSession) -> None:
        """
        Обрабатывает homeworld персонажа.

        Args:
            session: Асинхронная HTTP-сессия.
        """

        if "homeworld" in self.processed_data and self.processed_data["homeworld"]:
            home_task = asyncio.create_task(
                async_client.one_fetch(self.processed_data["homeworld"], session)
            )

            try:
                home_result = await home_task
                self.processed_data["homeworld"] = home_result.get("name", "Нет данных")
            except Exception as e:
                self.processed_data["homeworld"] = "Нет данных"

    async def _process(self) -> Dict[str, Any]:
        """
        Обработка данных персонажа + homeworld.

        Returns:
            Dict[str, Any]: Словарь с данными персонажа.
        """

        self.fetch_raw()

        async with aiohttp.ClientSession() as session:
            await self._process_arrays(session)
            await self._process_homeworld(session)

        return self.processed_data

    def process_sync(self) -> Dict[str, Any]:
        """
        Синхронная обёртка для вызова из sync контекста.

        Returns:
            Dict[str, Any]: Словарь с данными персонажа.
        """

        return asyncio.run(self._process())

    def format_message(self) -> str:
        """
        Форматирует данные персонажа для Telegram.

        Returns:
            str: Готовый текст для Telegram сообщения.
        """

        fields = {
            k: (
                self.processed_data.get(k, "Нет данных")
                if self.processed_data.get(k, "Нет данных") != "unknown"
                else "Нет данных"
            )
            for k in [
                "name",
                "height",
                "mass",
                "hair_color",
                "skin_color",
                "eye_color",
                "birth_year",
                "gender",
                "homeworld",
            ]
        }

        arrays = {}
        for key in ["films", "species", "vehicles", "starships"]:
            arrays[key] = "\n".join(
                [
                    (
                        f"    {element}"
                        if element == "Нет данных"
                        else f"    {i + 1}. {element}"
                    )
                    for i, element in enumerate(
                        self.processed_data.get(key, ["Нет данных"])
                    )
                ]
            )

        return """
<b>ИМЯ:</b>
    {name}
<b>РОСТ:</b>
    {height}
<b>ВЕС:</b>
    {mass}
<b>ЦВЕТ ВОЛОС:</b>
    {hair_color}
<b>ЦВЕТ КОЖИ:</b>
    {skin_color}
<b>ЦВЕТ ГЛАЗ:</b>
    {eye_color}
<b>ГОД РОЖДЕНИЯ:</b>
    {birth_year}
<b>ПОЛ:</b>
    {gender}
<b>РОДНАЯ ПЛАНЕТА:</b>
    {homeworld}
<b>ФИЛЬМЫ:</b>
{films}
<b>РАЗНОВИДНОСТЬ:</b>
{species} 
<b>ТРАНСПОРТНЫЕ СРЕДСТВА:</b>
{vehicles}
<b>ЗВЕЗДОЛЕТЫ:</b>
{starships}
""".format(
            name=fields["name"],
            height=fields["height"],
            mass=fields["mass"],
            hair_color=fields["hair_color"],
            skin_color=fields["skin_color"],
            eye_color=fields["eye_color"],
            birth_year=fields["birth_year"],
            gender=fields["gender"],
            homeworld=fields["homeworld"],
            films=arrays["films"],
            species=arrays["species"],
            vehicles=arrays["vehicles"],
            starships=arrays["starships"],
        )


class FilmProcessor(Processor):
    """Процессор данных фильмов (films) Star Wars API."""

    def __init__(self, call: CallbackQuery) -> None:
        """Инициализация для фильмов."""
        super().__init__(call)

    def process_sync(self) -> Dict[str, Any]:
        """
        Синхронная обёртка для вызова из sync контекста.

        Returns:
            -> Dict[str, Any]: Словарь с данными фильма.
        """

        return asyncio.run(self._process())

    def format_message(self) -> str:
        """
        Форматирует данные фильма для Telegram.

        Returns:
            str: Готовый текст для Telegram сообщения.
        """

        fields = {
            k: (
                self.processed_data.get(k, "Нет данных")
                if self.processed_data.get(k, "Нет данных") != "unknown"
                else "Нет данных"
            )
            for k in [
                "title",
                "episode_id",
                "opening_crawl",
                "director",
                "producer",
                "release_date",
            ]
        }

        arrays = {}
        for key in ["characters", "planets", "starships", "vehicles", "species"]:
            arrays[key] = "\n".join(
                [
                    (
                        f"    {element}"
                        if element == "Нет данных"
                        else f"    {i + 1}. {element}"
                    )
                    for i, element in enumerate(
                        self.processed_data.get(key, ["Нет данных"])
                    )
                ]
            )

        return """
<b>НАЗВАНИЕ:</b> 
    {title}
<b>ЭПИЗОД:</b> 
    {episode_id}
<b>ВСТУПЛЕНИЕ:</b> 
<pre>{opening_crawl}</pre>
<b>РЕЖИССЕР:</b> 
    {director}
<b>ПРОДЮССЕР:</b> 
    {producer}
<b>ДАТА ВЫХОДА:</b> 
    {release_date}
<b>ПЕРСОНАЖИ:</b> 
{characters}
<b>ПЛАНЕТЫ:</b> 
{planets}
<b>ЗВЕЗДОЛЕТЫ:</b> 
{starships}
<b>ТРАНСПОРТНЫЕ СРЕДСТВА:</b> 
{vehicles}
<b>РАЗНОВИДНОСТЬ:</b> 
{species} 

""".format(
            title=fields["title"],
            episode_id=fields["episode_id"],
            opening_crawl=fields["opening_crawl"],
            director=fields["director"],
            producer=fields["producer"],
            release_date=fields["release_date"],
            characters=arrays["characters"],
            planets=arrays["planets"],
            starships=arrays["starships"],
            vehicles=arrays["vehicles"],
            species=arrays["species"],
        )


class PlanetProcessor(Processor):
    """Процессор данных планет (planet) Star Wars API."""

    def __init__(self, call: CallbackQuery) -> None:
        """Инициализация для планет."""

        super().__init__(call)

    def process_sync(self) -> Dict[str, Any]:
        """
        Синхронная обёртка для вызова из sync контекста.

        Returns:
            -> Dict[str, Any]: Словарь с данными планеты.
        """

        return asyncio.run(self._process())

    def format_message(self) -> str:
        """
        Форматирует данные планеты для Telegram.

        Returns:
            str: Готовый текст для Telegram сообщения.
        """

        fields = {
            k: (
                self.processed_data.get(k, "Нет данных")
                if self.processed_data.get(k, "Нет данных") != "unknown"
                else "Нет данных"
            )
            for k in [
                "name",
                "rotation_period",
                "orbital_period",
                "diameter",
                "climate",
                "gravity",
                "terrain",
                "surface_water",
                "population",
            ]
        }

        arrays = {}
        for key in ["residents", "films"]:
            arrays[key] = "\n".join(
                [
                    (
                        f"    {element}"
                        if element == "Нет данных"
                        else f"    {i + 1}. {element}"
                    )
                    for i, element in enumerate(
                        self.processed_data.get(key, ["Нет данных"])
                    )
                ]
            )

        return """
<b>НАЗВАНИЕ:</b> 
    {name}
<b>ПЕРИОД ВРАЩЕНИЯ:</b>
    {rotation_period}
<b>ОРБИТАЛЬНЫЙ ПЕРИОД:</b>
    {orbital_period}
<b>ДИАМЕТР:</b>
    {diameter}
<b>КЛИМАТ:</b>
    {climate}
<b>ГРАВИТАЦИЯ:</b>
    {gravity}
<b>МЕСТНОСТЬ:</b>
    {terrain}
<b>ПОВЕРХНОСТНЫЕ ВОДЫ:</b>
    {surface_water}
<b>НАСЕЛЕНИЕ:</b>
    {population}
<b>ЖИТЕЛИ:</b> 
{residents}
<b>ФИЛЬМЫ:</b> 
{films} 
""".format(
            name=fields["name"],
            rotation_period=fields["rotation_period"],
            orbital_period=fields["orbital_period"],
            diameter=fields["diameter"],
            climate=fields["climate"],
            gravity=fields["gravity"],
            terrain=fields["terrain"],
            surface_water=fields["surface_water"],
            population=fields["population"],
            residents=arrays["residents"],
            films=arrays["films"],
        )


class SpecieProcessor(Processor):
    """Процессор данных разновидностей (species) Star Wars API."""

    def __init__(self, call: CallbackQuery) -> None:
        """Инициализация для разновидностей."""

        super().__init__(call)

    async def _process_homeworld(self, session: aiohttp.ClientSession) -> None:
        """
        Обрабатывает homeworld разновидности.

        Args:
            session: aiohttp HTTP сессия.
        """

        if "homeworld" in self.processed_data and self.processed_data["homeworld"]:
            home_task = asyncio.create_task(
                async_client.one_fetch(self.processed_data["homeworld"], session)
            )

            try:
                home_result = await home_task
                self.processed_data["homeworld"] = home_result.get("name", "Нет данных")
            except Exception as e:
                self.processed_data["homeworld"] = "Нет данных"

    async def _process(self) -> Dict[str, Any]:
        """
        Обработка разновидности + homeworld.

        Returns:
            Dict[str, Any]: Готовые данные разновидности.
        """

        self.fetch_raw()

        async with aiohttp.ClientSession() as session:
            await self._process_arrays(session)
            await self._process_homeworld(session)

        return self.processed_data

    def process_sync(self) -> Dict[str, Any]:
        """
        Синхронная обёртка для вызова из sync контекста.

        Returns:
            Dict[str, Any]: Словарь с данными разновидности.
        """

        return asyncio.run(self._process())

    def format_message(self) -> str:
        """
        Форматирует данные разновидности для Telegram.

        Returns:
            str: Готовый текст для Telegram сообщения.
        """

        fields = {
            k: (
                self.processed_data.get(k, "Нет данных")
                if self.processed_data.get(k, "Нет данных") != "unknown"
                else "Нет данных"
            )
            for k in [
                "name",
                "classification",
                "designation",
                "average_height",
                "skin_colors",
                "hair_colors",
                "eye_colors",
                "average_lifespan",
                "homeworld",
                "language",
            ]
        }

        arrays = {}
        for key in ["people", "films"]:
            arrays[key] = "\n".join(
                [
                    (
                        f"    {element}"
                        if element == "Нет данных"
                        else f"    {i + 1}. {element}"
                    )
                    for i, element in enumerate(
                        self.processed_data.get(key, ["Нет данных"])
                    )
                ]
            )

        return """
<b>РАЗНОВИДНОСТЬ:</b>
    {name}
<b>КЛАССИФИКАЦИЯ:</b>
    {classification}
<b>ОБОЗНАЧЕНИЕ:</b>
    {designation}
<b>СРЕДНИЙ РОСТ:</b>
    {average_height}
<b>ЦВЕТ КОЖИ:</b>
    {skin_colors}
<b>ЦВЕТ ВОЛОС:</b>
    {hair_colors}
<b>ЦВЕТ ГЛАЗ:</b>
    {eye_colors}
<b>СРЕДНЯЯ ПРОДОЛЖИТЕЛЬНОСТЬ ЖИЗНИ:</b>
    {average_lifespan}
<b>РОДНАЯ ПЛАНЕТА:</b>
    {homeworld}
<b>ЯЗЫК:</b>
    {language} 
<b>ЖИТЕЛИ:</b>
{people} 
<b>ФИЛЬМЫ:</b>
{films}
""".format(
            name=fields["name"],
            classification=fields["classification"],
            designation=fields["designation"],
            average_height=fields["average_height"],
            skin_colors=fields["skin_colors"],
            hair_colors=fields["hair_colors"],
            eye_colors=fields["eye_colors"],
            average_lifespan=fields["average_lifespan"],
            homeworld=fields["homeworld"],
            language=fields["language"],
            people=arrays["people"],
            films=arrays["films"],
        )


class StarshipProcessor(Processor):
    """Процессор данных завездолетов (starships) Star Wars API."""

    def __init__(self, call: CallbackQuery) -> None:
        """Инициализация для звездолетов."""

        super().__init__(call)

    def process_sync(self) -> str:
        """
        Синхронная обёртка для вызова из sync контекста.

        Returns:
            str: Словарь с данными звездолета.
        """

        return asyncio.run(self._process())

    def format_message(self) -> str:
        """
        Форматирует данные звездолета для Telegram.

        Returns:
            str: Готовый текст для Telegram сообщения.
        """

        fields = {
            k: (
                self.processed_data.get(k, "Нет данных")
                if self.processed_data.get(k, "Нет данных") != "unknown"
                else "Нет данных"
            )
            for k in [
                "name",
                "model",
                "manufacturer",
                "cost_in_credits",
                "length",
                "max_atmosphering_speed",
                "crew",
                "passengers",
                "cargo_capacity",
                "consumables",
                "hyperdrive_rating",
                "MGLT",
                "starship_class",
            ]
        }

        arrays = {}
        for key in ["pilots", "films"]:
            arrays[key] = "\n".join(
                [
                    (
                        f"    {element}"
                        if element == "Нет данных"
                        else f"    {i + 1}. {element}"
                    )
                    for i, element in enumerate(
                        self.processed_data.get(key, ["Нет данных"])
                    )
                ]
            )

        return """
<b>НАЗВАНИЕ:</b>
    {name}
<b>МОДЕЛЬ:</b>
    {model}
<b>ПРОИЗВОДИТЕЛЬ:</b>
    {manufacturer}
<b>СТОИМОСТЬ В КРЕДИТАХ:</b>
    {cost_in_credits}
<b>ДЛИНА:</b>
    {length}
<b>МАКСИМАЛЬНАЯ АТМОСФЕРНАЯ СКОРОСТЬ:</b>
    {max_atmosphering_speed}
<b>ЭКИПАЖ:</b>
    {crew}
<b>ПАССАЖИРЫ:</b>
    {passengers}
<b>ГРУЗОПОДЬЕМНОСТЬ:</b>
    {cargo_capacity}
<b>РАСХОДНЫЕ МАТЕРИАЛЫ:</b>
    {consumables}
<b>РЕЙТИНГ ГИПЕРДВИГАТЕЛЯ:</b>
    {hyperdrive_rating}
<b>MGLT:</b>
    {MGLT}
<b>КЛАСС ЗВЕЗДОЛЕТА:</b>
    {starship_class}
<b>ПИЛОТЫ:</b>
{pilots}
<b>ФИЛЬМЫ:</b>
{films} 

""".format(
            name=fields["name"],
            model=fields["model"],
            manufacturer=fields["manufacturer"],
            cost_in_credits=fields["cost_in_credits"],
            length=fields["length"],
            max_atmosphering_speed=fields["max_atmosphering_speed"],
            crew=fields["crew"],
            passengers=fields["passengers"],
            cargo_capacity=fields["cargo_capacity"],
            consumables=fields["consumables"],
            hyperdrive_rating=fields["hyperdrive_rating"],
            MGLT=fields["MGLT"],
            starship_class=fields["starship_class"],
            pilots=arrays["pilots"],
            films=arrays["films"],
        )


class VehicleProcessor(Processor):
    """Процессор данных транспорта (vehicles) Star Wars API."""

    def __init__(self, call: CallbackQuery) -> None:
        """Инициализация для транспорта."""

        super().__init__(call)

    def process_sync(self) -> Dict[str, Any]:
        """
        Синхронная обёртка для вызова из sync контекста.

        Returns:
            Dict[str, Any]: Словарь с данными транспорта.
        """

        return asyncio.run(self._process())

    def format_message(self) -> str:
        """
        Форматирует данные транспорта для Telegram.

        Returns:
            str: Готовый текст для Telegram сообщения.
        """

        fields = {
            k: (
                self.processed_data.get(k, "Нет данных")
                if self.processed_data.get(k, "Нет данных") != "unknown"
                else "Нет данных"
            )
            for k in [
                "name",
                "model",
                "manufacturer",
                "cost_in_credits",
                "length",
                "max_atmosphering_speed",
                "crew",
                "passengers",
                "cargo_capacity",
                "consumables",
                "vehicle_class",
            ]
        }

        arrays = {}
        for key in ["pilots", "films"]:
            arrays[key] = "\n".join(
                [
                    (
                        f"    {element}"
                        if element == "Нет данных"
                        else f"    {i + 1}. {element}"
                    )
                    for i, element in enumerate(
                        self.processed_data.get(key, ["Нет данных"])
                    )
                ]
            )

        return """
<b>НАЗВАНИЕ:</b>
    {name}
<b>МОДЕЛЬ:</b>
    {model}
<b>ПРОИЗВОДИТЕЛЬ:</b>
    {manufacturer}
<b>СТОИМОСТЬ В КРЕДИТАХ:</b>
    {cost_in_credits}
<b>ДЛИНА:</b>
    {length}
<b>МАКСИМАЛЬНАЯ АТМОСФЕРНАЯ СКОРОСТЬ:</b>
    {max_atmosphering_speed}
<b>ЭКИПАЖ:</b>
    {crew}
<b>ПАССАЖИРЫ:</b>
    {passengers}
<b>ГРУЗОПОДЬЕМНОСТЬ:</b>
    {cargo_capacity}
<b>РАСХОДНЫЕ МАТЕРИАЛЫ:</b>
    {consumables}
<b>КЛАСС ТРАНСПОРТНОГО СРЕДСТВА:</b>
    {vehicle_class} 
<b>ПИЛОТЫ:</b>
{pilots}
<b>ФИЛЬМЫ:</b>
{films}


""".format(
            name=fields["name"],
            model=fields["model"],
            manufacturer=fields["manufacturer"],
            cost_in_credits=fields["cost_in_credits"],
            length=fields["length"],
            max_atmosphering_speed=fields["max_atmosphering_speed"],
            crew=fields["crew"],
            passengers=fields["passengers"],
            cargo_capacity=fields["cargo_capacity"],
            consumables=fields["consumables"],
            vehicle_class=fields["vehicle_class"],
            pilots=arrays["pilots"],
            films=arrays["films"],
        )
