<?php

namespace controllers\Files;

use controllers\db\ConnectDB;
use PDO;
use PDOException;
use SplFileInfo;

class AccessControl
{
    private static object|null $connectDB;
    private static array $userData = [];
    private static string $fullPath;

    private static function errorOutput(string $errorMessage): never
    {
        $result['error'] = true;
        $result['message'] = $errorMessage;
        echo json_encode($result);
        die;
    }

    private static function checkEmail(): void
    {
        if (!isset($_POST['email']) || empty($_POST['email'])) {
            self::errorOutput('Введите email пользователя');
        }
        if (!preg_match('/^[a-z]([a-z0-9]+\.?)*[a-z0-9]*@[a-z]+\.[a-z]+/ui', $_POST['email'])) {
            self::errorOutput('Введен некорретный email');
        }
        try {
            $stm =  self::$connectDB->connection->prepare('SELECT * FROM ' . TABLEDB . ' WHERE email = :email');
            $stm->bindParam('email', $_POST['email'], PDO::PARAM_STR);
            $stm->execute();
            $result = $stm->fetch(PDO::FETCH_ASSOC);
            if ($result) {
                if ($result['id'] === $_SESSION['id']) {
                    self::errorOutput('Нельзя предоставить доступ самому себе');
                }
                self::$userData['id'] = $result['id'];
                self::$userData['email'] = $result['email'];
            } elseif (!$result) {
                self::errorOutput('Пользователя с таким email не существует');
            }
        } catch (PDOException $e) {
            $result['error'] = true;
            $result['message'] = $e->getMessage();
            echo json_encode($result);
            die;
        }
    }

    private static function checkFile(): void
    {
        if (isset($_GET['provide_access']) && $_GET['provide_access'] == true) {
            $dir = isset($_POST['directory']) ? urldecode($_POST['directory']) : '';
            if (file_exists(FILES . $_SESSION['id'] . '/' . $dir . '/' . $_POST['fileName'])) {
                self::$fullPath = FILES . $_SESSION['id'] . '/' . $dir . '/' . $_POST['fileName'];
            } else {
                self::errorOutput('Файл не найден');
            }
        } elseif (isset($_GET['getUsersList']) && $_GET['getUsersList'] == true) {
            $dir = isset($_GET['directory']) ? urldecode($_GET['directory']) : '';
            if (file_exists(FILES . $_SESSION['id'] . '/' . $dir . '/' . $_GET['fileName'])) {
                self::$fullPath = FILES . $_SESSION['id'] . '/' . $dir . '/' . $_GET['fileName'];
            } else {
                self::errorOutput('Файл не найден');
            }
        } elseif (isset($_GET['removeAccess']) && $_GET['removeAccess'] == true) {
            $dir = isset($_POST['directory']) ? urldecode($_POST['directory']) : '';
            self::$fullPath = FILES . $_SESSION['id'] . '/' . $dir . '/' . $_POST['fileName'];
        }
        self::$fullPath = str_replace('//', '/', self::$fullPath);
    }

    private static function provideAccess(): void
    {
        try {
            $stm = self::$connectDB->connection->prepare('INSERT INTO ' . TABLEACCESSCONTROL . ' (senderId, recipientId, email, path) VALUES (:senderId, :recipientId, :email, :path)');
            $stm->bindParam('senderId', $_SESSION['id'], PDO::PARAM_INT);
            $stm->bindParam('recipientId', self::$userData['id'], PDO::PARAM_INT);
            $stm->bindParam('email', self::$userData['email'], PDO::PARAM_STR);
            $stm->bindParam('path', self::$fullPath, PDO::PARAM_STR);
            $stm->execute();
            $result['error'] = false;
            $result['message'] = 'Доступ предоставлен';
            echo json_encode($result);
        } catch (PDOException $e) {
            self::errorOutput('Не удалось предоставить доступ:' . $e->getMessage());
        }
    }

    private static function getUsersList(): void
    {
        try {
            $stm = self::$connectDB->connection->prepare('SELECT email, path FROM ' . TABLEACCESSCONTROL . ' WHERE senderId = :id');
            $stm->bindParam('id', $_SESSION['id'], PDO::PARAM_INT);
            $stm->execute();
            $resultData = $stm->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            self::errorOutput('Не удалось получить список пользователей:' . $e->getMessage());
        }
        $usersEmail = [];
        foreach ($resultData as $userData) {
            if ($userData['path'] === self::$fullPath) {
                $usersEmail[] = $userData['email'];
            }
        }
        $result['error'] = false;
        $result['emailList'] = $usersEmail;
        echo json_encode($result);
    }

    private static function removeAccess(): void
    {
        try {
            $stm = self::$connectDB->connection->prepare('DELETE FROM ' . TABLEACCESSCONTROL . ' WHERE recipientId = :id AND path = :path');
            $stm->bindParam('id', self::$userData['id'], PDO::PARAM_INT);
            $stm->bindParam('path', self::$fullPath, PDO::PARAM_STR);
            $stm->execute();
            $result['error'] = false;
            echo json_encode($result);
        } catch (PDOException $e) {
            self::errorOutput('Не удалось убрать доступ к файлу:' . $e->getMessage());
        }
    }


    public static function go(): void
    {
        self::$connectDB = new ConnectDB();
        session_start();
        if (isset($_GET['provide_access']) && $_GET['provide_access'] == true) {
            self::checkEmail();
            self::checkFile();
            self::provideAccess();
            die;
        }
        if (isset($_GET['getUsersList']) && $_GET['getUsersList'] == true) {
            self::checkFile();
            $info = new SplFileInfo(self::$fullPath);
            if ($info->getType() === 'dir') {
                self::errorOutput('Управление доступом не доступно для папки');
            }
            self::getUsersList();
        }
        if (isset($_GET['removeAccess']) && $_GET['removeAccess'] == true) {
            self::checkEmail();
            self::checkFile();
            self::removeAccess();
        }
        self::$connectDB = null;
    }
}

AccessControl::go();
