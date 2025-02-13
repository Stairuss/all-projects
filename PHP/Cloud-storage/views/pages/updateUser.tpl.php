<?php

require_once VIEWS . '/incs/header.php';

use controllers\users\GetUser;

$userData = GetUser::requestDB();

$male = $userData['gender'] === 'male' ? 'checked' : null;
$female = $userData['gender'] === 'female' ? 'checked' : null;
$id = $_SESSION['role'] === 'admin' ? $_GET['id'] : $_SESSION['id'];
?>

<link rel="stylesheet" href="<?= STYLE . 'form/form.css' ?>">
<link rel="stylesheet" href="<?= STYLE . 'pages/updateUser.css' ?>">

<form class="form update" action="<?= PATH . 'users/update?'?><?='id=' . $id?>" method="POST">
  <h2 class="form__title">Редактирование профиля</h2>
  <input class="form__input input-name" type="text" name="name" placeholder="Имя" value="<?=$userData['name']?>">
  <input class="form__input input-email" type="text" name="email" placeholder="Email" value="<?=$userData['email']?>">
  <input class="form__input input-age" type="number" name="age" placeholder="Возраст" value="<?=$userData['age']?>">
  <label> <strong>Ваш пол:&nbsp</strong>
    <label class="update__radio-label update__male" for="male">Мужской
      <span class="update__radio-check male-check"></span>
      <input class="update__radio" id="male" type="radio" name="gender" value="male" <?=$male ?? null?>>
    </label>
    &nbsp
    <label class="update__radio-label update__female" for="female">Женский
    <span class="update__radio-check female-check"></span>
      <input class="update__radio" id="female" type="radio" name="gender" value="female" <?=$female ?? null?>>
    </label>
  </label>
  <button class="form__btn btn" type="submit">Изменить</button>
</form>

<script src="<?= SCRIPT . 'views/radioInputs/radioInputSetting.js' ?>"></script>