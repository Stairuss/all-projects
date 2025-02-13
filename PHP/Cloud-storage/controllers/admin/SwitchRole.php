<?php

namespace controllers\admin;

use controllers\db\ConnectDB;
use Exception;
use PDO;
use PDOException;

class SwitchRole
{
    public static function requestDB(): void
    {
        if (!isset($_GET['switch']) && empty($_GET['switch']) && $_GET['switch'] != 'admin' && $_GET['switch'] != 'user') {            
            exit(json_encode(false));
        }
        session_start();
        $stm = (new ConnectDB())->connection->prepare("
        UPDATE" . TABLEDB . 
        "SET role = :role
        WHERE id = :id
        ");

        $role = $_GET['switch'];
        $id = $_SESSION['id'];

        $stm->bindParam('role', $role);
        $stm->bindParam('id', $id);

        $stm->execute();

        $_SESSION['role'] = $_GET['switch'];

        echo json_encode(true);
    }
}

SwitchRole::requestDB();
