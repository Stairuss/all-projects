import { saveDataServer, loadClients, deleteClient, loadNewClient, saveEditDataServer, requestDataClient } from './jsApi.js';

const overlay = document.querySelector('.overlay');
const addClientBtn = document.querySelector('.add-client__btn');
const table = document.querySelector('.table-container__table');
const tbody = document.querySelector('.table__tbody');
const deleteWindow = document.querySelector('.window-delete-client');
const canselBtn = deleteWindow.querySelector('.window-delete-client__cancel-btn');
const crossBtn = deleteWindow.querySelector('.window-delete-client__cross-btn');
const deleteClientBtn = deleteWindow.querySelector('.window-delete-client__delete-btn');
const headerForm = document.querySelector('.header__form');
const headerInput = document.querySelector('.header__input');
const loadWindow = document.querySelector('.load-container');

const formAddClient = document.getElementById('form-add-client');
const closeFormAddClientBtn1 = formAddClient.querySelector('.form__close-btn');
const closeFormAddClientBtn2 = formAddClient.querySelector('.form__cansel-btn');
const inputsAddClient = formAddClient.querySelectorAll('.form__input');
const addContactBlock = formAddClient.querySelector('.form__add-contact-block');
const addContactBtnBlock = formAddClient.querySelector('.form__add-contact-btn-block');
const addContactBtnFormAddClient = formAddClient.querySelector('.form__add-contact-btn');
const saveBtnAdd = formAddClient.querySelector('.form__save-btn');
const addContactListFormAddClient = document.querySelector('.form__add-contact-list');

const formEditClient = document.getElementById('form-edit-client');
const closeFormEditClientBtn = formEditClient.querySelector('.form__close-btn');
const inputsEditClient = formEditClient.querySelectorAll('.form__input');
const addContactBtnFormEditClient = formEditClient.querySelector('.form__add-contact-btn');
const addContactListFormEditClient = formEditClient.querySelector('.form__add-contact-list');
const addContactBlockEdit = formEditClient.querySelector('.form__add-contact-block');
const addContactBtnBlockEdit = formEditClient.querySelector('.form__add-contact-btn-block');
const addClientBtnEdit = document.querySelector('.add-client__btn');
const deleteFormEditClientBtn = formEditClient.querySelector('.form__delete-btn');
const saveBtnEdit = formEditClient.querySelector('.form__save-btn');

// Открываем окно добавления клиента
function openFormAddClient() {
    overlay.classList.remove('visibility-hidden');
    formAddClient.classList.remove('visibility-hidden');
    addClientBtn.classList.add('visibility-hidden');
    formAddClient.style.opacity = '1';
    overlay.style.opacity = '.6';
};

// Закрываем окно добавления/редактирования клиента
function closeFormAddClient(form, inputs, contactBlock, contactBtnBlock, clientBtn, event) {
    event.preventDefault();
    clearFormData(inputs);
    overlay.classList.add('visibility-hidden');
    form.classList.add('visibility-hidden');
    clientBtn.classList.remove('visibility-hidden');
    form.setAttribute('style', "opacity: 0;");
    overlay.setAttribute('style', "opacity: 0;");
    document.querySelectorAll('.create-data').forEach((item) => {
        item.remove();
        contactBlock.style.paddingTop = '0'
    })
    contactBtnBlock.classList.remove('visibility-hidden');
    contactBlock.style.paddingBottom = '0';
    let checkSelectedBtn = document.querySelector('.selected');
    if (checkSelectedBtn) {
        checkSelectedBtn.classList.remove('selected');
    }
};

// Отчищаем все данные из формы
function clearFormData(inputs) {
    inputs.forEach((input) => {
        let parent = input.parentNode;
        let label = parent.querySelector('.nameLabel');
        if (label) {
            label.remove()
        }
        input.value = '';
        input.classList.remove('bcg-none');
        input.style.borderColor = '#C8C5D1';
    })
};

// Добавляем/убираем заглушку с текстом в input
function stubForInputs(input) {
    input.value.length > 0 ? input.classList.add('bcg-none') : input.classList.remove('bcg-none');
};

// Удаляем input
function deleteInputData(item) {
    let list = item.parentNode;
    let block = list.parentNode;
    let btnBlock = block.querySelector('.form__add-contact-btn-block');
    let btn = item.querySelector('.create-data__delete-btn');
    btn.addEventListener('click', () => {
        item.remove();
        btnBlock.classList.remove('visibility-hidden');
        block.style.paddingBottom = '0';
        if (list.querySelector('.create-data')) return
        else {
            block.style.paddingTop = '0';
        }
        deleteLabelInput();
    })
};

// автозаполнение +7 для type = tel
function inputTel(input) {
    if (input.type == 'tel') {
        if (input.value.length <= 1) {
            input.value = '+7';
        }
    }
};

// Открываем выпадающий списк select 
function openSelect(item, event) {
    event.preventDefault();
    let btn = item.querySelector('.create-data__data-type-btn');
    let selectList = item.querySelector('.select-list');
    let btnArrow = btn.querySelector('.create-data__arrow');
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        let item = event.currentTarget.parentNode;
        let list = item.querySelector('.create-data__select-list');

        document.querySelectorAll('.select-list').forEach((select) => {
            if (select != list) {
                select.classList.add('visibility-hidden');
                let div = select.parentNode
                let btnArrow = div.querySelector('.create-data__arrow');
                btnArrow.style.transform = 'rotate(0)';
            }
        })
        if (selectList.classList.contains('visibility-hidden')) {
            selectList.classList.remove('visibility-hidden');
            btnArrow.style.transform = 'rotate(180deg)';
        } else {
            selectList.classList.add('visibility-hidden');
            btnArrow.style.transform = 'rotate(0)';
        }
    })
}

