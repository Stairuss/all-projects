"""Инициализация обьекта бота."""

from telebot import TeleBot
from telebot.storage import StateMemoryStorage
from config import BOT_TOKEN, API_BASE_URL
from api.client import ApiClient
from api.async_client import AsyncApiClient
from telebot.states.sync.middleware import StateMiddleware
from telebot import custom_filters

from database.repositorys import UserRepository, HistoryRepository


storage: StateMemoryStorage = StateMemoryStorage()

bot: TeleBot = TeleBot(
    token=BOT_TOKEN,
    state_storage=storage,
    use_class_middlewares=True,
    threaded=True,
    num_threads=8,
)

bot.add_custom_filter(custom_filters.StateFilter(bot))
bot.add_custom_filter(custom_filters.IsDigitFilter())
bot.add_custom_filter(custom_filters.TextMatchFilter())

bot.setup_middleware(StateMiddleware(bot))

client: ApiClient = ApiClient(API_BASE_URL)
async_client: AsyncApiClient = AsyncApiClient()
user_rep = UserRepository()
history_rep = HistoryRepository()
