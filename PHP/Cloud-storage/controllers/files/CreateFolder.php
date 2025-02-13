<?php

namespace controllers\files;

use Exception;

class CreateFolder
{
    private static int|string $id;
    private static string $directory;
    private static string|null $folderName;

    private static function checkId(): void
    {
        session_start();
        $id = $_SESSION['id'] ?? $_POST['id'];
        self::$id = $id . '/';
    }
    private static function checkDirectory(): void
    {
        if (isset($_POST['createUser']) && $_POST['createUser'] === true) {
            self::$directory = FILES . self::$id;
        } else {
            $dir = isset($_POST['directory']) ? urldecode($_POST['directory']) : '';
            $dir = preg_replace('/\.{2,}/', '', $dir);
            $dir = preg_replace('/\/{2,}/', '/', $dir);
            if (is_dir(FILES . self::$id . $dir)) {
                self::$directory = FILES . self::$id . $dir;
            } else {
                print_r(FILES . self::$id . $dir);
                echo 'Выбран некорректный каталог';
                die;
            }
        }
    }

    private static function checkFolderName(): void
    {
        if (isset($_POST['createUser']) && $_POST['createUser'] === true) {
            self::$folderName = null;
        } else {
            if (isset($_POST['folderName']) && !empty($_POST['folderName'])) {
                $name = preg_replace('/\s/', '', $_POST['folderName']);
                if (!preg_match_all('/[a-zа-я0-9_]/i', $name)) {
                    echo json_encode('Имя папки может содержать только цифры, буквы или знак подчеркивания');
                    die;
                } else {
                    self::$folderName = $name;
                }
            } else {
                echo json_encode('Введите название папки');
                die;
            }
        }
    }

    public static function createFolder(): void
    {
        self::checkId();
        self::checkDirectory();
        self::checkFolderName();
        if (file_exists(self::$directory . '/' . self::$folderName)) {
            echo json_encode('Дириктория с таким id уже существует');
            die;
        } else {
            if (mkdir(self::$directory . '/' . self::$folderName, 0777)) {
                $result['fileInfo'] = ['folderName' => self::$folderName, 'type' => 'folder'];
                $result['fullPath'] = str_replace('//', '/', self::$directory . '/' . self::$folderName);
                $result['error'] = false;
            } else {
                $result['error'] = true;
                $result['errorMessage'] = 'Не удалось создать файл';
            }
            echo json_encode($result);
        }
    }
}

if (isset($_POST['js']) && $_POST['js'] === 'true') {
    CreateFolder::createFolder();
}
