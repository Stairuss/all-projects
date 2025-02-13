<?php

connectGeneralStyle();

?>

<link rel="stylesheet" href="<?=STYLE . 'infoOutput/errorWindow.css'?>">

<div class="error-window">
<h3 class="error-window__title error-window-element"><?=$errorTitle?></h3>
<p class="error--window__content error-window-element"><?=$errorContent?></p>
<a class="error--window__link error-window-element" href="<?=PATH?>">Вернуться на главную</a>
</div>