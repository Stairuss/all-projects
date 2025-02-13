<?php

namespace controllers\users;

require_once CONF . '/validation.php';

use controllers\db\ConnectDB;
use controllers\files\CreateFolder;
use config\validation;
use PDO;
use PDOException;

class CreateUser
{
    public static function requestDB(): void
    {

        if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['age']) && isset($_POST['gender']) && isset($_POST['password'])) {
            $userData = validation::valid(VIEWS . '/pages/createUser.tpl.php');
            $connectDB = new ConnectDB();
            $connectDB->connection->beginTransaction();
            try {
                $stm = $connectDB->connection->prepare("
                INSERT INTO " . TABLEDB . " (id, name, email, age, role, gender, password)
                VALUES(null, :name, :email, :age, :role, :gender, :password)
                ");
                $name = $userData['name'];
                $email = $userData['email'];
                $age = $userData['age'];
                $role = 'user';
                $gender = $userData['gender'];
                $password = createHash($userData['password']);
                $stm->bindParam('name', $name, PDO::PARAM_STR);
                $stm->bindParam('email', $email, PDO::PARAM_STR);
                $stm->bindParam('age', $age, PDO::PARAM_INT);
                $stm->bindParam('role', $role, PDO::PARAM_STR);
                $stm->bindParam('gender', $gender, PDO::PARAM_STR);
                $stm->bindParam('password', $password, PDO::PARAM_STR);
                $stm->execute();

                $id = $connectDB->connection->lastInsertId();
                $_POST['id'] = $id;
                $_POST['createUser'] = true;
                CreateFolder::createFolder();
                $connectDB->connection->commit();
                redirectHeader('users/login', '?registration=complited');
            } catch (PDOException $e) {
                $connectDB->connection->rollBack();
                $connectDB = null;
                if ($e->getCode() === '23000') {
                    echo $e->getMessage();
                    require_once VIEWS . '/pages/createUser.tpl.php';
                    errorMessage('Пользователь с таким Email уже существует');
                } else {
                    require_once VIEWS . '/pages/createUser.tpl.php';
                    errorConnectDB('Ошибка запроса к базе данных', $e->getMessage());
                }
            }            
        } else {
            exit(require_once VIEWS . '/pages/createUser.tpl.php');
        }
    }
}

CreateUser::requestDB();
