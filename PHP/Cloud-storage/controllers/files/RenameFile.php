<?php

namespace controllers\files;

use SplFileInfo;
use PDO;
use PDOException;
use controllers\db\ConnectDB;

class RenameFile
{
    private static string $currentPath;
    private static string $newPath;

    private static function checkDirectory(): void
    {
        if (!isset($_SESSION)) session_start();
        $dir = '';
        if (isset($_POST['directory']) && !empty($_POST['directory'])) {
            $dir = urldecode($_POST['directory'] . '/');
        }
        if (file_exists(FILES . $_SESSION['id'] . '/' . $dir . $_POST['currentName'])) {
            self::$currentPath = FILES . $_SESSION['id'] . '/' . $dir . $_POST['currentName'];
        } else {
            exit(json_encode('Файл не найден'));
        }
    }

    private static function editPathAccessDB(): void
    {
        $connectDB = new ConnectDB();
        try{
        $stm = $connectDB->connection->prepare("UPDATE " . TABLEACCESSCONTROL . " SET path = :newPath WHERE senderId = :id AND path = :currentPath");
        $stm->bindParam('newPath', self::$newPath, PDO::PARAM_STR);
        $stm->bindParam('id', $_SESSION['id'], PDO::PARAM_INT);
        $stm->bindParam('currentPath', self::$currentPath, PDO::PARAM_STR);
        $stm->execute();
        $connectDB = null;
        } catch(PDOException $e) {
            $result['error'] = true;      
            $result['message'] = $e->getMessage();      
            echo json_encode($result);
            die;
        }
    }

    public static function renameFile(): void
    {
        self::checkDirectory();
        $file = new SplFileInfo(self::$currentPath);
        $extension = $file->getExtension() != '' ? '.' . $file->getExtension() : '';
        self::$newPath = $file->getPath() . '/' . $_POST['newName'] . $extension;
        if(file_exists(self::$newPath)) {
            $result['error'] = true;      
            $result['message'] = 'Файл с таким именем уже существует';      
            echo json_encode($result); 
            die;
        }
        self::editPathAccessDB();
        if (rename(self::$currentPath, self::$newPath)) { 
            $result['error'] = false;  
            $result['extension'] = $extension; 
            $result['newPath'] = self::$newPath;      
            echo json_encode($result);
        } else {
            $result['error'] = true;      
            $result['message'] = 'Не удалось редактировать файл';      
            echo json_encode($result);
            die;
        }
    }
}

RenameFile::renameFile();