// Закрываем все выпадающие списки select
function closeSelect() {
    document.querySelectorAll('.select-list').forEach((select) => {
        if (!select.classList.contains('visibility-hidden')) {
            select.classList.add('visibility-hidden');
            let div = select.parentNode
            let btnArrow = div.querySelector('.create-data__arrow');
            btnArrow.style.transform = 'rotate(0)';
        }
    })
}

// Создаем input для создания данных нового контакта
function newInputData(container) {
    container.parentNode.style.paddingTop = '25px';

    let item = document.createElement('li');
    let dataTypeBlock = document.createElement('div');
    let dataTypeBtn = document.createElement('button');
    let btnSpan = document.createElement('span');
    let selectList = document.createElement('ul');
    let selectItem1 = document.createElement('li');
    let selectItem2 = document.createElement('li');
    let selectItem3 = document.createElement('li');
    let selectItem4 = document.createElement('li');
    let selectBtnTel = document.createElement('button');
    let selectBtnEmail = document.createElement('button');
    let selectBtnVk = document.createElement('button');
    let selectBtnFacebook = document.createElement('button');
    let input = document.createElement('input');
    let deleteBtn = document.createElement('button');

    item.classList.add('form__create-item', 'create-data', 'flex');
    dataTypeBlock.classList.add('create-data__data-type-block', 'flex');
    dataTypeBtn.classList.add('create-data__data-type-btn', 'btn', 'flex');
    btnSpan.classList.add('create-data__btn-name');
    selectList.classList.add('create-data__select-list', 'select-list', 'visibility-hidden');
    selectItem1.classList.add('create-data__select-item');
    selectItem2.classList.add('create-data__select-item');
    selectItem3.classList.add('create-data__select-item');
    selectItem4.classList.add('create-data__select-item');
    selectBtnTel.classList.add('create-data__select-btn', 'btn');
    selectBtnEmail.classList.add('create-data__select-btn', 'btn');
    selectBtnVk.classList.add('create-data__select-btn', 'btn')
    selectBtnFacebook.classList.add('create-data__select-btn', 'btn');
    input.classList.add('create-data__input');
    deleteBtn.classList.add('create-data__delete-btn', 'btn', 'flex');

    let svgArrowSelect = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgArrowSelect.classList.add('create-data__arrow');
    svgArrowSelect.setAttributeNS(null, "viewBox", "0 0 12 12");
    svgArrowSelect.setAttributeNS(null, "width", '12');
    svgArrowSelect.setAttributeNS(null, "height", '12');
    svgArrowSelect.innerHTML = `<g clip-path='url(#clip0_224_6677)'>
        <path d='M1.49503 3.69003C1.25003 3.93503 1.25003 4.33003 1.49503 4.57503L5.65003 8.73003C5.84503 8.92503 6.16003 8.92503 6.35503 8.73003L10.51 4.57503C10.755 4.33003 10.755 3.93503 10.51 3.69003C10.265 3.44503 9.87003 3.44503 9.62503 3.69003L6.00003 7.31003L2.37503 3.68503C2.13503 3.44503 1.73503 3.44503 1.49503 3.69003Z' fill='#9873FF'/>
        </g>
        <defs>
        <clipPath id='clip0_224_6677'>
        <rect width='12' height='12' fill='white' transform='translate(0 12) rotate(-90)'/>
        </clipPath>
        </defs>`

    let svgDelBtn = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgDelBtn.classList.add('create-data__delete-svg')
    svgDelBtn.setAttributeNS(null, "viewBox", "0 0 16 16");
    svgDelBtn.setAttributeNS(null, "width", '16');
    svgDelBtn.setAttributeNS(null, "height", '16');
    svgDelBtn.innerHTML = `<g clip-path='url(#clip0_224_6681)'>
            <path d='M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z' fill='#B0B0B0'/>
            </g>
            <defs>
            <clipPath id='clip0_224_6681'>
            <rect width='16' height='16' fill='white'/>
            </clipPath>
            </defs>`

    btnSpan.textContent = 'Телефон';
    selectBtnTel.textContent = 'Другое';
    selectBtnEmail.textContent = 'Email';
    selectBtnVk.textContent = 'Vk';
    selectBtnFacebook.textContent = 'Facebook';
    input.placeholder = 'Введите данные контакта';

    input.type = 'tel';
    input.value = '+7';
    input.style.position = 'relative';
    input.setAttribute('maxlength', '12');
    input.dataset.type = 'Телефон';

    dataTypeBtn.dataset.type = 'Телефон';
    selectBtnTel.dataset.type = 'Другое';
    selectBtnEmail.dataset.type = 'email';
    selectBtnVk.dataset.type = 'vk';
    selectBtnFacebook.dataset.type = 'facebook';

    container.append(item);
    item.append(dataTypeBlock);
    item.append(input);
    item.append(deleteBtn);
    dataTypeBlock.append(dataTypeBtn);
    dataTypeBlock.append(selectList);
    dataTypeBtn.append(btnSpan);
    dataTypeBtn.append(svgArrowSelect);
    selectList.append(selectItem1);
    selectList.append(selectItem2);
    selectList.append(selectItem3);
    selectList.append(selectItem4);
    selectItem1.append(selectBtnTel);
    selectItem2.append(selectBtnEmail);
    selectItem3.append(selectBtnVk);
    selectItem4.append(selectBtnFacebook);
    deleteBtn.append(svgDelBtn);

    // Если > 10 инпутов то убираем кнопку "Добавить контакт" для формы добавления клиента
    const checkQuantityItem1 = addContactListFormAddClient.querySelectorAll('.create-data');
    if (checkQuantityItem1.length >= 10) {
        formAddClient.querySelector('.form__add-contact-btn-block').classList.add('visibility-hidden');
        addContactBlock.style.paddingBottom = '25px';
    }
    // Если > 10 инпутов то убираем кнопку "Добавить контакт" для формы редактирования клиента
    const checkQuantityItem2 = addContactListFormEditClient.querySelectorAll('.create-data');
    if (checkQuantityItem2.length >= 10) {
        formEditClient.querySelector('.form__add-contact-btn-block').classList.add('visibility-hidden');
        addContactBlockEdit.style.paddingBottom = '25px';
    }

    // автозаполнение +7 для type = tel
    input.addEventListener('input', () => {
        inputTel(input);
    })

    deleteInputData(item);
    return { item, selectList }
};

