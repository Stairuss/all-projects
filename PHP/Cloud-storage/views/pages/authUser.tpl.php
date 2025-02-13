<?php

connectGeneralStyle();

?>

<link rel="stylesheet" href="<?= STYLE . 'form/form.css' ?>">
<link rel="stylesheet" href="<?= STYLE . 'pages/authUser.css' ?>">

<form class="form auth" action="<?= PATH . 'users/login' ?>" method="POST">
    <h2 class="form__title">Вход в облачное хранилище</h2>
    <input class="form__input input-email" type="text" name="email" placeholder="Email" value="<?=$_POST['email'] ?? null?>">
    <input class="form__input input-pass" type="password" name="password" placeholder="Пароль">
    <a class="form__link" href="<?= PATH . 'users/create' ?>">Регистарция</a>
    <button class="form__btn btn" type="submit">Войти</button>
</form>


