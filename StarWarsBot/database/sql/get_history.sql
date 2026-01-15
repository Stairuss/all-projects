/*
 * Получить последние 10 запросов
*/
SELECT id, command, searched_at FROM history 
WHERE user_telegram_id = (?)
ORDER BY searched_at DESC
LIMIT 10