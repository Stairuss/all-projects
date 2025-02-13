// Получить элемент заголовока
function getTitleEl(text) {
    const titleEl = document.createElement('h1');
    titleEl.textContent = text;
    titleEl.classList.add('warehouse__title', 'title');
    return titleEl;
}

// Получить элемент кнопки
// typeNum: 
// 1 - Удаление записи
// 2 - Добавление записи
// 3 - Редактирование записи
function getButtonEl(text, typeNum) {
    const buttonEl = document.createElement('button');
    buttonEl.textContent = text;
    if (typeNum === 1) {
        buttonEl.classList.add('btn', 'delete-btn');
    } else if (typeNum === 2) {
        buttonEl.classList.add('btn', 'add-btn');
    } else if (typeNum === 3) {
        buttonEl.classList.add('btn', 'edit-btn');
    }
    return buttonEl;
}

// Получить элемент контейнера для кнопок внутри td
function getButtonContainerEl() {
    const containerEl = document.createElement('div');
    containerEl.classList.add('warehouse__container-btn');
    return containerEl;
}

// Получить элемент верхнего блока с элементами над таблицей
function getTopBlockEl() {
    const topBlockEl = document.createElement('div');
    topBlockEl.classList.add('top-block');
    return topBlockEl;
}

// Получить элемент таблицы
function getTableEl() {
    const tableEL = document.createElement('table');
    tableEL.classList.add('warehouse');
    return tableEL;
}

// Получить элемент thead
function getTheadEl() {
    const thead = document.createElement('thead');
    thead.classList.add('warehouse__thead');
    return thead;
}

// Получить элемент tr
function getTrEl(id = null) {
    const tr = document.createElement('tr');
    tr.classList.add('tr');
    if(id != null) {
        tr.id = id;  
    }
    return tr;
}

// Получить элемент th
function getThEl(text) {
    const th = document.createElement('th');
    th.classList.add('warehouse__th');
    th.textContent = text;
    return th;
}

// Получить элемент tbody
function getTbodyEl() {
    const tbody = document.createElement('tbody');
    tbody.classList.add('warehouse__tbody');
    return tbody;
}

// Получить элемент td
function getTdEl(text = '') {
    const td = document.createElement('td');
    td.classList.add('warehouse__td');
    td.textContent = text;
    return td;
}

// Получить элемент заглушки при отсутствии записей в таблице
function getStubEl(text) {
    const stubEl = document.createElement('div');
    stubEl.classList.add('warehouse__stub');
    stubEl.textContent = text;
    return stubEl;
}

export {
    getTitleEl,
    getButtonEl,
    getTopBlockEl,
    getTableEl,
    getTheadEl,
    getTrEl,
    getThEl,
    getTbodyEl,
    getTdEl,
    getButtonContainerEl,
    getStubEl
}