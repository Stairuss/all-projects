/*
 * Создание нового User
*/
INSERT OR IGNORE INTO users (telegram_id, first_name) 
VALUES (:telegram_id, :first_name);
