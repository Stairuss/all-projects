<?php

namespace controllers\admin;

use controllers\db\ConnectDB;
use PDO;
use PDOException;

class GetUsers
{

    public static function requestDB()          
    {
        if(!isset($_SESSION)) session_start();

        if ($_SESSION['role'] != 'admin') {
            if(isset($_GET['outputType']) && $_GET['outputType'] === 'echo') {
                echo json_encode('access blocked');
            }
            return;
        }
        try {

            $stm = (new ConnectDB())->connection->prepare("SELECT id, name, email, age, role, gender FROM" . TABLEDB);
            $stm->setFetchMode(PDO::FETCH_ASSOC);
            $stm->execute();
            $result['users'] = $stm->fetchAll();
            $result['idCurrentAdmin'] = $_SESSION['id'];
            if (isset($_GET['outputType']) && $_GET['outputType'] === 'echo') {
                echo json_encode($result);
            } else {
                return $result;
            }
        } catch (PDOException $e) {
            if (isset($_GET['outputType']) && $_GET['outputType'] === 'echo') {
                echo json_encode($e->getMessage());
            } else {
                return $e->getMessage();
            }
        }
    }
}

GetUsers::requestDB();
