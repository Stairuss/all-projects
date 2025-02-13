<?php

namespace controllers\files;

use Exception;
use SplFileInfo;

class AddFile
{
    private static string $directory;

    public static function checkDirectory(): void
    {
        if (!isset($_SESSION)) session_start();
        $dir = isset($_POST['directory']) ? urldecode($_POST['directory']) : '';        
        $dir = preg_replace('/\.{2,}/', '', $dir);        
        $dir = str_replace('//', '/', $dir);        
        if (is_dir(FILES . $_SESSION['id'] . '/' . $dir)) {
            self::$directory = str_replace('//', '/', FILES . $_SESSION['id'] . '/' . $dir);
        } else {
            echo json_encode('Выбран некорректный каталог');
            die;
        }
    }

    private static function checkFileType(string $fileName): array
    {

        $info = new SplFileInfo($fileName);
        $extension = $info->getExtension();
        $fileType = '';
        if ($extension === 'png' || $extension === 'jpg') {
            $fileType = 'img';
        } elseif ($extension === 'mp3' || $extension === 'wav' || $extension === 'aiff') {
            $fileType = 'music';
        } elseif ($extension === 'mp4' || $extension === 'mov' || $extension === 'wmv') {
            $fileType = 'video';
        } elseif ($extension === '') {
            $fileType = 'folder';
        } else {
            $fileType = 'document';
        }
        return $fileInfo = ['fileName' => $fileName, 'type' => $fileType];
    }


    public static function addFile(): void
    {
        self::checkDirectory();
        if (!isset($_FILES['fileName']) && empty($_FILES['fileName'])) {
            echo json_encode('Файл не выбран');
            die;
        }
        if (file_exists(self::$directory . '/' . $_FILES['fileName']['name'])) {
            echo json_encode('Файл с таким именем уже существует');
            die;
        }
        try {
            $fileInfo = self::checkFileType($_FILES['fileName']['name']);
            move_uploaded_file($_FILES['fileName']['tmp_name'], self::$directory . '/' . $_FILES['fileName']['name']);
            $result['fileInfo'] = $fileInfo;
            $result['error'] = false;
            $result['fullPath'] = str_replace('//', '/', self::$directory);
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode($e->getMessage());
        }
    }
}

AddFile::addFile();