// Удаляем все label инпутов
function deleteLabelInput() {
    document.querySelectorAll('.input-label').forEach((label) => {
        label.remove();
    });
}

// Валидатор для input
function validatorInput(form) {
    deleteLabelInput();
    let result = true;
    form.querySelectorAll('.create-data__input').forEach((input) => {
        let parentItem = input.parentNode;
        let inputLabel = document.createElement('label');
        let type = input.type;
        inputLabel.classList.add('input-label');
        inputLabel.style.color = '#F06A4D';
        inputLabel.style.position = 'absolute';
        inputLabel.style.top = '-19px';
        switch (type) {
            case 'tel':
                if (input.value.length > 2) {
                    if (/^\+\d{0,11}$/g.test(input.value) == false) {
                        inputLabel.textContent = 'Номер может содержать только цифры';
                        inputLabel.style.right = '55px';
                        parentItem.insertBefore(inputLabel, input);
                        result = false;
                    } else if (input.value.length < 12) {
                        inputLabel.textContent = 'Номер должен содержать 11 цифр';
                        inputLabel.style.right = '70px';
                        parentItem.insertBefore(inputLabel, input);
                        result = false;
                    };
                } else if (input.value.length == 2) {
                    inputLabel.textContent = 'Заполните поле';
                    inputLabel.style.right = '131px';
                    parentItem.insertBefore(inputLabel, input);
                    result = false;
                };
                break;
            case 'text':
                if (input.value.length == 0) {
                    inputLabel.textContent = 'Заполните поле';
                    inputLabel.style.right = '131px';
                    parentItem.insertBefore(inputLabel, input);
                    result = false;
                };
                break;
            case 'email':
                if (input.value.length == 0) {
                    inputLabel.textContent = 'Заполните поле';
                    inputLabel.style.right = '131px';
                    parentItem.insertBefore(inputLabel, input);
                    result = false;
                } else if (/^[a-zA-Z\._]*@[a-zA-z]*\.[a-zA-z]*$/.test(input.value) == false) {
                    inputLabel.textContent = 'Некорректный формат почтового адреса';
                    inputLabel.style.right = '56px';
                    parentItem.insertBefore(inputLabel, input);
                    result = false;
                };
                break;
            case 'url':
                if (input.value.length == 0) {
                    inputLabel.textContent = 'Заполните поле';
                    inputLabel.style.right = '131px';
                    parentItem.insertBefore(inputLabel, input);
                    result = false;
                } else if (/^https?:\/\/.*$/.test(input.value) == false) {
                    inputLabel.textContent = 'Некорректный формат адреса';
                    inputLabel.style.right = '83px';
                    parentItem.insertBefore(inputLabel, input);
                    result = false;
                };
                break;
        };
    });
    return { result };
};

// Валидация полей ФИО
function nameValidator(form) {
    /^[a-zA-zа-яА-я-]+$/
    form.querySelectorAll('.nameLabel').forEach((label) => {
        let input = label.nextElementSibling;
        input.style.borderColor = '#C8C5D1';
        label.remove();
    })

    let result = true;

    let block = form.querySelector('.form__top-block');
    form.querySelectorAll('.form__input').forEach((input) => {
        let label = document.createElement('label');
        label.classList.add('nameLabel');
        label.style.color = '#F06A4D';

        if (input.value.length <= 0 && (input.classList.contains('input-name') || input.classList.contains('input-surname'))) {
            label.textContent = 'Заполните поле';
            block.insertBefore(label, input);
            input.style.borderColor = '#F06A4D';
            result = false;
        } else if (input.value.length > 20) {
            label.textContent = 'Максимальное кличество символов 20';
            block.insertBefore(label, input);
            input.style.borderColor = '#F06A4D';
            result = false;
        } else if (/^[a-zA-zа-яА-я-]+$/.test(input.value) == false && input.value.length > 0) {
            label.textContent = 'Введены некорректные символы';
            block.insertBefore(label, input);
            input.style.borderColor = '#F06A4D';
            result = false;
        }
    })
    return { result };
};

// Выбираем тип инпута
function choiceType(newItem) {
    let currentBtn = newItem.querySelector('.create-data__data-type-btn');
    let currentBtnSpan = newItem.querySelector('.create-data__btn-name');
    let input = newItem.querySelector('.create-data__input');
    let btnArrow = currentBtn.querySelector('.create-data__arrow');
    let allSelectBtn = newItem.querySelectorAll('.create-data__select-btn');
    let list = newItem.querySelector('.create-data__select-list');

    function replace(btn, type) {
        deleteLabelInput();
        let currentTextBtn = currentBtnSpan.textContent;
        let currentDatasetBtn = currentBtn.dataset.type;
        let targetDataset = btn.dataset.type;
        let targetTextBtn = btn.textContent;
        input.type = type;
        input.dataset.type = targetDataset;
        currentBtnSpan.textContent = targetTextBtn;
        btn.textContent = currentTextBtn;
        currentBtn.dataset.type = targetDataset;
        btn.dataset.type = currentDatasetBtn;
        if (type == 'tel') {
            input.value = '+7';
        } else {
            input.value = '';
        }
        return
    }
    allSelectBtn.forEach((btn) => {
        btn.addEventListener('click', () => {

            let dataType = btn.dataset.type;
            switch (dataType) {
                case 'Телефон':
                    replace(btn, 'tel');
                    input.setAttribute('maxlength', '12');
                    break;
                case 'email':
                    replace(btn, 'email');
                    input.setAttribute('maxlength', '30');
                    break;
                case 'vk':
                    replace(btn, 'url');
                    input.setAttribute('maxlength', '100');
                    break;
                case 'facebook':
                    replace(btn, 'url');
                    input.setAttribute('maxlength', '100');
                    break;
                case 'Другое':
                    replace(btn, 'text');
                    input.setAttribute('maxlength', '50');
                    break;
            }
            list.classList.add('visibility-hidden');
            btnArrow.style.transform = 'rotate(0)';
        })
    })
};

