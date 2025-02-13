<?php

$currentUser = $user['id'] === $_SESSION['id'] ? true : false;

?>

<tr id="<?= $user['id'] ?>" class="tbody__tr <?= $currentUser === true ? 'currentUser' : '' ?>">
    <td class="tbody__td"><?= $user['id'] ?></td>
    <td class="tbody__td"><?= $user['name'] ?></td>
    <td class="tbody__td"><?= $user['email'] ?></td>
    <td class="tbody__td"><?= $user['age'] ?></td>
    <td class="tbody__td"><?= $user['role'] ?></td>
    <td class="tbody__td"><?= $user['gender'] ?></td>
    <td class="tbody__td">
        <div class="users__actions">
            <?php
            if (!$currentUser) {
            ?>
                <button class="users__actions-element delete-user btn">
                    Удалить
                </button>
                <a class="users__actions-element update-user" href="<?= PATH . 'users/update?id=' . $user['id'] ?>">Изменить</a>
            <?php
            }
            ?>
        </div>
    </td>
</tr>