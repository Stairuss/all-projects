<?php

namespace controllers\users;

class LogoutUser
{
    public static function sessionDestroy(): void
    {        
        session_start();        
        if (isset($_SESSION['email']) && isset($_SESSION['password'])) {
            session_destroy();
            redirectHeader('users/login');
        } else {
            redirectHeader('users/login');
        }
    }
}

LogoutUser::sessionDestroy();
