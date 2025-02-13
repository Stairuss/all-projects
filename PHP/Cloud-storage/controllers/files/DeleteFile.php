<?php

namespace controllers\files;

use SplFileInfo;
use PDO;
use PDOException;
use controllers\db\ConnectDB;

class DeleteFile
{
    private static string $path;

    private static function checkDirectory(): void
    {
        if (!isset($_SESSION)) session_start();
        $dir = '';
        if (isset($_POST['directory']) && !empty($_POST['directory'])) {
            $dir = $_POST['directory'] . '/';
        }
        $path = preg_replace('/\.{2,}/', '', FILES . $_SESSION['id'] . '/' . $dir . $_POST['fileName']);
        $path = preg_replace('/\/{2,}/', '/', $path);

        if (file_exists($path)) {
            self::$path = $path;
        } else {
            exit(json_encode('file not exist'));
        }
    }

    private static function errorOutput(string $errorMessage): never
    {
        $result['error'] = true;
        $result['message'] = $errorMessage;
        echo json_encode($result);
        die;
    }

    private static function deletePathInAccess(): void
    {
        try {
            $connectDB = new ConnectDB();
            $stm = $connectDB->connection->prepare("DELETE FROM " . TABLEACCESSCONTROL . " WHERE senderId = :id AND path = :path");
            $stm->bindParam('id', $_SESSION['id'], PDO::PARAM_INT);
            $stm->bindParam('path', self::$path, PDO::PARAM_STR);
            $stm->execute();
            $connectDB = null;
        } catch (PDOException $e) {
            self::errorOutput('не удалсоь удалить файл:' . $e->getMessage());
        }
    }

    private static function deleteFile(string $path): array
    {
        $result['error'] = false;
        $file = new SplFileInfo($path);
        if ($file->getType() === 'dir') {
            foreach (glob($file . '/*') as $el) {
                $it = new SplFileInfo($el);
                self::deleteFile($it->getPathname());
            }
            rmdir($file);
            // if (!rmdir($file)) self::errorOutput('Не удалось удалить файл');
        } else {
            unlink($file);
            // if (!unlink($file)) self::errorOutput('Не удалось удалить файл');
        }

        return $result;
    }

    public static function runDelete(): void
    {
        self::checkDirectory();
        self::deletePathInAccess();
        $result = self::deleteFile(self::$path);
        echo json_encode($result);
    }
}

DeleteFile::runDelete();
