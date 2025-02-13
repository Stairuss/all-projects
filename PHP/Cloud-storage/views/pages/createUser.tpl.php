<?php

connectGeneralStyle();

?>

<link rel="stylesheet" href="<?= STYLE . 'form/form.css' ?>">
<link rel="stylesheet" href="<?= STYLE . 'pages/createUser.css' ?>">

<form class="form create" action="<?= PATH . 'users/create' ?>" method="POST">
    <h2 class="form__title">Регистрация</h2>
    <input class="form__input input-name" type="text" name="name" placeholder="Имя" value="<?=$_POST['name'] ?? null?>">
    <input class="form__input input-age" type="text" name="age" placeholder="Возраст" value="<?=$_POST['age'] ?? null?>">
    <label class="radio-label"><strong>Ваш пол:&nbsp</strong>
        <label class="create__radio-label create__male" for="male">Мужской
            <span class="create__radio-check male-check"></span>
            <input class="create__radio" id="male" type="radio" name="gender" value="male" checked>
        </label>
        <label class="create__radio-label create__female" for="female">Женский
            <span class="create__radio-check female-check"></span>
            <input class="create__radio" id="female" type="radio" name="gender" value="female">
        </label>
    </label>
    <input class="form__input input-email" type="text" name="email" placeholder="Email" value="<?=$_POST['email'] ?? null?>">
    <input class="form__input input-pass" type="password" name="password" placeholder="Пароль">
    <a class="form__link" href="<?= PATH ?>">Назад</a>
    <button class="form__btn btn">Зарегистрироваться</button>
</form>

<script src="<?= SCRIPT . 'views/radioInputs/radioInputSetting.js' ?>"></script>