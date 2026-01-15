from telebot.states import State, StatesGroup


class StateStarWars(StatesGroup):
    """
    Состояния пользователя в Telegram боте Star Wars.

    Attributes:
        choosing_a_topic (State): Выбор категории контента.
        peoples (State): Выбор персонажей.
        films (State): Выбор фильмов.
        planets (State): Выбор планет.
        species (State): Выбор видов.
        starships (State): Выбор звездолетов.
        vehicles (State): Выбор транспортных средств.
    """

    choosing_a_topic = State()
    peoples = State()
    films = State()
    planets = State()
    species = State()
    starships = State()
    vehicles = State()