// обрабатываем ФИО
function treatmentName(form) {
    let name = form.querySelector('.input-name').value;
    let surname = form.querySelector('.input-surname').value;
    let lastname = form.querySelector('.input-lastname').value;
    name = name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
    surname = surname.slice(0, 1).toUpperCase() + surname.slice(1).toLowerCase();
    if (lastname.length > 0) {
        lastname = lastname.slice(0, 1).toUpperCase() + lastname.slice(1).toLowerCase();
    }

    return {
        name,
        surname,
        lastname
    }
};

// Обрабатываем инпуты
function treatmentInputs() {
    let arrContacts = [];
    document.querySelectorAll('.create-data__input').forEach((input) => {
        let contact = {
            type: input.dataset.type,
            value: input.value
        }
        arrContacts.push(contact)
    })
    return { arrContacts }
}

// Сохраняем редактирование клиента в таблице
function loadEditClient(objData, tr) {
    let fullName = tr.querySelector('.fullname');
    let tdContacts = tr.querySelector('.contacts');
    let btnContacts = tdContacts.querySelectorAll('.btn');
    fullName.textContent = `${objData.surname} ${objData.name} ${objData.lastName}`;
    if (btnContacts.length > 0) {
        btnContacts.forEach((btn) => {
            btn.remove();
        })
    };
    newIconContact(objData, tdContacts);
}

// Создаем значек нового контакта в таблице
function newIconContact(objContact, tdContacts) {
    objContact.contacts.forEach((contact) => {
        let type = contact.type;

        let tooltipContainer;
        let tooltip;
        let tooltipType;
        let tooltipValue;
        // Появление tooltip при наведении курсора на кнопку
        function mouseover(btn, contact) {
            btn.addEventListener('mouseover', () => {
                document.querySelectorAll('.tooltip-container').forEach((el) => {
                    el.remove();
                })
                let value = contact.value;
                let type = contact.type;

                tooltipContainer = document.createElement('div');
                tooltip = document.createElement('div');
                tooltipType = document.createElement('span');

                tooltipContainer.classList.add('tooltip-container');
                tooltip.classList.add('tooltip');

                tooltipValue = (type == 'vk' || type == 'facebook') ? document.createElement('a') : document.createElement('span');
                if (tooltipValue.tagName == 'A') {
                    tooltipValue.setAttribute('href', '#')
                    tooltipValue.style.display = 'inline-block';
                    tooltipValue.style.color = '#9873FF';
                    tooltipValue.style.textDecoration = 'underline';
                    tooltipValue.style.cursor = 'pointer';
                }

                tooltipType.textContent = type == 'Другое' ? '' : `${type}:`;
                tooltipType.style.marginRight = type == 'Другое' ? '0' : '5px';
                tooltipValue.textContent = value;

                if (tooltipValue.hasAttribute('href')) {
                    tooltipValue.setAttribute('href', tooltipValue.textContent)
                }

                tooltipContainer.append(tooltip);
                tooltip.append(tooltipType, tooltipValue);
                document.body.append(tooltipContainer);

                let coords = btn.getBoundingClientRect();
                let left = coords.left + (btn.offsetWidth - tooltipContainer.offsetWidth) / 2;
                let top = coords.top - tooltipContainer.offsetHeight - 5;
                tooltipContainer.style.left = left + 'px';
                tooltipContainer.style.top = top + 'px';
            })
        }

        // Удаление tooltip при отведении курсора с кнопки
        function mouseout(btn) {
            btn.addEventListener('mouseout', () => {
                setTimeout(() => {
                    tooltipContainer.remove();
                }, 2000)
            })
        }

        function addContact(td, svg) {
            let btn = document.createElement('div');
            btn.classList.add('btn');
            btn.style.width = '16px';
            btn.style.height = '16px';            
            btn.append(svg);
            td.append(btn);
            return { btn }
        };

        switch (type) {
            case 'Телефон':
                let mainPhoneSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                mainPhoneSvg.classList.add('main-phone');
                mainPhoneSvg.setAttributeNS(null, "viewBox", "0 0 16 16");
                mainPhoneSvg.setAttributeNS(null, "width", '16');
                mainPhoneSvg.setAttributeNS(null, "height", '16');
                mainPhoneSvg.innerHTML = `<g opacity="0.7">
                    <circle cx="8" cy="8" r="8" fill="#9873FF"/>
                    <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444
                     10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444
                     6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 
                     4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 
                     9.50222Z" fill="white"/>
                    </g>`
                let mainPhoneBtn = addContact(tdContacts, mainPhoneSvg);
                mouseover(mainPhoneBtn.btn, contact);
                mouseout(mainPhoneBtn.btn)
                break;
            case 'Другое':
                let supPhoneSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                supPhoneSvg.classList.add('main-phone');
                supPhoneSvg.setAttributeNS(null, "viewBox", "0 0 16 16");
                supPhoneSvg.setAttributeNS(null, "width", '16');
                supPhoneSvg.setAttributeNS(null, "height", '16');
                supPhoneSvg.innerHTML = `<path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 
                    8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 
                    8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 
                    7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 
                    8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>`
                let supPhoneBtn = addContact(tdContacts, supPhoneSvg);
                mouseover(supPhoneBtn.btn, contact);
                mouseout(supPhoneBtn.btn);
                break;
            case 'email':
                let emailSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                emailSvg.classList.add('main-phone');
                emailSvg.setAttributeNS(null, "viewBox", "0 0 16 16");
                emailSvg.setAttributeNS(null, "width", '16');
                emailSvg.setAttributeNS(null, "height", '16');
                emailSvg.innerHTML = `<path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 
                    8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 
                    12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14
                     6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 
                     4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" 
                     fill="#9873FF"/>`
                let emailBtn = addContact(tdContacts, emailSvg);
                mouseover(emailBtn.btn, contact);
                mouseout(emailBtn.btn);
                break;
            case 'vk':
                let vkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                vkSvg.classList.add('main-phone');
                vkSvg.setAttributeNS(null, "viewBox", "0 0 16 16");
                vkSvg.setAttributeNS(null, "width", '16');
                vkSvg.setAttributeNS(null, "height", '16');
                vkSvg.innerHTML = `<g opacity="0.7">
                    <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 
                    0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 
                    10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 
                    10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914
                     9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 
                     11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 
                     8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948
                      4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 
                      7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 
                      7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 
                      5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 
                      4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 
                      7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 
                      10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 
                      5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 
                      6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" 
                      fill="#9873FF"/></g>`
                let vkBtn = addContact(tdContacts, vkSvg);
                mouseover(vkBtn.btn, contact);
                mouseout(vkBtn.btn);
                break;
            case 'facebook':
                let facebookSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                facebookSvg.classList.add('main-phone');
                facebookSvg.setAttributeNS(null, "viewBox", "0 0 16 16");
                facebookSvg.setAttributeNS(null, "width", '16');
                facebookSvg.setAttributeNS(null, "height", '16');
                facebookSvg.innerHTML = `<g opacity="0.7">
                    <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
                    </g>`
                let facebookBtn = addContact(tdContacts, facebookSvg);
                mouseover(facebookBtn.btn, contact);
                mouseout(facebookBtn.btn);
                break;
        }
    })
}

