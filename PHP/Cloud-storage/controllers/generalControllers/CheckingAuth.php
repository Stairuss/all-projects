<?php

namespace controllers\generalControllers;

class CheckingAuth
{
    public static function chekingAuth(): void
    {        
        session_start();
        if(isset($_SESSION['email']) && isset($_SESSION['password'])) {
            require_once VIEWS . '/pages//home.tpl.php';
        } else {            
            redirectHeader('users/login');            
        }        
    }
    
}

CheckingAuth::chekingAuth();
