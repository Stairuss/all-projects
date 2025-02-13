<?php

namespace controllers\files;

use SplFileInfo;

class GetFiles
{

    private static int $id;
    private static string $directory;

    private static function checkId(): void
    {
        if (isset($_GET['id']) && !empty($_GET['id']) && is_numeric($_GET['id']) && $_SESSION['role'] === 'admin') {
            self::$id = $_GET['id'];
        } else {
            self::$id = $_SESSION['id'];
        }
    }

    private static function checkDirectory(): bool
    {
        if (isset($_GET['directory']) && !empty($_GET['directory'])) {
            $dir = urldecode($_GET['directory']);
        } else {
            $dir = '';
        }
        $dir = preg_replace('/\.{2,}/', '', FILES . self::$id . '/' . $dir);
        $dir = preg_replace('/\/{2,}/', '/', $dir);
        if (is_dir($dir)) {
            self::$directory = $dir;
            return true;
        } else {
            return false;
        }
    }

    private static function checkFileType(array $fileList): array
    {
        $fileArray = [];
        foreach ($fileList as $file) {
            $info = new SplFileInfo($file);
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
            $fileArray[] = ['fileName' => $file, 'type' => $fileType];
        }
        return $fileArray;
    }

    public static function scanDirectory()
    {
        if (!isset($_SESSION)) session_start();
        self::checkId();
        if (self::checkDirectory()) {
            $fileList = array_diff(scandir(self::$directory), array('.', '..'));
            $fileArray = self::checkFileType($fileList);
            $result['fileList'] = $fileArray;
            $result['fullPath'] = self::$directory;
            self::$directory = preg_replace('/filesDB\/\d*\//',  '', self::$directory);
            $result['directory'] = self::$directory;
            $result['error'] = false;
        } else {
            $result['fileList'] = 'Пусто';
            $result['directory'] = 'Фалы не найдены';
            $result['error'] = true;
        }
        if (isset($_GET['outputType']) && $_GET['outputType'] === 'echo') {
            echo json_encode($result);
        } else {
            return $result;
        }
    }
}
if (isset($_GET['outputType']) && $_GET['outputType'] === 'echo') {
    GetFiles::scanDirectory();
}