// Добавляем нового клиента в таблицу
function newClient(objContact) {
    let tr = document.createElement('tr');
    tr.classList.add('table__tbody-tr');
    tbody.append(tr);

    // id
    let tdId = document.createElement('td');
    tdId.classList.add('table__tbody-td', 'id');
    tdId.textContent = objContact.id;
    tr.append(tdId);

    // name
    let tdName = document.createElement('td');
    tdName.classList.add('table__tbody-td', 'fullname');
    tdName.textContent = `${objContact.surname} ${objContact.name} ${objContact.lastName}`;
    tr.append(tdName);

    // Дата создания
    let tdCreateDate = document.createElement('td');
    let boxCreateDate = document.createElement('div');
    let createDate = document.createElement('time');
    let createTime = document.createElement('time');

    tdCreateDate.classList.add('table__tbody-td');
    boxCreateDate.classList.add('date-box');
    createDate.classList.add('table__tbody-create-date');
    createTime.classList.add('table__tbody-create-time');

    let createdAt = new Date(objContact.createdAt);
    let day = String(createdAt.getDate()).length == 2 ? `${createdAt.getDate()}` : `0${createdAt.getDate()}`;
    let month = String(createdAt.getMonth()).length == 2 ? `${createdAt.getMonth() + 1}` : `0${createdAt.getMonth() + 1}`;
    let minutes = String(createdAt.getMinutes()).length == 2 ? `${createdAt.getMinutes()}` : `0${createdAt.getMinutes()}`;

    createDate.textContent = `${day}.${month}.${createdAt.getFullYear()}`;
    createTime.textContent = `${createdAt.getHours()}:${minutes}`;

    tr.append(tdCreateDate);
    tdCreateDate.append(boxCreateDate)
    boxCreateDate.append(createDate);
    boxCreateDate.append(createTime);

    // Дата изменения
    let tdUpdatedDate = document.createElement('td');
    let boxUpdateDate = document.createElement('div');
    let updatedDate = document.createElement('time');
    let updatedTime = document.createElement('time');

    tdUpdatedDate.classList.add('table__tbody-td');
    boxUpdateDate.classList.add('date-box');
    updatedDate.classList.add('table__tbody-updated-date');
    updatedTime.classList.add('table__tbody-updated-time');

    updatedDate.textContent = '-----';
    updatedTime.textContent = '-----';

    tr.append(tdUpdatedDate);
    tdUpdatedDate.append(boxUpdateDate)
    boxUpdateDate.append(updatedDate);
    boxUpdateDate.append(updatedTime);

    // Контакты
    if (objContact.contacts) {
        let tdContacts = document.createElement('td');
        tdContacts.classList.add('table__tbody-td', 'contacts');
        tr.append(tdContacts);
        newIconContact(objContact, tdContacts);
    };

    // Действия (кнопка изменить и удалить)
    let tdActions = document.createElement('td');
    let editBtn = document.createElement('button');
    let deleteBtn = document.createElement('button');

    tdActions.classList.add('table__tbody-td');
    editBtn.classList.add('table__tbody-btn', 'btn-edit', 'btn');
    deleteBtn.classList.add('table__tbody-btn', 'btn-delete', 'btn');

    editBtn.textContent = 'Изменить';
    deleteBtn.textContent = 'Удалить';

    tdActions.append(editBtn, deleteBtn);
    tr.append(tdActions);

    return {
        tr,
        editBtn,
        deleteBtn
    }
};

