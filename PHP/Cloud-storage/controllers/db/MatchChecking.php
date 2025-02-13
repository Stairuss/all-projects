<?php

namespace controllers\db;

use controllers\db\ConnectDB;
use PDO;

class MatchChecking
{
    public static function checkForMatch($checkingEmail, $checkingPassword)
    {        
        if (isset($checkingEmail)) {
            $stm = (new ConnectDB())->connection->prepare("
        SELECT * FROM" . TABLEDB .
        "WHERE email = :email
        ");
            $stm->setFetchMode(PDO::FETCH_ASSOC);
            
            $stm->bindParam('email', $checkingEmail, PDO::PARAM_STR);

            $stm->execute();
            $result = $stm->fetch();
            $stm = null;
            if (!$result) {
                return false;
            }

            if (password_verify($checkingPassword, $result['password'])) {
                return $result;
            } else {
                return false;
            }
        }
    }
}
