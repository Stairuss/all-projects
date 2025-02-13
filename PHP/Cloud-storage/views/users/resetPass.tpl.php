<?php

namespace view\users;

connectGeneralStyle();
require_once VIEWS . '/incs/header.php';

?>

<link rel="stylesheet" href="<?= STYLE . 'form/form.css'?>">
<link rel="stylesheet" href="<?= STYLE . 'users/resetPass.css'?>">

<form class="form reset-pass-form" method="POST" action="<?= PATH . 'users/reset_password'?>">
    <label for="old_password">Введите старый пароль</label><input class="form__input input-old-pass" type="password" name="old_password">
    <label for="password">Введите новый пароль</label><input class="form__input input-pass" type="password" name="password">
    <label for="repeat_password">Повторите новый пароль</label><input class="form__input input-repeat-pass" type="password" name="repeat_password">    
    <input class="form__btn btn" type="submit" value="Отправить">    
</form>
