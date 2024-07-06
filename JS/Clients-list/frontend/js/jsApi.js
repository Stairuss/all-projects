import { newClient, openWindowDeleteClient, deleteClientAndCloseWindow, stubForInputs, newInputData, openSelect, choiceType, dateLastEdit, sortId } from './main.js'

//Выгружаем данные на сервер
async function saveDataServer(name, contacts) {
    const response = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name.name,
            surname: name.surname,
            lastName: name.lastname,
            contacts: contacts.arrContacts
        })
    })
};

// Запрос данных из сервера
async function requestData() {
    const response = await fetch('http://localhost:3000/api/clients');    
    const data = await response.json();
    return { data }
}

// Запрос данных о клиенте по id
async function requestDataClient(id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id.textContent}`);
    const data = await response.json();    
    return { data }
}

const overlay = document.querySelector('.overlay');
const tbody = document.querySelector('.table__tbody');
const formEditClient = document.getElementById('form-edit-client');
const addClientBtn = document.querySelector('.add-client__btn');

// Выгружаем данные из сервера в таблицу при загрузке или обновлении страницы
let loadClients = async () => {
    const response = await fetch('http://localhost:3000/api/clients');
    const data = await response.json();    
    if (data.length > 0) {
        data.forEach((obj) => {
            let resultNewClient = newClient(obj);
            dateLastEdit(obj.updatedAt, resultNewClient.tr);
            resultNewClient.deleteBtn.addEventListener('click', () => {
                openWindowDeleteClient(resultNewClient);
            })
            resultNewClient.editBtn.addEventListener('click', (event) => {
                openFormEditClient(event);
            });
        });
        sortId();
    };

};

// Добавляем нового клиента в таблицу сразу же после создания
let loadNewClient = async () => {
    overlay.classList.remove('visibility-hidden');
    overlay.style.opacity = '.6';
    let loadWindow = document.querySelector('.save-load');
    loadWindow.classList.remove('display-none');
    const response = await fetch('http://localhost:3000/api/clients');
    const data = await response.json();    
    if (data.length > 0) {
        let newContactObj = data.at(-1);
        let addNewContact = newClient(newContactObj);        
        dateLastEdit(newContactObj.updatedAt, addNewContact.tr);
        addNewContact.deleteBtn.addEventListener('click', () => {
            openWindowDeleteClient(addNewContact);
        })
        addNewContact.editBtn.addEventListener('click', (event) => {
            openFormEditClient(event);
        })
    };
    loadWindow.classList.add('display-none');
    overlay.style.opacity = '0';
    overlay.classList.add('visibility-hidden');
};

const inputSurname = formEditClient.querySelector('.input-surname');
const inputName = formEditClient.querySelector('.input-name');
const inputLastName = formEditClient.querySelector('.input-lastname');
const allFormInput = formEditClient.querySelectorAll('.form__input');
const idClientForm = formEditClient.querySelector('.form__title-id-number');
const addContactListFormEditClient = formEditClient.querySelector('.form__add-contact-list');


// Открываем форму редактирования клиента
async function openFormEditClient(event) {
    overlay.classList.remove('visibility-hidden');
    overlay.style.opacity = '.6';
    let loadWindow = document.querySelector('.save-load');
    loadWindow.classList.remove('display-none');
    event.target.classList.add('selected');
    let parentTd = event.target.parentNode;
    let parentTr = parentTd.parentNode;
    let id = parentTr.querySelector('.id');
    const response = await fetch(`http://localhost:3000/api/clients/${id.textContent}`);
    const data = await response.json();
    inputSurname.value = data.surname;
    inputName.value = data.name;
    if (data.lastName) {
        inputLastName.value = data.lastName;
    };
    allFormInput.forEach((input) => {
        stubForInputs(input);
    });
    idClientForm.textContent = data.id;

    function replace(input, type, value, selectBtn) {
        input.value = value;
        input.dataset.type = type;
        selectBtn.dataset.type = type;
    }
    for (let i in data.contacts) {
        let newItem = newInputData(addContactListFormEditClient);
        let input = newItem.item.querySelector('.create-data__input');
        let nameSelectBtn = newItem.item.querySelector('.create-data__btn-name');
        switch (data.contacts[i].type) {
            case 'Телефон':
                replace(input, data.contacts[i].type, data.contacts[i].value, nameSelectBtn);
                input.setAttribute('maxlength', '12');
                input.type = 'tel';
                nameSelectBtn.textContent = 'Телефон';
                break;
            case 'email':
                replace(input, data.contacts[i].type, data.contacts[i].value, nameSelectBtn);
                input.setAttribute('maxlength', '30');
                input.type = 'email';
                nameSelectBtn.textContent = 'Email';
                break;
            case 'vk':
                replace(input, data.contacts[i].type, data.contacts[i].value, nameSelectBtn);
                input.setAttribute('maxlength', '30');
                input.type = 'url';
                nameSelectBtn.textContent = 'Vk';
                break;
            case 'facebook':
                replace(input, data.contacts[i].type, data.contacts[i].value, nameSelectBtn);
                input.setAttribute('maxlength', '30');
                input.type = 'url';
                nameSelectBtn.textContent = 'Facebook';
                break;
            case 'Другое':
                replace(input, data.contacts[i].type, data.contacts[i].value, nameSelectBtn);
                input.setAttribute('maxlength', '12');
                input.type = 'text';
                nameSelectBtn.textContent = 'Другое';
                break;
        }
        choiceType(newItem.item)
        openSelect(newItem.item, event);
    };
    formEditClient.classList.remove('visibility-hidden');
    addClientBtn.classList.add('visibility-hidden');
    formEditClient.style.opacity = '1';
    loadWindow.classList.add('display-none');
}

// Сохранияем редактирование клиента на сервере
async function saveEditDataServer(name, contacts, id) {
    let response = await fetch(`http://localhost:3000/api/clients/${id.textContent}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name.name,
            surname: name.surname,
            lastName: name.lastname,
            contacts: contacts.arrContacts
        })
    });
    const data = await response.json();
    let date = Date.parse(data.updatedAt);
    let status = response.status;
    return { date, data, status }
};

// Удаляем клиента из таблицы и сервера 
async function deleteClient() {
    deleteClientAndCloseWindow();
    overlay.classList.remove('visibility-hidden');
    overlay.style.opacity = '.6';
    let loadWindow = document.querySelector('.save-load');
    loadWindow.classList.remove('display-none');

    let selectedBtn = tbody.querySelector('.selected');
    let tdSelectedBtn = selectedBtn.parentNode;
    let trSelectedBtn = tdSelectedBtn.parentNode;
    let id = trSelectedBtn.querySelector('.id');
    await fetch(`http://localhost:3000/api/clients/${id.textContent}`, {
        method: 'DELETE'
    });
    loadWindow.classList.add('display-none');
    overlay.style.opacity = '0';
    overlay.classList.add('visibility-hidden');
    trSelectedBtn.remove();
};



export { saveDataServer, loadClients, deleteClient, loadNewClient, saveEditDataServer, requestDataClient, requestData };