// Добавляем дату последнего изменения в таблицу
function dateLastEdit(date, tr) {
    let editDateForm = tr.querySelector('.table__tbody-updated-date');
    let editTimeForm = tr.querySelector('.table__tbody-updated-time');
    let currentDate = new Date(date);
    let day = String(currentDate.getDate()).length == 2 ? `${currentDate.getDate()}` : `0${currentDate.getDate()}`;
    let month = String(currentDate.getMonth()).length == 2 ? `${currentDate.getMonth() + 1}` : `0${currentDate.getMonth() + 1}`;
    let editDate = `${day}.${month}.${currentDate.getFullYear()}`;
    let minutes = String(currentDate.getMinutes()).length == 2 ? `${currentDate.getMinutes()}` : `0${currentDate.getMinutes()}`;
    let editTime = `${currentDate.getHours()}:${minutes}`;
    editDateForm.textContent = editDate;
    editTimeForm.textContent = editTime;
};

// Открываем окно удаления контакта
function openWindowDeleteClient(resultNewClient) {
    overlay.classList.remove('visibility-hidden');
    deleteWindow.classList.remove('visibility-hidden');
    deleteWindow.style.opacity = '1';
    overlay.style.opacity = '.6';
    resultNewClient.deleteBtn.style.zIndex = '2';
    resultNewClient.deleteBtn.style.background = '#fff';
    resultNewClient.deleteBtn.classList.add('selected');
};

// Закрываем окно удаления клиента (при нажатии на кнопку "крестик" или "отмена")
function closeWindowDeleteClient() {
    overlay.classList.add('visibility-hidden');
    deleteWindow.classList.add('visibility-hidden');
    deleteWindow.style.opacity = '0';
    overlay.style.opacity = '0';
    let btnSelected = tbody.querySelector('.selected');
    btnSelected.style.background = 'transparent';
    btnSelected.style.zIndex = '0';
    btnSelected.classList.remove('selected');
};

// Закрываем окно удаления клиента (при нажатии на кнопку "удалить")
function deleteClientAndCloseWindow() {
    overlay.classList.add('visibility-hidden');
    deleteWindow.classList.add('visibility-hidden');
    deleteWindow.style.opacity = '0';
    overlay.style.opacity = '0';
};

// Сортировка по ID при загрузке страницы
function sortId() {
    let rowsArray = Array.from(tbody.rows);
    let compare;
    compare = (rowA, rowB) => {
        let str1 = rowA.cells[0].textContent;
        let str2 = rowB.cells[0].textContent;
        return str1 - str2;
    }
    rowsArray.sort(compare);
    tbody.append(...rowsArray);
    let th = document.getElementById('id');
    let arrow = th.querySelector('.table-head__svg-arrow');
    arrow.style.transform = 'rotate(180deg)';
    th.classList.add('sortUp');

};

// Соритровка
function sortTable(cellIndex, type, th) {
    let rowsArray = Array.from(tbody.rows);
    let compare;

    function sortClassRemove() {
        table.querySelectorAll('.sortUp').forEach((el) => {
            if (el) {
                let arrow = el.querySelector('.table-head__svg-arrow');
                el.classList.remove('sortUp');
                arrow.style.transform = 'rotate(0deg)';
            }
        });
        table.querySelectorAll('.sortLow').forEach((el) => {
            if (el) {
                let arrow = el.querySelector('.table-head__svg-arrow');
                el.classList.remove('sortLow');
                arrow.style.transform = 'rotate(0deg)';
            }
        })
    };

    function sortUp(th) {
        let arrow = th.querySelector('.table-head__svg-arrow');
        th.classList.add('sortUp');
        arrow.style.transform = 'rotate(180deg)';
    }

    function sortLow(th) {
        let arrow = th.querySelector('.table-head__svg-arrow');
        th.classList.add('sortLow');
        arrow.style.transform = 'rotate(0deg)';
    }

    function treatmentDate(str) {
        str = str.substr(0, 10);
        let dayStr = str.substr(0, 2);
        let monthStr = str.substr(3, 2);
        let yearStr = str.substr(6, 4);
        let dateStr = Date.parse(new Date(`${monthStr}.${dayStr}.${yearStr}`));
        return { dateStr };
    }

    function treatmentTime(str) {
        str = str.substr(10);
        let hours = str.substr(0, 2);
        let minutes = str.substr(3, 4);
        let dateStr = hours + minutes;
        return { dateStr }
    }

    switch (type) {
        case 'id':
            if (!th.classList.contains('sortUp')) {
                sortClassRemove();
                sortUp(th);
                compare = (rowA, rowB) => {
                    let str1 = rowA.cells[cellIndex].innerHTML;
                    let str2 = rowB.cells[cellIndex].innerHTML;
                    return str1 - str2;
                }
            } else if (th.classList.contains('sortUp')) {
                sortClassRemove();
                sortLow(th);
                compare = (rowA, rowB) => {
                    let str1 = rowA.cells[cellIndex].innerHTML;
                    let str2 = rowB.cells[cellIndex].innerHTML;
                    return str2 - str1;
                }
            }
            break;
        case 'fullName':
            if (!th.classList.contains('sortUp')) {
                sortClassRemove();
                sortUp(th)
                compare = (rowA, rowB) => {
                    let str1 = rowA.cells[cellIndex].innerHTML;
                    let str2 = rowB.cells[cellIndex].innerHTML;
                    return str1[0] > str2[0] ? 1 : -1;
                }
            } else if (th.classList.contains('sortUp')) {
                sortClassRemove();
                sortLow(th);
                compare = (rowA, rowB) => {
                    let str1 = rowA.cells[cellIndex].innerHTML;
                    let str2 = rowB.cells[cellIndex].innerHTML;
                    return str2[0] > str1[0] ? 1 : -1;
                }
            }
            break;
        case 'createData':
            if (!th.classList.contains('sortUp')) {
                sortClassRemove();
                sortUp(th);
                compare = (rowA, rowB) => {
                    let str1 = rowA.cells[cellIndex].textContent;
                    let str2 = rowB.cells[cellIndex].textContent;
                    let strDate1 = treatmentDate(str1);
                    let strDate2 = treatmentDate(str2);
                    if (strDate1.dateStr == strDate2.dateStr) {
                        let strTime1 = treatmentTime(str1);
                        let strTime2 = treatmentTime(str2);
                        return strTime2.dateStr > strTime1.dateStr ? 1 : -1;
                    } else {
                        return strDate2.dateStr > strDate1.dateStr ? 1 : -1;
                    }
                }
            } else if (th.classList.contains('sortUp')) {
                sortClassRemove();
                sortLow(th);
                compare = (rowA, rowB) => {
                    let str1 = rowA.cells[cellIndex].textContent;
                    let str2 = rowB.cells[cellIndex].textContent;                    
                    let strDate1 = treatmentDate(str1);
                    let strDate2 = treatmentDate(str2);
                    if (strDate1.dateStr == strDate2.dateStr) {
                        let strTime1 = treatmentTime(str1);
                        let strTime2 = treatmentTime(str2);
                        return strTime1.dateStr > strTime2.dateStr ? 1 : -1;
                    } else {
                        return strDate1.dateStr > strDate2.dateStr ? 1 : -1;
                    }
                }
            };
            break;
        case 'editDate':
            if (!th.classList.contains('sortUp')) {
                sortClassRemove();
                sortUp(th);
                compare = (rowA, rowB) => {
                    let str1 = rowA.cells[cellIndex].textContent;
                    let str2 = rowB.cells[cellIndex].textContent;
                    let strDate1 = treatmentDate(str1);
                    let strDate2 = treatmentDate(str2);
                    if (strDate1.dateStr == strDate2.dateStr) {
                        let strTime1 = treatmentTime(str1);
                        let strTime2 = treatmentTime(str2);
                        return strTime2.dateStr > strTime1.dateStr ? 1 : -1;
                    } else {
                        return strDate2.dateStr > strDate1.dateStr ? 1 : -1;
                    }                    
                }
            } else if (th.classList.contains('sortUp')) {
                sortClassRemove();
                sortLow(th);
                compare = (rowA, rowB) => {
                    let str1 = rowA.cells[cellIndex].textContent;
                    let str2 = rowB.cells[cellIndex].textContent;
                    let strDate1 = treatmentDate(str1);
                    let strDate2 = treatmentDate(str2);
                    if (strDate1.dateStr == strDate2.dateStr) {
                        let strTime1 = treatmentTime(str1);
                        let strTime2 = treatmentTime(str2);
                        return strTime1.dateStr > strTime2.dateStr ? 1 : -1;
                    } else {
                        return strDate1.dateStr > strDate2.dateStr ? 1 : -1;
                    }
                }
            };
            break;

    }
    rowsArray.sort(compare);
    tbody.append(...rowsArray)
}

