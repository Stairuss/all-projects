// Получить элемент заголовка
function getTitleEl(text) {
    const titleEl = document.createElement('h1');
    titleEl.textContent = text;
    titleEl.classList.add('title');
    return titleEl;
}

// Получить элемент формы
function getFormEl() {
    const formEl = document.createElement('form');
    formEl.classList.add('form-new-entry');    
    return formEl;
}

// Получить элемент инпута
function getInputEl(type, name, placeholder = '', value = '') {
    const inputEl = document.createElement('input');
    inputEl.type = type;
    inputEl.name = name;
    inputEl.placeholder = placeholder;
    inputEl.value = value;
    inputEl.classList.add('form-new-entry__input');
    return inputEl;
}

// Получить элемент label
function getLabelEl() {
    const labelEl = document.createElement('label');  
    labelEl.classList.add('form-new-entry__label');        
    return labelEl;
}

// Получить элемент кнопки
// role:
// addRecord - Добавление новой записи
// stepBack - Вернуться к таблице
// editRecord - Изменить существующую запись
function getButtonEl(text, role) {
    const buttonEl = document.createElement('button');
    buttonEl.textContent = text;
    if(role === 'addRecord') {        
        buttonEl.classList.add('btn', 'form-new-entry__add-record-btn');
    } else if(role === 'stepBack') {
        buttonEl.classList.add('btn', 'form-new-entry__step-back-btn');
    } else if(role === 'editRecord') {
        buttonEl.classList.add('btn', 'form-new-entry__edit-record-btn');
    }
    return buttonEl;
}

export {
    getTitleEl,
    getFormEl,
    getLabelEl,
    getInputEl,
    getButtonEl
}