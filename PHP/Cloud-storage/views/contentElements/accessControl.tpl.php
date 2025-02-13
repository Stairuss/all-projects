<link rel="stylesheet" href="<?= STYLE . 'contentElements/accessControl.css' ?>">

<div class="access-control-container">
    <h3 class="access-control__file-name">Название файла</h3>
    <button class="access-control__close-btn btn">Х</button>
    <form class="access-control__form">
        <input class="access-control__form-input" type="text" placeholder="Введите Email пользователя">
        <button class="access-control__form-btn btn" type="submit">Поделиться</button>
    </form>
    <p class="access-control__access-list-title">Список предоставленных доступов</p>
    <table class="access-control__table access-table">
        <thead class="access-table__thead">
            <tr class="access-table__thead-tr">
                <th class="access-table__th">Email</th>
                <th class="access-table__th">Забрать доступ</th>
            </tr>
        </thead>
        <tbody class="access-table__tbody">
        </tbody>
    </table>

</div>