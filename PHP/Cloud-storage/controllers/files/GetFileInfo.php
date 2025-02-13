<?php

namespace controllers\files;

use SplFileInfo;

class GetFileInfo
{
    private static SplFileInfo $path;
    private static int $size = 0;

    private static function checkDirectory(): void
    {
        if (!isset($_SESSION)) session_start();
        $dir = '';
        if (isset($_POST['directory']) && !empty($_POST['directory'])) {
            $dir = urldecode($_POST['directory']) . '/';
        }
        if (file_exists(FILES . $_SESSION['id'] . '/' . $dir . $_POST['fileName'])) {
            $path = FILES . $_SESSION['id'] . '/' . $dir . $_POST['fileName'];
            self::$path = new SplFileInfo($path);
        } else {
            exit(json_encode('file not exist'));
        }
    }

    private static function checkFileType(string $extension): string
    {
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
        return $fileType;
    }

    private static function checkSize(string $path, int $size)
    {
        $file = new SplFileInfo($path);
        $type = self::checkFileType($file->getExtension());
        if ($type === 'folder') {
            foreach (glob($file . '/*') as $el) {
                $it = new SplFileInfo($el);
                self::checkSize($it->getPathname(), $size);
            }
        } else {
            self::$size = self::$size + $file->getSize();
        }
    }

    public static function getInfo(): void
    {
        self::checkDirectory();
        $date = date('d-m-Y', self::$path->getMTime());                         
        self::checkSize(self::$path->getPathname(), self::$size);
        $result['size'] = self::$size;
        $result['name'] = self::$path->getFilename();
        $result['extension'] = self::$path->getExtension();
        $result['type'] = self::checkFileType(self::$path->getExtension());
        $result['modificationDate'] = $date;;
        $result['error'] = false;
        echo json_encode($result);
    }
}

GetFileInfo::getInfo();