//---------------------Вызов всех функций---------------------------------------------

// Выгружаем данные из сервера в таблицу
tbody.classList.add('display-none');
(async function () {
    await loadClients();
    tbody.classList.remove('display-none');
    loadWindow.classList.add('display-none');
}());


// Открываем окно добавления клиента
addClientBtn.addEventListener('click', openFormAddClient);

// Закрываем окно добавления клиента
closeFormAddClientBtn1.addEventListener('click', (event) => {
    closeFormAddClient(formAddClient, inputsAddClient, addContactBlock, addContactBtnBlock, addClientBtn, event);
});
closeFormAddClientBtn2.addEventListener('click', (event) => {
    closeFormAddClient(formAddClient, inputsAddClient, addContactBlock, addContactBtnBlock, addClientBtn, event);
});

// Закрываем окно редактирования клиента
closeFormEditClientBtn.addEventListener('click', (event) => {
    closeFormAddClient(formEditClient, inputsEditClient, addContactBlockEdit, addContactBtnBlockEdit, addClientBtnEdit, event);
});

//  Открываем оконо удаления клиента через окно редактирования клиента
deleteFormEditClientBtn.addEventListener('click', (event) => {
    let selectedBtn = document.querySelector('.selected');
    let selectedTd = selectedBtn.parentNode;
    let selectedTr = selectedTd.parentNode;
    let deleteBtn = selectedTr.querySelector('.btn-delete');
    let btnObj = {};
    btnObj.deleteBtn = deleteBtn;
    closeFormAddClient(formEditClient, inputsEditClient, addContactBlockEdit, addContactBtnBlockEdit, addClientBtnEdit, event);
    openWindowDeleteClient(btnObj);
});

// Добавляем/удаляем заглушку с текстом в input в окно с созданием нового клиента
inputsAddClient.forEach((input) => {
    input.addEventListener('input', () => {
        stubForInputs(input);
    })
});

// Добавляем/удаляем заглушку с текстом в input в окно с редактированием клиента
inputsEditClient.forEach((input) => {
    input.addEventListener('input', () => {
        stubForInputs(input);
    })
});

// Функция на закрывание окна удаления клиента (при нажатии на кнопку "крестик" или "отмена")
canselBtn.addEventListener('click', closeWindowDeleteClient);
crossBtn.addEventListener('click', closeWindowDeleteClient);

// Создаем input для создания данных нового контакта (в форме для создания нового клиента)
addContactBtnFormAddClient.addEventListener('click', (event) => {
    event.preventDefault();
    let newItem = newInputData(addContactListFormAddClient);
    // Выбор input type    
    choiceType(newItem.item);
    openSelect(newItem.item, event);
});

// Создаем input для создания данных нового контакта (в форме редактирования клиента)
addContactBtnFormEditClient.addEventListener('click', (event) => {
    event.preventDefault();
    let newItem = newInputData(addContactListFormEditClient);
    // Выбор input type    
    choiceType(newItem.item);
    openSelect(newItem.item, event);
});

