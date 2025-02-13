<?php

// Создание хеша пароля
function createHash($param): string
{
    return password_hash($param, PASSWORD_DEFAULT);
}

// Сообщение об ошибке
function errorMessage(string $messageError): void
{
    require_once VIEWS . '/infoOutput/message/errorMessage.tpl.php';
}

// Сообщение с предупреждением
function warningMessage(string $messageWarning): void
{
    require_once VIEWS . '/infoOutput/message/warningMessage.tpl.php';
}

function completedMessage(string $messageCompleted): void
{
    require_once VIEWS . '/infoOutput/message/completedMessage.tpl.php';
}

// Подключение общих стилей
function connectGeneralStyle(): void
{
?>
    <link rel="stylesheet" href="<?= STYLE . 'general/normalize.css' ?>">
    <?php
    ?>
    <link rel="stylesheet" href="<?= STYLE . 'general/root.css' ?>">
    <?php
    ?>
    <link rel="stylesheet" href="<?= STYLE . 'general/generalSetting.css' ?>">
<?php
}

function errorConnectDB($errorTitle, $errorContent): void
{    
    require_once VIEWS . '/infoOutput/errorWindow.tpl.php';
    die;
}

function infoWindow(string $title, string $text): void {
    require_once VIEWS . '/infoOutput/infoWindow.tpl.php';
}

function redirectHeader( $url = null, $param = null): void {
   header(sprintf('Location: ' . PATH . $url . $param));
}


