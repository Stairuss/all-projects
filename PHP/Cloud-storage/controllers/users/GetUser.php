<?php

namespace controllers\users;

use controllers\db\ConnectDB;
use PDO;
use PDOException;

class GetUser
{
    public static function requestDB()
    {
        if (isset($_GET['id'])) {
            try {
                $stm = (new ConnectDB())->connection->prepare("SELECT name, email, age, gender FROM" . TABLEDB . "WHERE id = :id");
                $stm->setFetchMode(PDO::FETCH_ASSOC);
                $id = $_GET['id'];
                $stm->bindParam('id', $id, PDO::PARAM_INT);
                $stm->execute();
                $result = $stm->fetch();                                
                $stm = null;
                return $result == true ? $result : 'Такого пользователя не существует';
            } catch (PDOException $e) {
                echo $e->getMessage();
            }            
        }
    }
}


