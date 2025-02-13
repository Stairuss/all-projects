<?php

namespace controllers\users;

require_once CONF . '/validation.php';

use controllers\db\MatchChecking;
use config\validation;
use controllers\db\ConnectDB;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use PDO;

class ResetPassUser
{
    private static function sendLink(): void
    {
        $mail = new PHPMailer(true);
        try {
            //Server settings
            $mail->SMTPDebug = SMTP::DEBUG_SERVER;
            $mail->isSMTP();
            $mail->Host       = 'smtp.mail.ru';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'pvy.vap@mail.ru';
            $mail->Password   = 'eMAd0VytER2p8pYaxzAv';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port       = 465;
            $mail->CharSet = 'UTF-8';

            //Recipients
            $mail->setFrom('pvy.vap@mail.ru', 'Разработчик');
            $mail->addAddress($_SESSION['email']);
          
            //Attachments
            // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
            // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

            //Content            
            $mail->isHTML(true);
            $mail->Subject = 'Изменение пароля облачного хранилища';
            $hashEmail = createHash($_SESSION['email']);
            $url = PATH . 'users/reset_password?param=' . $hashEmail;
            $mail->Body    = "<a href='$url'>Нажми для изменения пароля</a>";

            $mail->send();
            echo 'Message has been sent';            
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    }
    public static function resetPass(): void
    {
        session_start();
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if (isset($_GET['param']) && !empty($_GET['param'])) {
                if (password_verify($_SESSION['email'], $_GET['param'])) {
                    require_once VIEWS . '/users/resetPass.tpl.php';
                } else {
                    require_once VIEWS . '/errors.tpl.php';
                }
            } else {
                self::sendLink();
            }
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $passwords = validation::valid(VIEWS . '/users/resetPass.tpl.php');
            if ($passwords['password'] != $passwords['repeat_password']) {
                require_once VIEWS . '/users/resetPass.tpl.php';
                errorMessage(' Новые пароли не совпадают');
                die;
            }
            $result = MatchChecking::checkForMatch($_SESSION['email'], $passwords['old_password']);
            if ($result) {
                $password = createHash($passwords['password']);
                $stm = (new ConnectDB)->connection->prepare("
                    UPDATE" . TABLEDB . " SET password = :password
                    WHERE email = :email
                    ");
                $stm->bindParam('password', $password, PDO::PARAM_STR);
                $stm->bindParam('email', $_SESSION['email'], PDO::PARAM_STR);
                $stm->execute();
                infoWindow('Успех', 'Пароль успешно изменен');
            } else {
                require_once VIEWS . '/users/resetPass.tpl.php';
                errorMessage('Неверный старый пароль');
                die;
            }
        }
    }
}

ResetPassUser::resetPass();
