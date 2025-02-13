<?php


require_once VIEWS . '/incs/header.php';

use controllers\files\GetFiles;
use controllers\admin\GetUsers;

$arrayFilesDir = GetFiles::scanDirectory();

$arrayUserList = GetUsers::requestDB();
?>

<link rel="stylesheet" href="<?= STYLE . 'pages/home.css' ?>">

<main>
    <section class="content container" style="grid-template-columns: <?= $_SESSION['role'] === 'admin' ? '1fr 2fr' : '1fr' ?>;">
        <div class="content__block files">
            <h3 class="content__block-title">Мои файлы</h3>
            <div class="files__interface interface">
                <button class="interface__element back btn" title="Пред. папка">
                    <svg width="30px" height="30px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <g id="Arrow,-back,-direction,-move,-pointer-9" fill="none" fill-rule="evenodd">
                            <path id="Shape" d="m24 3c11.5979797 0 21 9.4020203 21 21s-9.4020203 21-21 21-21-9.4020203-21-21 9.4020203-21 21-21zm3 10h-13v2h13l.2249383.0041385c3.2094868.1182897 5.7750617 2.7574646 5.7750617 5.9958615s-2.5655749 5.8775718-5.7750617 5.9958615l-.2249383.0041385h-10.3395923l5.9980969-5.2474233-1.3170092-1.5051534-8.8600877 7.7525767 8.8600877 7.7525767 1.3170092-1.5051534-5.9980969-5.2474233h10.3395923l.2491793-.0038068c4.3029829-.1316503 7.7508207-3.6612789 7.7508207-7.9961932s-3.4478378-7.8645429-7.7508207-7.9961932z" fill="#2eaff0" fill-rule="nonzero"></path>
                        </g>
                    </svg>
                </button>
                <button class="interface__element add-file btn" title="Добавить новый файл">
                    <svg width="30px" height="30px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 441.469 441.469" style="enable-background:new 0 0 441.469 441.469;" xml:space="preserve">
                        <polygon style="fill:#00BBD3;" points="321.306,92.996 222.041,0 222.041,92.996 "></polygon>
                        <path fill="#4DCFE0" d="M300.931,207.935c7.314,0,14.106,0.522,20.375,2.09V92.996h-99.265V0H36.049 C30.302,0,25.6,4.702,25.6,10.449v361.012c0,5.747,4.702,10.449,10.449,10.449h161.437c-9.404-16.718-14.106-36.049-14.106-56.424 C183.38,260.702,236.147,207.935,300.931,207.935z"></path>
                        <path fill="#D4E1F4" d="M320.784,208.98c-0.522,0-1.567-0.522-2.09-0.522c-6.269-1.045-13.061-2.09-20.376-2.09 c-64.784,0-117.551,52.767-117.551,117.551c0,20.376,4.702,39.706,14.106,56.424c1.045,1.567,1.567,3.135,2.612,4.18 c21.42,35.527,59.559,56.947,100.833,56.947c64.784,0,117.551-52.767,117.551-117.551 C415.869,267.494,375.641,218.906,320.784,208.98z"></path>
                        <path fill="#3A2C51" d="M313.992,371.984v-32.392h32.392c8.882,0,15.673-6.792,15.673-15.673s-6.792-15.673-15.673-15.673 h-32.392v-31.869c0-8.882-6.792-15.673-15.673-15.673c-8.882,0-15.673,6.792-15.673,15.673v31.869h-31.869 c-8.882,0-15.673,6.792-15.673,15.673s6.792,15.673,15.673,15.673h31.869v32.392c0,8.882,6.792,15.673,15.673,15.673 C307.2,387.657,313.992,380.865,313.992,371.984z"></path>
                    </svg>
                </button>
                <button class="interface__element create-folder btn" title="Создать новую папку">
                    <svg width="30px" height="30px" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 372 372.30288">
                        <g id="surface1">
                            <path d="M 6.347656 55.65625 L 365.257812 55.65625 L 365.257812 259.890625 L 6.347656 259.890625 Z M 6.347656 55.65625 " fill="rgb(0%,84.313725%,87.45098%)" style=" stroke:none;fill-rule:nonzero;fill-opacity:1;"></path>
                            <path d="M 6.347656 6.195312 L 6.347656 55.65625 L 130.144531 55.65625 L 117.757812 6.195312 Z M 6.347656 6.195312 " fill="rgb(100%,92.156863%,60%)" style=" stroke:none;fill-rule:nonzero;fill-opacity:1;"></path>
                            <path d="M 278.625 191.84375 C 230.765625 191.84375 191.996094 230.613281 191.996094 278.476562 C 191.996094 326.335938 230.765625 365.105469 278.625 365.105469 C 326.488281 365.105469 365.257812 326.335938 365.257812 278.476562 C 365.257812 230.613281 326.488281 191.84375 278.625 191.84375 Z M 278.625 278.476562 Z M 278.625 278.476562 " fill="rgb(100%,31.372549%,13.72549%)" style=" stroke:none;fill-rule:nonzero;fill-opacity:1;"></path>
                            <path d="M 284.820312 216.625 L 272.429688 216.625 L 272.429688 272.28125 L 216.777344 272.28125 L 216.777344 284.671875 L 272.429688 284.671875 L 272.429688 334.230469 L 284.820312 334.230469 L 284.820312 284.671875 L 340.578125 284.671875 L 340.578125 272.28125 L 284.820312 272.28125 Z M 284.820312 216.625 " style=" stroke:none;fill-rule:nonzero;fill:rgb(40%,90.588235%,92.54902%);fill-opacity:1;"></path>
                            <path d="M 371.453125 55.65625 C 371.453125 52.257812 368.652344 49.460938 365.257812 49.460938 L 134.941406 49.460938 L 123.75 4.695312 C 123.050781 1.898438 120.554688 0 117.757812 0 L 6.347656 0 C 2.949219 0 0.152344 2.796875 0.152344 6.195312 L 0.152344 266.085938 C 0.152344 269.484375 2.949219 272.28125 6.347656 272.28125 L 186.101562 272.28125 C 186 274.378906 185.800781 276.378906 185.800781 278.476562 C 185.402344 329.734375 226.667969 371.601562 277.925781 372 C 329.1875 372.398438 371.050781 331.132812 371.453125 279.875 C 371.453125 275.277344 371.152344 270.683594 370.550781 266.183594 L 371.453125 266.183594 Z M 12.542969 12.390625 L 112.960938 12.390625 L 122.253906 49.558594 L 12.542969 49.558594 Z M 278.625 358.910156 C 234.164062 358.910156 198.191406 322.941406 198.191406 278.476562 C 198.191406 234.011719 234.164062 198.039062 278.625 198.039062 C 323.089844 198.039062 359.0625 234.011719 359.0625 278.476562 C 359.0625 322.941406 323.089844 358.910156 278.625 358.910156 Z M 278.625 185.648438 C 234.5625 185.75 196.492188 216.726562 187.699219 259.890625 L 12.542969 259.890625 L 12.542969 61.851562 L 359.0625 61.851562 L 359.0625 232.3125 C 342.574219 203.535156 311.898438 185.648438 278.625 185.648438 Z M 278.625 185.648438 " style=" stroke:none;fill-rule:nonzero;fill:rgb(13.72549%,12.156863%,12.54902%);fill-opacity:1;"></path>
                            <path d="M 284.820312 216.625 L 272.429688 216.625 L 272.429688 272.28125 L 216.777344 272.28125 L 216.777344 284.671875 L 272.429688 284.671875 L 272.429688 334.230469 L 284.820312 334.230469 L 284.820312 284.671875 L 340.578125 284.671875 L 340.578125 272.28125 L 284.820312 272.28125 Z M 284.820312 216.625 " style=" stroke:none;fill-rule:nonzero;fill:rgb(13.72549%,12.156863%,12.54902%);fill-opacity:1;"></path>
                        </g>
                    </svg>
                </button>
                <button class="interface__element open-provide-files btn" title="Предоставленные файлы">
                    <svg width="30px" height="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 503.322 503.322" style="enable-background:new 0 0 503.322 503.322;" xml:space="preserve">
                        <path style="fill:#FBC176;" d="M0,73.763v130.169c0,6.942,6.075,13.017,13.017,13.017h225.627c6.942,0,13.017-6.075,13.017-13.017 V73.763c0-6.942-6.075-13.017-13.017-13.017H13.017C6.075,60.746,0,66.82,0,73.763"></path>
                        <path style="fill:#C39A6E;" d="M225.627,60.746V39.051c0-6.942-6.075-13.017-13.017-13.017h-69.424L121.492,0H30.373 c-6.942,0-13.017,6.075-13.017,13.017v47.729H225.627z"></path>
                        <g>
                            <path style="fill:#FFFFFF;" d="M86.78,104.136H34.712c-5.207,0-8.678-3.471-8.678-8.678c0-5.207,3.471-8.678,8.678-8.678H86.78 c5.207,0,8.678,3.471,8.678,8.678C95.458,100.664,91.986,104.136,86.78,104.136"></path>
                            <path style="fill:#FFFFFF;" d="M86.78,138.847H34.712c-5.207,0-8.678-3.471-8.678-8.678s3.471-8.678,8.678-8.678H86.78 c5.207,0,8.678,3.471,8.678,8.678S91.986,138.847,86.78,138.847"></path>
                        </g>
                        <path style="fill:#FBC176;" d="M251.661,360.136v130.169c0,6.942,6.075,13.017,13.017,13.017h225.627 c6.942,0,13.017-6.075,13.017-13.017V360.136c0-6.942-6.075-13.017-13.017-13.017H264.678 C257.736,347.119,251.661,353.193,251.661,360.136"></path>
                        <g>
                            <path style="fill:#FFFFFF;" d="M338.441,390.508h-52.068c-5.207,0-8.678-3.471-8.678-8.678s3.471-8.678,8.678-8.678h52.068 c5.207,0,8.678,3.471,8.678,8.678S343.647,390.508,338.441,390.508"></path>
                            <path style="fill:#FFFFFF;" d="M338.441,425.22h-52.068c-5.207,0-8.678-3.471-8.678-8.678c0-5.207,3.471-8.678,8.678-8.678h52.068 c5.207,0,8.678,3.471,8.678,8.678C347.119,421.749,343.647,425.22,338.441,425.22"></path>
                        </g>
                        <path style="fill:#C39A6E;" d="M477.288,347.119v-21.695c0-6.942-6.075-13.017-13.017-13.017h-69.424l-21.695-26.034h-91.119 c-6.942,0-13.017,6.075-13.017,13.017v47.729H477.288z"></path>
                        <g>
                            <path style="fill:#F38774;" d="M190.915,442.576H17.356c-5.207,0-8.678-3.471-8.678-8.678c0-5.207,3.471-8.678,8.678-8.678h173.559 c5.207,0,8.678,3.471,8.678,8.678C199.593,439.105,196.122,442.576,190.915,442.576"></path>
                            <path style="fill:#F38774;" d="M190.915,442.576c-2.603,0-4.339-0.868-6.075-2.603l-34.712-34.712 c-3.471-3.471-3.471-8.678,0-12.149c3.471-3.471,8.678-3.471,12.149,0l34.712,34.712c3.471,3.471,3.471,8.678,0,12.149 C195.254,441.708,193.519,442.576,190.915,442.576"></path>
                            <path style="fill:#F38774;" d="M156.203,477.288c-2.603,0-4.339-0.868-6.075-2.603c-3.471-3.471-3.471-8.678,0-12.149 l34.712-34.712c3.471-3.471,8.678-3.471,12.149,0c3.471,3.471,3.471,8.678,0,12.149l-34.712,34.712 C160.542,476.42,158.807,477.288,156.203,477.288"></path>
                        </g>
                        <g>
                            <path style="fill:#26B999;" d="M485.966,95.458H312.407c-5.207,0-8.678-3.471-8.678-8.678c0-5.207,3.471-8.678,8.678-8.678h173.559 c5.207,0,8.678,3.471,8.678,8.678C494.644,91.986,491.173,95.458,485.966,95.458"></path>
                            <path style="fill:#26B999;" d="M347.119,130.169c-2.603,0-4.339-0.868-6.075-2.603l-34.712-34.712 c-3.471-3.471-3.471-8.678,0-12.149c3.471-3.471,8.678-3.471,12.149,0l34.712,34.712c3.471,3.471,3.471,8.678,0,12.149 C351.458,129.302,349.722,130.169,347.119,130.169"></path>
                            <path style="fill:#26B999;" d="M312.407,95.458c-2.603,0-4.339-0.868-6.075-2.603c-3.471-3.471-3.471-8.678,0-12.149l34.712-34.712 c3.471-3.471,8.678-3.471,12.149,0c3.471,3.471,3.471,8.678,0,12.149l-34.712,34.712C316.746,94.59,315.01,95.458,312.407,95.458"></path>
                        </g>
                    </svg>
                </button>
            </div>
            <div class="files__directory directory">
                <svg class="directory__svg" width="15px" height="15px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <g id="File_folder" data-name="File folder">
                        <path d="m47 27v-20-4h-34v8 16z" fill="#005ece"></path>
                        <path d="m12.445 27h.555v-16a4 4 0 0 0 -4 4v2h-2a4 4 0 0 0 -4 4v40l5.489-30.593a4 4 0 0 1 3.956-3.407z" fill="#cca400"></path>
                        <path d="m55 27v-6a4 4 0 0 0 -4-4v10z" fill="#cca400"></path>
                        <path d="m55.511 57.593 4.8-26a4 4 0 0 0 -3.956-4.593h-43.91a4 4 0 0 0 -3.956 3.407l-5.489 30.593h48.555a4 4 0 0 0 3.956-3.407z" fill="#ffcd00"></path>
                        <path d="m56.355 27h-4.021a3.942 3.942 0 0 1 -.023.593l-4.8 26a4 4 0 0 1 -3.956 3.407h-39.837l-.718 4h48.555a4 4 0 0 0 3.956-3.407l4.8-26a4 4 0 0 0 -3.956-4.593z" fill="#ebbf00"></path>
                        <path d="m47 7h-30v20h30 4v-10-10z" fill="#57a4ff"></path>
                        <path d="m26 27h25v-20c0 11.055-11.182 20-25 20z" fill="#2488ff"></path>
                        <g fill="#f1f2f2">
                            <path d="m47 14h-26a1 1 0 0 0 0 2h26a1 1 0 0 0 0-2z"></path>
                            <path d="m21 10a1 1 0 0 0 0 2h26a1 1 0 0 0 0-2z"></path>
                            <path d="m47 18h-26a1 1 0 0 0 0 2h26a1 1 0 0 0 0-2z"></path>
                            <path d="m47 22h-26a1 1 0 0 0 0 2h26a1 1 0 0 0 0-2z"></path>
                        </g>
                    </g>
                </svg>
                <p class="directory__path"><?= $arrayFilesDir['directory'] ?></p>
            </div>
            <div class="table-container">
                <table class="files__table table">
                    <thead class="files__thead thead">
                        <tr class="thead__tr">
                            <th class="thead__number">Номер</th>
                            <th class="thead__file-name">Файл</th>
                            <th class="thead__files-actions">Действия
                            </th>
                        </tr>
                    </thead>
                    <tbody class="files__tbody tbody">
                        <?php
                        $i = 1;
                        if (is_array($arrayFilesDir['fileList'])) {
                        ?>
                            <link rel="stylesheet" href="<?= STYLE . 'contentElements/file.css' ?>">
                            <?php
                            foreach ($arrayFilesDir['fileList'] as $file) {
                                require VIEWS . '/contentElements/file.tpl.php';
                                $i++;
                            }
                        } else {
                            ?>
                            <tr class="tbody__tr">
                                <td class="tbody__td"><?= $i ?></td>
                                <td class="tbody__td"><?= $arrayFilesDir['fileList'] ?></td>
                                <td class="tbody__td">
                                    <div class="files__actions">
                                    </div>
            </div>
            </td>
            </tr>
        <?php
                        }
        ?>
        </tbody>
        </table>
        </div>
        </div>
        <?php
        if ($_SESSION['role'] === 'admin') {
        ?>
            <link rel="stylesheet" href="<?= STYLE . 'contentElements/usersList.css' ?>">
            <div class="content__block users">
                <h3 class="content__block-title uses-title">Список пользователей</h3>
                <table class="users__table table">
                    <thead class="users__thead thead">
                        <tr class="thead__tr">
                            <th class="thead__id">id</th>
                            <th class="thead__name">Имя</th>
                            <th class="thead__email">Email</th>
                            <th class="thead__age">Возраст</th>
                            <th class="thead__role">Роль</th>
                            <th class="thead__gender">Пол</th>
                            <th class="thead__users-actions">Действия</th>
                        </tr>
                    </thead>
                    <tbody class="users__tbody tbody">
                        <?php
                        ?>
                        <link rel="stylesheet" href="<?= STYLE . 'contentElements/usersList.css' ?>">
                        <?php
                        foreach ($arrayUserList['users'] as $user) {
                            require VIEWS . '/contentElements/usersList.tpl.php';
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        <?php
        }
        ?>
    </section>
    <form class="form working-folders">
        <input class="form__input working-folders-input">
        <button class="form__btn working-folders-btn btn" type="submit"></button>
    </form>
    <?php
    require_once VIEWS . '/infoOutput/infoFile.tpl.php';
    require_once VIEWS . '/contentElements/accessControl.tpl.php';
    require_once VIEWS . '/contentElements/windowProvideFiles.tpl.php';
    ?>
</main>

<script src="<?= SCRIPT . 'views/pages/home.js' ?>" defer></script>