<?php

connectGeneralStyle();


?>
<link rel="stylesheet" href="<?=STYLE . 'infoOutput/infoWindow.css'?>">

<div class="info-window">
    <h3 class="info-window__title info-window-element"><?=$title?></h3>
    <p class="info-window__content info-window-element"><?=$text?></p>
    <a class="info-window__link info-window-element" href="<?=PATH?>">Принять</a>
</div>
