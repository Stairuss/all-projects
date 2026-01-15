/*
 * Сохрание запроса пользователя
*/
INSERT INTO history (user_telegram_id, command) 
VALUES (:user_telegram_id, :command);
