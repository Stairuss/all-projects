<?php

namespace controllers\admin;

use controllers\db\ConnectDB;
use PDO;
use PDOException;

class DeleteUser
{
    private static int $id;
    private static function checkId(): void
    {
        if (!isset($_SESSION)) session_start();
        if (isset($_GET['id']) && !empty($_GET['id']) && is_numeric($_GET['id']) && $_SESSION['role'] === 'admin') {
            self::$id = $_GET['id'];
        } else {
            echo 'user id is not valid';
            return;
        }
    }

    public static function requestDB(): void
    {
        self::checkId();
        try {
            $stm = (new ConnectDB())->connection->prepare("DELETE FROM" . TABLEDB . "WHERE id = :id");
            $stm->bindParam('id', self::$id, PDO::PARAM_INT);
            $stm->execute();                        
            echo json_encode(true);
        } catch (PDOException $e) {
            echo $e->getMessage();
        }       
    }
}

DeleteUser::requestDB();
