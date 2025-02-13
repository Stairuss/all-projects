<?php

namespace controlers\files;

use controllers\db\ConnectDB;
use PDO;
use PDOException;
use SplFileInfo;

class GetProvideFiles
{
    private static function checkFileType(string $fileFullpath): array
    {
        $info = new SplFileInfo($fileFullpath);
        $fileName = $info->getFilename();
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

    public static function getFiles(): void
    {
        session_start();
        $connectDB = new ConnectDB();
        try {
            $stm = $connectDB->connection->prepare('SELECT * FROM ' . TABLEACCESSCONTROL . ' WHERE recipientId = :id');
            $stm->bindParam('id', $_SESSION['id'], PDO::PARAM_INT);
            $stm->execute();
            $result = $stm->fetchAll(PDO::FETCH_ASSOC);            
            $connectDB = null;
            $fileData = [];
            foreach ($result as $el) {
                $fileInfo = self::checkFileType($el['path']);
                $data['fileName'] = $fileInfo['fileName'];
                $data['type'] = $fileInfo['type'];
                $data['path'] = $el['path'];
                $fileData['fileInfo'][] = $data;
            }
            $fileData['error'] = false;
            print_r(json_encode($fileData));
        } catch (PDOException $e) {
            $result['error'] = true;
            $result['message'] = 'Не удалось получить список файлов:' . $e->getMessage();
            echo json_encode($result);
        }
    }
}

GetProvideFiles::getFiles();
