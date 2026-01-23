import logging
from loader import bot
from utils.set_bot_commands import set_default_commands
from database.init_database import init_database
from handlers import default_handlers, custom_handlers


def main() -> None:
    """Главная функция запуска бота."""

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    logger = logging.getLogger(__name__)
    
    logger.info("🚀 Запуск Star Wars Telegram Bot")    
    
    init_database()
    set_default_commands(bot)
    
    try:
        logger.info("✅ Бот запущен, polling...")
        bot.infinity_polling(timeout=5, long_polling_timeout=5)
    except KeyboardInterrupt:
        logger.info("🛑 Остановка по Ctrl+C")
    except Exception as e:
        logger.error(f"❌ Критическая ошибка: {e}", exc_info=True)
    finally:
        logger.info("👋 Бот остановлен")


if __name__ == "__main__":
    main()
