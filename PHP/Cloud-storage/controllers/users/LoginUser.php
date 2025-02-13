<?php

namespace controllers\users;

require_once CONF . '/validation.php';

use controllers\db\MatchChecking;
use config\validation;

class LoginUser
{
    public static function requestDB(): void
    {
        
        session_start();
        if (isset($_SESSION['email']) && isset($_SESSION['password'])) {
            redirectHeader();
        } elseif (isset($_POST['email']) && isset($_POST['password'])) {
            
            validation::valid(VIEWS . '/pages/authUser.tpl.php');

            $userData = MatchChecking::checkForMatch($_POST['email'], $_POST['password']);
            if ($userData) {
                $_SESSION['id'] = $userData['id'];
                $_SESSION['name'] = $userData['name'];
                $_SESSION['email'] = $userData['email'];
                $_SESSION['role'] = $userData['role'];
                $_SESSION['password'] = createHash($userData['password']);                
                redirectHeader();
            } else {
                require_once VIEWS . '/pages/authUser.tpl.php';
                errorMessage('Неверные логин или пароль');
            }
        } else {
            require_once VIEWS . '/pages/authUser.tpl.php';
            if (isset($_GET['registration']) && $_GET['registration'] === 'complited') {
                completedMessage('Регистрация прошла успешно');
            }
        }
    }
}
LoginUser::requestDB();




