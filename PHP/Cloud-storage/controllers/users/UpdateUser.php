<?php

namespace controllers\users;

require_once CONF . '/validation.php';

use controllers\db\ConnectDB;
use config\validation;
use PDOException;
use PDO;

class UpdateUser
{
    private static int $id;

    private static function checkUserId(): void
    {
        if (isset($_GET['id']) && !empty($_GET['id'])) {
            if ($_SESSION['id'] != $_GET['id'] && $_SESSION['role'] != 'admin') {
                $errorTitle = 'Ошибка доступа';
                $errorContent = 'У вас нет доступа к этой странице';
                require_once VIEWS . '/incs/header.php';
                require_once VIEWS . '/infoOutput/errorWindow.tpl.php';
                die;
            }
        }
    }
    public static function requestDB(): void
    {
        session_start();

        self::checkUserId();

        if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['age']) && isset($_POST['gender'])) {
            $userData = validation::valid(VIEWS . '/pages/updateUser.tpl.php');
            try {
                $stm = (new ConnectDB())->connection->prepare("
            UPDATE " . TABLEDB . "
            SET name = :name, email = :email, age = :age, gender = :gender
            WHERE id = :id");
                if ($_SESSION['role'] === 'admin') {
                    if (isset($_GET['id']) && !empty($_GET['id']) && is_numeric($_GET['id'])) {
                        self::$id = $_GET['id'];
                    } else {
                        self::$id = $_SESSION['id'];
                    }
                } else {
                    self::$id = $_SESSION['id'];
                }

                $name = $userData['name'];
                $email = $userData['email'];
                $age = $userData['age'];
                $gender = $userData['gender'];

                $stm->bindParam('id', self::$id, PDO::PARAM_INT);
                $stm->bindParam('name', $name, PDO::PARAM_STR);
                $stm->bindParam('email', $email, PDO::PARAM_STR);
                $stm->bindParam('age', $age, PDO::PARAM_INT);
                $stm->bindParam('gender', $gender, PDO::PARAM_STR);

                $stm->execute();
                $stm = null;
                $_SESSION['name'] = $userData['name'];
                $_SESSION['email'] = $userData['email'];
                require_once VIEWS . '/incs/header.php';
                infoWindow('Успех', 'Пользователь&nbsp' . '<strong>' . $userData['name'] . '</strong>' . ' &nbsp&nbspуспешно изменен');
            } catch (PDOException $e) {
                if($e->getCode() === '23000') {
                    errorConnectDB('Ошибка запроса к базе данных', 'Такой Email уже существует');
                } else {                    
                    errorConnectDB('Ошибка запроса к базе данных', $e->getMessage());
                }
            }
        } else {

            exit(require_once VIEWS . '/pages/updateUser.tpl.php');
        }
    }
}

UpdateUser::requestDB();
