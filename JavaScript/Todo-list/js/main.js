function createItem(name) {
    // создаем элемент списка
    let list = document.querySelector('ul');
    let item = document.createElement('li');
    let blockBtnLi = document.createElement('div');
    let span = document.createElement('span');

    span.textContent = name;

    item.classList.add('li');
    span.classList.add('span');

    list.append(item);
    item.append(span);
    item.append(blockBtnLi);

    // создаем кнопки готово и удалить
    let buttonReady = document.createElement('button');
    let buttonDelete = document.createElement('button');

    buttonReady.textContent = 'Готово';
    buttonDelete.textContent = 'Удалить';

    buttonReady.classList.add('buttonReady', 'btn');
    buttonDelete.classList.add('buttonDelete', 'btn');

    // помещаем кнопки внутрь элемента списка
    blockBtnLi.append(buttonReady);
    blockBtnLi.append(buttonDelete);

    return {
        item,
        span,
        buttonReady,
        buttonDelete,
    }
};

// создаем функцию для атрибута disabled
let disabled = function () {
    let a;
    if (input.value.length > 0) {
        a = false
    } else {
        a = true;
    }

    buttonAdd.disabled = a;
};

// генерируем новый id
function newId(arr) {
    let id;
    if (arr.length == 0) {
        id = 1;
        return id;
    } else {
        let lastObject = arr.at(-1);
        let lastIdObject = lastObject.id;
        id = lastIdObject + 1;
        return id;
    }

};

// создаем новый обьект
function newObject(inputValue, arr) {
    let object = {};
    object.id = newId(arr);
    object.name = inputValue;
    object.done = false;
    arr.push(object);
    return object;
};

// JSON
function saveLoacalStorage(key) {
    localStorage.setItem(key, JSON.stringify(quests));
    return key;
}

function pushSaveItems(key, arr) {
    if (localStorage.getItem(key)) {
        let saveObjects = JSON.parse(localStorage.getItem(key));
        console.log(localStorage.getItem(key))
        for (let i of saveObjects) {
            arr.push(i)
        }
        for (let i of arr) {
            if (i.done == true) {
                let a = createItem(i.name);
                a.item.classList.add('bcg-green');
            } else {
                createItem(i.name);
            }
        }
    }
};

window.createTodoApp = createTodoApp;

// функция для кнопки "готово"
function btnReadyClick(event) {
    let btnClick = event.currentTarget;
    let itemClick = btnClick.closest('.li');
    let spanClick = itemClick.children[0];

    itemClick.classList.toggle('bcg-green');

    for (let i of quests) {
        if (spanClick.textContent == i.name) {
            if (itemClick.classList.contains('bcg-green') == true) {
                i.done = true;
                saveLoacalStorage(keyJson);
            } else {
                i.done = false;
                saveLoacalStorage(keyJson);
            }
        }
    }
}

let quests = [];

// функция для кнопки "удалить"
function btnDelete(event) {
    let btnClickk = event.currentTarget;
    let itemClickk = btnClickk.closest('.li');
    let spanClickk = itemClickk.children[0];
    // itemClickk.remove();
    for (let i in quests) {
        if (spanClickk.textContent == quests[i].name) {
            quests.splice(i, 1)
        } else continue;
    }
    itemClickk.remove();
    saveLoacalStorage(keyJson);
}



function createTodoApp(container, title = 'Мой список дел', keyJson = 'my') {

    let list = document.createElement('ul');
    let h1 = document.createElement('h1');
    let blockInputBtn = document.createElement('div');
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonAdd = document.createElement('button');

    h1.textContent = title;
    input.placeholder = 'Введите название нового дела';
    input.type = 'text';
    buttonAdd.textContent = 'Добавить дело';

    blockInputBtn.classList.add('blockInputBtn');
    input.classList.add('input');
    buttonAdd.classList.add('buttonAdd');
    list.classList.add('list');

    blockInputBtn.append(input, buttonAdd);
    form.append(blockInputBtn);

    container.append(h1);
    container.append(form);
    container.append(list);

    pushSaveItems(keyJson, quests);

    // Создаем обработчик на кнопку "Готово"
    let targetButtonReady = document.querySelectorAll('.buttonReady');
    targetButtonReady.forEach(function (i) {
        i.addEventListener('click', btnReadyClick)
    });

    // Создаем обработчик на кнопку "удалить"
    let targetButtonDelete = document.querySelectorAll('.buttonDelete');
    targetButtonDelete.forEach(function (i) {
        i.addEventListener('click', btnDelete)
    });

    // создаем функцию для атрибута disabled
    let disabled = function () {
        let a;
        if (input.value.length > 0) {
            a = false
        } else {
            a = true;
        }
        buttonAdd.disabled = a;
    };

    // устанавливаем атрибут disabled при загрузке страницы
    buttonAdd.disabled = disabled;

    input.addEventListener('input', disabled);

    // добавляем элемент li в список
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!input.value) {
            return
        };

        createItem(input.value);
        newObject(input.value, quests);
        saveLoacalStorage(keyJson);

        // Дублируем обработчик на кнопку "Готово"
        let targetButtonReady = document.querySelectorAll('.buttonReady');
        targetButtonReady.forEach(function (i) {
            i.addEventListener('click', btnReadyClick)
        })

        // Дублируем обработчик на кнопку "удалить"
        let targetButtonDelete = document.querySelectorAll('.buttonDelete');
        targetButtonDelete.forEach(function (i) {
            i.addEventListener('click', btnDelete)
        });

        // обнуляем поле ввода
        input.value = '';
        // задаем кнопке атрибут disabled
        buttonAdd.disabled = disabled;
    });
};







