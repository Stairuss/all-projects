<?php

namespace controllers\db;

use PDO;
use PDOException;

class ConnectDB
{
    public PDO $connection;
    public function __construct()
    {
        try {
            $this->connection = new PDO(
                "mysql:host=localhost; dbname=skillbox; charset=utf8",
                "mysql",
                "mysql",
                [PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION]
                // "mysql:host=localhost; dbname=sanya; charset=utf8",
                // "sanya",
                // "sanyapass143795@@",
                // [PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION]                
            );
        } catch (PDOException $e) {
            errorConnectDB('Ошибка подключения к базе данных', $e->getMessage());
        }
    }
}