// Проверяем валидность всех инпутов окна ДОБАВЛЕНИЯ клиента и добавляем нового клиента
let checkAdd = false;

saveBtnAdd.addEventListener('click', () => {
    closeSelect();
    let nameValid = nameValidator(formAddClient);
    let inputValid = validatorInput(formAddClient);
    checkAdd = inputValid.result == true && nameValid.result == true ? true : false;
});

formAddClient.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (checkAdd == true) {
        let name = treatmentName(formAddClient);
        let contacts = treatmentInputs();
        await saveDataServer(name, contacts);
        closeFormAddClient(formAddClient, inputsAddClient, addContactBlock, addContactBtnBlock, addClientBtn, event);
        await loadNewClient();
    };
});

formEditClient.addEventListener('submit', async (event) => {
    event.preventDefault();
});

// Проверяем валидность всех инпутов окна РЕДАКТИРОВАНИЯ, затем проверяем были ли внесены изменения, если да то вносим, если нет закрываем окно
saveBtnEdit.addEventListener('click', async (event) => {
    event.preventDefault();
    let id = formEditClient.querySelector('.form__title-id-number');
    let selectedBtn = document.querySelector('.selected');
    let td = selectedBtn.parentNode;
    let tr = td.parentNode;
    let fullName;
    let contacts;

    closeSelect();
    let checkEdit = false;
    let nameValid = nameValidator(formEditClient);
    let inputValid = validatorInput(formEditClient);
    checkEdit = inputValid.result == true && nameValid.result == true ? true : false;

    let compareResult = [];
    let compare;
    if (checkEdit == true) {
        fullName = treatmentName(formEditClient);
        contacts = treatmentInputs();
        let result = await requestDataClient(id);
        compare = fullName.name == result.data.name ? true : false;
        compareResult.push(compare);
        compare = fullName.surname == result.data.surname ? true : false;
        compareResult.push(compare);
        compare = fullName.lastname == result.data.lastName ? true : false;
        compareResult.push(compare);
        compare = JSON.stringify(contacts.arrContacts) == JSON.stringify(result.data.contacts) ? true : false;
        compareResult.push(compare);
        compareResult.forEach((el) => {
            let check;
            if (el === false) {
                check = false
            };
            if (check === false) {
                compare = false;
            };
        });        
    } 

    if (!compare && checkEdit) {
        closeFormAddClient(formEditClient, inputsEditClient, addContactBlockEdit, addContactBtnBlockEdit, addClientBtnEdit, event);
        overlay.classList.remove('visibility-hidden');
        overlay.style.opacity = '0.6';
        let loadWindow = document.querySelector('.save-load');
        loadWindow.classList.remove('display-none');
        let data = await saveEditDataServer(fullName, contacts, id);
        try {
            if (/^20\d$/.test(data.status)) {
                dateLastEdit(data.date, tr);
                loadEditClient(data.data, tr);
                tr.style.backgroundColor = '#9e80f1';
                setTimeout(() => tr.style.backgroundColor = 'white', 500);
            }
        } catch (error) {
            if (/^[45]\d{2}$/.test(data.status)) {
                alert(`Возникла ошибка ${error.name}: ${error.message}`)
            } else {
                alert('Что то пошло не так')
            }
        }
        overlay.style.opacity = '0';
        overlay.classList.add('visibility-hidden');
        loadWindow.classList.add('display-none');
    } else {
        nameValidator(formEditClient);
        validatorInput(formEditClient);
    };
});

// Удаляем контакт из таблицы и сервера
deleteClientBtn.addEventListener('click', deleteClient);

// Сортируем таблицу
table.addEventListener('click', (event) => {
    // console.log(event.target)
    if (event.target.className == 'table-head__th' || event.target.className == 'table-head__text' || event.target.className == 'table-head__th-block') {
        let th;
        if (event.target.tagName == 'SPAN') {
            let thBlock = event.target.parentNode
            th = thBlock.parentNode;
        } else if (event.target.className == 'table-head__th-block') {
            th = event.target.parentNode;
        } else {
            th = event.target
        };
        sortTable(th.cellIndex, th.dataset.type, th);
    }
});

// Поиск
headerForm.addEventListener('submit', (e) => {
    e.preventDefault();
});

let timer;

headerInput.addEventListener('input', () => {
    function insertMark(str, inputValue) {
        let pos = str.textContent.search(inputValue);
        let inputLength = inputValue.length;
        let arr = str.textContent.trim().split('');
        arr.splice(pos, inputLength, `<mark>${inputValue}</mark>`);
        let newStr = arr.join('');
        str.innerHTML = newStr;
    }
    let inputValue = headerInput.value.trim();
    clearTimeout(timer);
    tbody.querySelectorAll(('display-none-tr')).forEach((el) => {
        el.classList.remove('display-none-tr');
    })
    timer = setTimeout(async () => {
        table.querySelectorAll('.table__tbody-tr').forEach((tr) => {
            tr.remove();
        });
        await loadClients();
        table.querySelectorAll('.table__tbody-tr').forEach((tr) => {
            let id = tr.querySelector('.id');
            let fullName = tr.querySelector('.fullname');
            let check = false;

            if (id.textContent.includes(inputValue)) {
                insertMark(id, inputValue);
                check = true;
            };
            if (fullName.textContent.toUpperCase().includes(inputValue.toUpperCase())) {
                insertMark(fullName, inputValue)
                check = true;
            }
            if (!check) {
                tr.classList.add('display-none-tr');
            }
        })
    }, 500);
});


export { newClient, openWindowDeleteClient, deleteClientAndCloseWindow, stubForInputs, newInputData, openSelect, choiceType, dateLastEdit, sortId }