/*
 * Получить User по telegram_id
*/
SELECT * FROM users
WHERE telegram_id = (:telegram_id)