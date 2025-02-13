<?php

connectGeneralStyle();

?>

<link rel="stylesheet" href="<?= STYLE . 'incs/header.css' ?>">

<div class="container">
  <header class="header">
    <ul class="header__list">
      <li class="header__item">
        <h1 class="header__logo"><a class="header__link" href="<?= PATH ?>">Облачное Хранилище</a></h1>
      </li>
      <li class="header__item">
        <p class="header__user-name"><?= $_SESSION['name'] ?></p>
      </li>
      <li class="header__item">
        <p class="header__user-email"><?= $_SESSION['email'] ?></p>
      </li>
      <li class="header__item">
        <p>Статус: <span class="header__user-role"><strong><u><?= $_SESSION['role'] ?></strong></u></span></p>
      </li>
      <li class="header__item actions">
        <button class="header__open-list-btn btn">Действия</button>
        <div class="actions__container">
          <ul class="actions__list">
            <li class="actions__item">
              <a class="actions__edit-prifile actions-element" href="<?= PATH . 'users/update?id=' ?><?= $_SESSION['id'] ?>">Редактировать профиль</a>
            </li>            
            <li class="actions__item">
              <button class="actions__pass-change actions-element btn">Изменить пароль</button>
            </li>
            <?php
            if ($_SESSION['role'] === 'user') {
            ?>
            <li class="actions__item switch-item">
              <button class="switch-role-btn switch-admin actions-element btn">Присвоить статус 'admin'</button>
            </li>
            <?php
            } else {
              ?>
            <li class="actions__item switch-item">
              <button class="switch-role-btn switch-user actions-element btn">Присвоить статус 'user'</button>
            </li>
            <?php
            }
            ?>
          </ul>
        </div>
      </li>
      <li class="header__item">
        <a class="header__logout" href="<?= PATH . 'users/logout' ?>">Выйти</a>
      </li>
    </ul>
  </header>
</div>
<div class="overlay"></div>


<script src="<?= SCRIPT . 'views/incs/header.js' ?>"></script>