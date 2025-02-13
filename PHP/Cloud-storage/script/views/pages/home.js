const PATH = 'http://localhost/welcome/php-developer-base/final-work/';
// const PATH = '/';

// Получение списка всех пользователей
async function getUsers() {
    return await fetch(PATH + 'admin/list?outputType=echo').then(res => res.json());
}

//Выгрузка всех пользователей в таблицу
async function addUsers() {
    if (document.querySelector('.users')) {
        let userTable = document.querySelector('.users__table');
        let userTbody = userTable.querySelector('.users__tbody');
        let data = await getUsers();
        if (typeof data['users'] === 'string') {
            userTbody.textContent = 'В доступе отказано';
            return;
        }
        for (let user in data['users']) {
            createUser(userTbody, data['users'][user], data['idCurrentAdmin'])
        }
        getFilesUserOnClick();
    }
}

// Добавление пользователя в список пользователей
async function createUser(container, userData, idCurrentAdmin = null) {
    let tr = document.createElement('tr');
    let tdId = document.createElement('td');
    let tdName = document.createElement('td');
    let tdEmail = document.createElement('td');
    let tdAge = document.createElement('td');
    let tdRole = document.createElement('td');
    let tdGender = document.createElement('td');
    let tdActions = document.createElement('td');
    let divActions = document.createElement('div');

    tr.classList.add('tbody__tr');
    tdId.classList.add('tbody__td');
    tdName.classList.add('tbody__td');
    tdEmail.classList.add('tbody__td');
    tdAge.classList.add('tbody__td');
    tdRole.classList.add('tbody__td');
    tdGender.classList.add('tbody__td');
    tdActions.classList.add('tbody__td');
    divActions.classList.add('users__actions');

    tr.id = userData['id'];
    tdId.textContent = userData['id'];
    tdName.textContent = userData['name'];
    tdEmail.textContent = userData['email'];
    tdAge.textContent = userData['age'];
    tdRole.textContent = userData['role'];
    tdGender.textContent = userData['gender'];

    container.append(tr);
    tr.append(tdId);
    tr.append(tdName);
    tr.append(tdEmail);
    tr.append(tdAge);
    tr.append(tdRole);
    tr.append(tdGender);
    tr.append(tdActions);
    tdActions.append(divActions);

    if (idCurrentAdmin != userData['id']) {
        let deleteUserBtn = document.createElement('button');
        let updateUser = document.createElement('a');
        deleteUserBtn.classList.add('users__actions-element', 'delete-user', 'btn');
        updateUser.classList.add('users__actions-element', 'update-user');
        deleteUserBtn.textContent = 'Удалить';
        updateUser.textContent = 'Изменить';
        updateUser.href = PATH + 'users/update?id=' + userData['id'];
        divActions.append(deleteUserBtn);
        divActions.append(updateUser);
        deleteUserBtn.addEventListener('click', () => {
            deleteUser(deleteUserBtn);
        })
    } else if (idCurrentAdmin === userData['id']) {
        tr.classList.add('currentUser');
    }

}

// Переключить режим на пользователя
async function switchUser() {
    await new Promise((resolve, reject) => {
        fetch(PATH + 'admin/switch_role?switch=user')
            .then(res => res.json())
            .then(res => {
                res === true ? resolve(true) : reject(false)
            })
    }).catch(res => {
        alert('Не удалось изменить статус');
        throw new Error('Ошибка при отпарвке запроса к базе данных');
    })

    document.querySelector('.users').remove();
    let content = document.querySelector('.content');
    let userRole = document.querySelector('.header__user-role');
    let switchRoleBtn = document.querySelector('.switch-role-btn');
    let switchItem = document.querySelector('.switch-item');
    let actionsContainer = document.querySelector('.actions__container');
    let overlay = document.querySelector('.overlay');
    let interface = document.querySelector('.interface');

    content.style.gridTemplateColumns = '1fr';
    interface.style.paddingLeft = '50%';
    userRole.innerHTML = '<strong><u>user</strong></u></span>';

    let switchRoleBtnClone = switchRoleBtn.cloneNode(false);
    switchRoleBtn.remove();
    switchRoleBtnClone.innerHTML = "Присвоить статус 'admin'";
    switchRoleBtnClone.classList.remove('switch-user');
    switchRoleBtnClone.classList.add('switch-admin');
    switchItem.append(switchRoleBtnClone);
    actionsContainer.style.display = 'none';
    overlay.style.display = 'none';

    switchRoleBtnClone.addEventListener('click', () => {
        switchAdmin(content);
    })
}

// Переключить режим на администратора
async function switchAdmin(container) {
    let password = prompt('Введите пароль');
    if (password != '0000') {
        alert('в Доступе отказано');
        return;
    }
    await new Promise((resolve, reject) => {
        fetch(PATH + 'admin/switch_role?switch=admin')
            .then(res => res.json())
            .then(res => {
                res === true ? resolve(true) : reject(false)
            })
    }).catch(res => {
        alert('Не удалось изменить статус');
        throw new Error('Ошибка при отпарвке запроса к базе данных');
    })
    await new Promise((resolve) => {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = PATH + 'style/contentElements/usersList.css';
        link.addEventListener('load', () => {
            resolve();
        });
        document.head.append(link);
    })

    let content = document.createElement('div');
    let title = document.createElement('h3');
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tr = document.createElement('tr');
    let thId = document.createElement('th');
    let thName = document.createElement('th');
    let thEmail = document.createElement('th');
    let thAge = document.createElement('th');
    let thRole = document.createElement('th');
    let thGender = document.createElement('th');
    let thActions = document.createElement('th');
    let tbody = document.createElement('tbody');

    content.classList.add('content__block', 'users');
    title.classList.add('content__block-title');
    table.classList.add('users__table', 'table');
    thead.classList.add('thead');
    tr.classList.add('thead__tr');
    thId.classList.add('thead__id');
    thName.classList.add('thead__name');
    thEmail.classList.add('thead__email');
    thAge.classList.add('thead__age');
    thRole.classList.add('thead__role');
    thGender.classList.add('thead__gender');
    thActions.classList.add('thead__users-actions');
    tbody.classList.add('users__tbody', 'tbody');

    title.textContent = 'Список пользователей';
    thId.textContent = 'id';
    thName.textContent = 'Имя';
    thEmail.textContent = 'Email';
    thAge.textContent = 'Возраст';
    thRole.textContent = 'Роль';
    thGender.textContent = 'Пол';
    thActions.textContent = 'Действия';

    container.append(content);
    content.append(title);
    content.append(table);
    table.append(thead);
    table.append(tbody);
    thead.append(tr);
    thead.append(thId);
    thead.append(thName);
    thead.append(thEmail);
    thead.append(thAge);
    thead.append(thRole);
    thead.append(thGender);
    thead.append(thActions);

    let userRole = document.querySelector('.header__user-role');
    let switchRoleBtn = document.querySelector('.switch-role-btn');
    let switchItem = document.querySelector('.switch-item');
    let actionsContainer = document.querySelector('.actions__container');
    let overlay = document.querySelector('.overlay');
    let interface = document.querySelector('.interface');

    container.style.gridTemplateColumns = '1fr 2fr';
    interface.style.paddingLeft = '30%';
    userRole.innerHTML = '<strong><u>admin</strong></u></span>';
    let switchRoleBtnClone = switchRoleBtn.cloneNode(false);
    switchRoleBtn.remove();
    switchRoleBtnClone.innerHTML = "Присвоить статус 'user'";
    switchRoleBtnClone.classList.add('switch-user');
    switchRoleBtnClone.classList.remove('switch-admin');
    switchItem.append(switchRoleBtnClone);
    actionsContainer.style.display = 'none';
    overlay.style.display = 'none';

    switchRoleBtnClone.addEventListener('click', switchUser);

    addUsers();
}

// Удаление пользователя
function deleteUser(btn) {
    let confirmation = confirm('Вы уверены?');
    if (!confirmation) return;
    let tr = btn.closest('tr');
    let id = tr.id;
    new Promise((resolve, reject) => {
        fetch(PATH + 'admin/delete_user?id=' + id)
            .then(res => res.json())
            .then(res => {
                res = res === true ? resolve() : reject();
            })
    }).then(res => {
        alert('Пользователь удален');
        tr.remove();
    }, res => {
        alert('Не удалось выполнить запрос на удаление');
        throw new Error('Ошибка при отпарвке запроса к базе данных');
    })
}

//Открытие формы для создания новой папки
function openFormCreateFolder(form, event) {
    let input = form.querySelector('.working-folders-input');
    let button = form.querySelector('.working-folders-btn');

    form.style.display = 'grid';
    form.style.top = event.clientY;
    form.style.left = event.clientX;
    form.dataset.type = 'folder';
    form.enctype = 'application/x-www-form-urlencoded';
    input.type = 'text';
    input.placeholder = 'Введите название новой папки';
    input.name = 'folderName';
    button.textContent = 'Создать';
    overlay.style.display = 'block';
}

//Открытие формы для добавления нового файла
function openFormAddNewFile(form, event) {
    let input = form.querySelector('.working-folders-input');
    let button = form.querySelector('.working-folders-btn');

    form.style.display = 'grid';
    form.style.top = event.clientY;
    form.style.left = event.clientX;
    form.dataset.type = 'file';
    form.enctype = 'multipart/form-data';
    input.type = 'file';
    input.name = 'fileName';
    input.style.border = 'none';
    button.textContent = 'Добавить';
    overlay.style.display = 'block';
}

//Определение последнего номера файла
function checkLastNumberFile() {
    let table = document.querySelector('.files__tbody');
    let tr = table.lastElementChild;
    if (tr) {
        let id = Number(tr.firstElementChild.textContent);
        return id + 1;
    } else {
        return 1;
    }
}

// Создание новой папки
function createFolder(form, overlay) {
    let input = form.querySelector('.working-folders-input');
    let url = new URL(document.location);
    let directory = url.searchParams.get('directory');
    let formData = new FormData();
    formData.append('folderName', input.value);
    formData.append('js', true);
    if (directory != null) {
        formData.append('directory', directory);
    }
    new Promise(async (resolve, reject) => {
        fetch(PATH + 'files/create_folder', {
            method: 'POST',
            body: formData
        }).then(res => res.json())
            .then(res => {
                res['error'] === false ? resolve(res) : reject(res);
            })
    }).then(res => {
        addFiles(checkLastNumberFile(), res['fileInfo'], res);
        form.style.display = 'none';
        overlay.style.display = 'none';
        input.value = '';
    }).catch(res => {
        input.style.backgroundColor = '#f1aeb5';
        setTimeout(() => {
            input.style.backgroundColor = '#fff';
        }, 2000);
        alert(res);
        throw new Error(res)
    })
}

// Добавление нового файла в список файлов
function addFile(form, overlay) {
    let url = new URL(document.location);
    let directory = url.searchParams.get('directory');
    let formData = new FormData(form);
    formData.append('js', true);
    if (directory != null) {
        formData.append('directory', directory);
    }
    new Promise((resolve, reject) => {
        fetch(PATH + 'files/add_file', {
            method: 'POST',
            body: formData
        }).then(res => res.json())
            .then(res => {
                res['error'] === false ? resolve(res) : reject(res);
            })
    })
        .then(res => {
            addFiles(checkLastNumberFile(), res['fileInfo'], res);
            form.style.display = 'none';
            overlay.style.display = 'none';
        }).catch(res => {
            alert(res);
            throw new Error(res);
        })
}

//Создание нового файла
function addFiles(fileNumber, file, arrayFiles) {
    let tr = document.createElement('tr');
    let tdNumber = document.createElement('td');
    let tdFileName = document.createElement('td');
    let tdActions = document.createElement('td');
    let divFileName = document.createElement('div');
    let spanSvgFileName = document.createElement('span');
    let spanNameFileName = document.createElement('span');
    let actionsContainer = document.createElement('div');
    let downloadLink = document.createElement('a');
    let btnRename = document.createElement('button');
    let btnInfo = document.createElement('button');
    let btnAccessControl = document.createElement('button');
    let btnDelete = document.createElement('button');
    let fileTypeSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let downloadSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let renameSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let infoSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let accessControlSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let deleteSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    tr.classList.add('tbody__tr');
    tdNumber.classList.add('tbody__td');
    tdFileName.classList.add('tbody__td');
    divFileName.classList.add("tbody__file-name", "file-name");
    spanSvgFileName.classList.add("file-name__svg");
    spanNameFileName.classList.add("file-name__name");
    tdActions.classList.add('tbody__td');
    actionsContainer.classList.add('files__actions');
    downloadLink.classList.add('files__actions-element', 'download-file', 'btn')
    btnRename.classList.add('files__actions-element', 'rename-file', 'btn');
    btnInfo.classList.add('files__actions-element', 'info-file', 'btn');
    btnAccessControl.classList.add('files__actions-element', 'access-control', 'btn');
    btnDelete.classList.add('files__actions-element', 'delete-file', 'btn');

    fileTypeSVG.setAttributeNS(null, 'width', '20px');
    fileTypeSVG.setAttributeNS(null, 'height', '20px');
    switch (file['type']) {
        case 'music':
            fileTypeSVG.setAttributeNS(null, 'viewBox', '0 0 496.2 496.2');
            fileTypeSVG.innerHTML = `<path style='fill:#32BEA6;' d='M496.2,248.1C496.2,111.1,385.1,0,248.1,0S0,111.1,0,248.1s111.1,248.1,248.1,248.1 S496.2,385.1,496.2,248.1z'></path><path style='fill:#3A3A38;' d='M344.8,209.8c-2.3-9-6.9-17.7-13.2-25.3c-6-7.3-13-13.1-19.6-18.4l-1.6-1.3c-2.8-2.2-5.4-4.3-7.8-6.5 c-2.6-2.3-5.4-5-8.2-8.1c-5-5.5-9.8-11.8-14.2-18.6c-2.1-3.3-4.1-6.7-6-10.2c-0.9-1.7-1.8-3.5-2.7-5.2c-1-2-1.7-3.7-2.3-5v-0.1 c-0.1-0.2-0.2-0.4-0.2-0.5c-2-4.2-6.4-6.7-11-6.3c-1.4,0.1-2.7,0.5-3.9,1.1c-2.7,1.3-4.7,3.5-5.7,6.4c-0.3,0.8-0.5,1.7-0.6,2.6 c-0.2,0.9-0.4,1.8-0.3,2.8L261.9,295c-14.7-8.7-36.1-10.1-56.8-2.1c-31.2,12.2-49,41.1-39.8,64.7s41.9,32.9,73.1,20.7 c26.4-10.3,43.3-32.7,42.2-53.7l0,0l-14.2-176.5c4.5,5.7,9.1,11,14,15.8c3.5,3.4,6.9,6.4,10.2,9c2.9,2.3,5.9,4.4,8.7,6.4l1.8,1.3 c6.2,4.4,12.7,9.2,18,15c5.2,5.5,8.9,11.7,11,18.5c2.1,6.5,2.9,14,2.5,22.2c-0.4,7.2-1.7,14.8-4,23.4c-2,7.3-4.5,14.9-7.9,23.2 c-1.1,2.8,0.2,6,3,7.2c0.9,0.4,1.8,0.5,2.7,0.4c1.9-0.2,3.7-1.3,4.6-3.2c4-8.5,7.1-16.3,9.7-24c3-9.3,5-17.8,5.9-25.9 C347.5,227.5,347,218.2,344.8,209.8z'></path>`;
            tr.dataset.type = file['type'];
            break;
        case 'img':
            fileTypeSVG.setAttributeNS(null, 'viewBox', '0 0 64 64');
            fileTypeSVG.innerHTML = `<g id='photos_android_app_aplication_phone' data-name='photos android app aplication phone'><path d='m60.11 16.636a14.539 14.539 0 0 0 -12.741-12.736 132.374 132.374 0 0 0 -30.73 0 14.537 14.537 0 0 0 -12.739 12.736 132.247 132.247 0 0 0 0 30.728c.01.091.031.179.043.269l19.775-19.776 6.214 6.214 10.358-10.357 20.174 20.174a132.135 132.135 0 0 0 -.354-27.252zm-43.103 4.364a4 4 0 1 1 4-4 4 4 0 0 1 -4 4z' fill='#4370ff'></path><path d='m47.14 5.879a12.477 12.477 0 0 1 10.989 10.986 130.928 130.928 0 0 1 .86 17.058l3.884 3.884a134.7 134.7 0 0 0 -.773-21.407 16.462 16.462 0 0 0 -14.5-14.5 134.86 134.86 0 0 0 -31.2 0 16.462 16.462 0 0 0 -14.5 14.5 134.869 134.869 0 0 0 0 31.2 16.535 16.535 0 0 0 14.5 14.5 134.841 134.841 0 0 0 15.6.9 134.836 134.836 0 0 0 15.6-.9 16.462 16.462 0 0 0 14.5-14.5c.3-2.6.424-4.363.433-4.472l-10.825-10.828-10-10a2 2 0 0 0 -2.828 0l-8.945 8.944-4.8-4.8a2 2 0 0 0 -2.829 0l-16.821 16.811a130.84 130.84 0 0 1 .394-26.39 12.476 12.476 0 0 1 10.988-10.986 130.907 130.907 0 0 1 30.273 0zm-23.424 24.806 4.8 4.8a2 2 0 0 0 2.829 0l8.945-8.945 18.093 18.09c-.08.835-.158 1.669-.255 2.5a12.477 12.477 0 0 1 -10.988 10.991 130.877 130.877 0 0 1 -30.273 0 12.505 12.505 0 0 1 -10.781-9.809z'></path><path d='m11.007 17a6 6 0 1 0 6-6 6.007 6.007 0 0 0 -6 6zm8 0a2 2 0 1 1 -2-2 2 2 0 0 1 2 2z'></path></g>`;
            tr.dataset.type = file['type'];
            break;
        case 'video':
            fileTypeSVG.setAttributeNS(null, 'viewBox', '0 0 512 512');
            fileTypeSVG.innerHTML = `<path d='m0 96v384c0 17.679688 14.320312 32 32 32h448c17.679688 0 32-14.320312 32-32v-384zm0 0' fill='#e1eaf7'></path><path d='m0 0h512v128h-512zm0 0' fill='#b0bec5'></path><path d='m64 48h32v32h-32zm0 0' fill='#fff'></path><path d='m128 48h32v32h-32zm0 0' fill='#fff'></path><path d='m432 80h-224c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h224c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0' fill='#90a4ae'></path><path d='m208 378v-180l144 90zm0 0' fill='#e76e54'></path><path d='m432 448h-240v-32h240c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0' fill='#c1cee3'></path><path d='m144 480c-8.832031 0-16-7.167969-16-16v-64c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v64c0 8.832031-7.167969 16-16 16zm0 0' fill='#ffcb5a'></path><path d='m64 416h32v32h-32zm0 0' fill='#c1cee3'></path>`;
            tr.dataset.type = file['type'];
            break;
        case 'folder':
            fileTypeSVG.setAttributeNS(null, 'viewBox', '0 0 512 512');
            fileTypeSVG.innerHTML = `<path style='fill:#FF9F00;' d='M512,100.949c0-8.275-6.702-14.987-14.978-15l-207.307-0.315l-50.011-49.2 C236.901,33.683,233.13,32,229.201,32H90.522C52.269,32,21,63.406,21,101.659v327.375h491V100.949z'></path><g><path style='fill:#FFD154;' d='M265.027,61.346l-25.322-24.912C236.901,33.683,233.13,32,229.201,32H90.522 C52.269,32,21,63.406,21,101.659v327.375h251.492V68.689L265.027,61.346z'></path><path style='fill:#FFD154;' d='M497.021,167.321l-245.332-0.334l-53.266-64.501C195.574,99.038,191.334,97,186.86,97H72.756 C32.638,97,0,129.721,0,169.839v294.877C0,473,6.716,480,15,480h482c8.284,0,15-7,15-15.284V182.321 C512,174.045,505.297,167.333,497.021,167.321z'></path></g><path style='fill:#FFDF8E;' d='M272.492,167.015l-20.803-0.028l-53.266-64.501C195.574,99.038,191.334,97,186.86,97H72.756 C32.638,97,0,129.721,0,169.839v294.877C0,473,6.716,480,15,480h257.492V167.015z'></path><g><path style='fill:#FF9F00;' d='M231.198,326H84.806c-8.284,0-15,6.716-15,15s6.716,15,15,15h146.393c8.284,0,15-6.716,15-15 S239.482,326,231.198,326z'></path><path style='fill:#FF9F00;' d='M193.152,380H84.806c-8.284,0-15,6.716-15,15s6.716,15,15,15h108.347c8.284,0,15-6.716,15-15 S201.437,380,193.152,380z'></path></g><path style='fill:#383838;' d='M425.286,358.309c-1.386-5.34-5.663-13.266-25.712-20.416c-3.146-1.122-7.959-2.587-13.635-3.855 c8.681-7.075,14.062-17.844,14.062-29.89v-8.105c0-21.259-17.204-38.554-38.539-38.554c-21.258,0-38.461,17.295-38.461,38.554v8.105 c0,12.046,5.582,22.815,14.262,29.89c-5.677,1.268-10.301,2.733-13.448,3.855c-20.049,7.15-24.079,15.076-25.464,20.416 c-0.319,1.231-0.35,2.497-0.35,3.769v39.673c0,8.284,6.466,15.25,14.75,15.25h97.784c8.284,0,15.466-6.966,15.466-15.25v-39.673 C426,360.806,425.605,359.54,425.286,358.309z'></path><path style='fill:#7C8388;' d='M361.461,257.488c-21.258,0-38.461,17.295-38.461,38.554v8.105c0,12.046,5.582,22.815,14.262,29.89 c-5.677,1.268-10.301,2.733-13.448,3.855c-20.049,7.15-24.079,15.076-25.464,20.416c-0.319,1.231-0.35,2.497-0.35,3.769v39.673 c0,8.284,6.466,15.25,14.75,15.25H362L361.461,257.488z'></path>`;
            tr.dataset.type = file['type'];
            break;
        case 'document':
            fileTypeSVG.setAttributeNS(null, 'viewBox', '0 0 508 508');
            fileTypeSVG.innerHTML = `<circle style='fill:#FFD05B;' cx='254' cy='254' r='254'></circle><path style='fill:#FFFFFF;' d='M193.2,89.8v53.7c0,5.8-4.7,10.5-10.5,10.5H129v253.9c0,5.8,4.7,10.5,10.5,10.5h229 c5.8,0,10.5-4.7,10.5-10.5V100.2c0-5.8-4.7-10.5-10.5-10.5H193.2V89.8z'></path><path style='fill:#E6E9EE;' d='M193.2,89.8L129,153.9h53.7c5.8,0,10.5-4.7,10.5-10.5V89.8z'></path><g><path style='fill:#84DBFF;' d='M183.1,189.5h12.6v31.1H189v-25.2h-5.9V189.5z'></path><path style='fill:#84DBFF;' d='M214.9,221c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7s1.1-8.8,3.2-11.7c2.1-2.9,5.3-4.4,9.6-4.4 s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7s-1.1,8.8-3.2,11.7C222.4,219.5,219.2,221,214.9,221z M210.4,197.4c-1,1.9-1.5,4.4-1.5,7.5 s0.5,5.6,1.5,7.5s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8c1-1.9,1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5s-2.5-2.8-4.6-2.8 C212.9,194.6,211.3,195.5,210.4,197.4z'></path><path style='fill:#84DBFF;' d='M231.6,189.5h12.6v31.1h-6.7v-25.2h-5.9L231.6,189.5L231.6,189.5z'></path><path style='fill:#84DBFF;' d='M263.5,221c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7s1.1-8.8,3.2-11.7c2.1-2.9,5.3-4.4,9.6-4.4 s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7s-1.1,8.8-3.2,11.7S267.8,221,263.5,221z M258.9,197.4c-1,1.9-1.5,4.4-1.5,7.5s0.5,5.6,1.5,7.5 s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8c1-1.9,1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5s-2.5-2.8-4.6-2.8C261.4,194.6,259.9,195.5,258.9,197.4z'></path><path style='fill:#84DBFF;' d='M280.2,189.5h12.6v31.1h-6.7v-25.2h-5.9V189.5z'></path><path style='fill:#84DBFF;' d='M312.1,221c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7s1.1-8.8,3.2-11.7s5.3-4.4,9.6-4.4 s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7s-1.1,8.8-3.2,11.7S316.4,221,312.1,221z M307.5,197.4c-1,1.9-1.5,4.4-1.5,7.5s0.5,5.6,1.5,7.5 s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8c1-1.9,1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5s-2.5-2.8-4.6-2.8C310,194.6,308.5,195.5,307.5,197.4z'></path><path style='fill:#84DBFF;' d='M183.1,242.9h12.6V274H189v-25.2h-5.9V242.9z'></path><path style='fill:#84DBFF;' d='M214.9,274.3c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7c0-4.9,1.1-8.8,3.2-11.7 c2.1-2.9,5.3-4.4,9.6-4.4s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7s-1.1,8.8-3.2,11.7C222.4,272.8,219.2,274.3,214.9,274.3z M210.4,250.7 c-1,1.9-1.5,4.4-1.5,7.5s0.5,5.6,1.5,7.5s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8s1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5s-2.5-2.8-4.6-2.8 C212.9,247.9,211.3,248.8,210.4,250.7z'></path><path style='fill:#84DBFF;' d='M231.6,242.9h12.6V274h-6.7v-25.2h-5.9L231.6,242.9L231.6,242.9z'></path><path style='fill:#84DBFF;' d='M263.5,274.3c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7c0-4.9,1.1-8.8,3.2-11.7 c2.1-2.9,5.3-4.4,9.6-4.4s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7s-1.1,8.8-3.2,11.7C271,272.8,267.8,274.3,263.5,274.3z M258.9,250.7 c-1,1.9-1.5,4.4-1.5,7.5s0.5,5.6,1.5,7.5s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8s1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5s-2.5-2.8-4.6-2.8 C261.4,247.9,259.9,248.8,258.9,250.7z'></path><path style='fill:#84DBFF;' d='M280.2,242.9h12.6V274h-6.7v-25.2h-5.9V242.9z'></path><path style='fill:#84DBFF;' d='M312.1,274.3c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7c0-4.9,1.1-8.8,3.2-11.7s5.3-4.4,9.6-4.4 s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7s-1.1,8.8-3.2,11.7C319.6,272.8,316.4,274.3,312.1,274.3z M307.5,250.7c-1,1.9-1.5,4.4-1.5,7.5 s0.5,5.6,1.5,7.5s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8s1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5s-2.5-2.8-4.6-2.8 C310,247.9,308.5,248.8,307.5,250.7z'></path><path style='fill:#84DBFF;' d='M183.1,296.2h12.6v31.1H189v-25.2h-5.9V296.2z'></path><path style='fill:#84DBFF;' d='M214.9,327.6c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7c0-4.9,1.1-8.8,3.2-11.7 c2.1-2.9,5.3-4.4,9.6-4.4s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7c0,4.9-1.1,8.8-3.2,11.7C222.4,326.2,219.2,327.6,214.9,327.6z M210.4,304.1c-1,1.9-1.5,4.4-1.5,7.5s0.5,5.6,1.5,7.5s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8s1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5 s-2.5-2.8-4.6-2.8C212.9,301.2,211.3,302.2,210.4,304.1z'></path><path style='fill:#84DBFF;' d='M231.6,296.2h12.6v31.1h-6.7v-25.2h-5.9L231.6,296.2L231.6,296.2z'></path><path style='fill:#84DBFF;' d='M263.5,327.6c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7c0-4.9,1.1-8.8,3.2-11.7 c2.1-2.9,5.3-4.4,9.6-4.4s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7c0,4.9-1.1,8.8-3.2,11.7C271,326.2,267.8,327.6,263.5,327.6z M258.9,304.1c-1,1.9-1.5,4.4-1.5,7.5s0.5,5.6,1.5,7.5s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8s1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5 s-2.5-2.8-4.6-2.8C261.4,301.2,259.9,302.2,258.9,304.1z'></path><path style='fill:#84DBFF;' d='M280.2,296.2h12.6v31.1h-6.7v-25.2h-5.9V296.2z'></path><path style='fill:#84DBFF;' d='M312.1,327.6c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7c0-4.9,1.1-8.8,3.2-11.7 c2.1-2.9,5.3-4.4,9.6-4.4s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7c0,4.9-1.1,8.8-3.2,11.7C319.6,326.2,316.4,327.6,312.1,327.6z M307.5,304.1c-1,1.9-1.5,4.4-1.5,7.5s0.5,5.6,1.5,7.5s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8s1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5 s-2.5-2.8-4.6-2.8C310,301.2,308.5,302.2,307.5,304.1z'></path></g>`;
            tr.dataset.type = file['type'];
            break;
    }
    downloadSVG.setAttributeNS(null, 'viewBox', '0 0 473.677 473.67');
    downloadSVG.setAttributeNS(null, 'width', '20px');
    downloadSVG.setAttributeNS(null, 'height', "20px");
    renameSVG.setAttributeNS(null, 'viewBox', "0 0 512 512");
    renameSVG.setAttributeNS(null, 'width', "20px");
    renameSVG.setAttributeNS(null, 'height', "20px");
    infoSVG.setAttributeNS(null, 'viewBox', "0 0 512 512");
    infoSVG.setAttributeNS(null, 'width', "20px");
    infoSVG.setAttributeNS(null, 'height', "20px");
    accessControlSVG.setAttributeNS(null, 'viewBox', "0 0 327.733 327.733");
    accessControlSVG.setAttributeNS(null, 'width', "20px");
    accessControlSVG.setAttributeNS(null, 'height', "20px");
    deleteSVG.setAttributeNS(null, 'viewBox', "0 0 511.999 511.999");
    deleteSVG.setAttributeNS(null, 'width', "20px");
    deleteSVG.setAttributeNS(null, 'height', "20px");

    if (file['type'] != 'folder') {
        downloadLink.title = 'Скачать';
        downloadLink.href = (arrayFiles['fullPath'] + '/' + file['fileName']).replace(/\/\//, '/');
        downloadLink.download = '';
    }
    btnRename.title = "Переименовать";
    btnInfo.title = "Информация о файле";
    btnAccessControl.title = "Управление доступом";
    btnDelete.title = "Удалить";
    tdNumber.textContent = fileNumber;
    spanNameFileName.textContent = file['fileName'] ?? file['folderName'];
    downloadSVG.innerHTML = `<path style="fill:#4ABC96;" d="M0,236.842C0,106.024,106.036,0,236.835,0c130.807,0,236.842,106.024,236.842,236.842 c0,130.792-106.036,236.835-236.842,236.835C106.036,473.677,0,367.634,0,236.842z"></path>
                    <g>
                        <path style="fill:#FFFFFF;" d="M347.915,281.983c0,14.076,0,28.148,0,42.227c-71.673,0-143.349,0-215.018,0 c0-14.008,0-28.017,0-42.025c0-18.111-28.054-18.272-28.054-0.202c0,18.717,0,37.433,0,56.153c0,3.867,1.324,6.866,3.339,9.095 c2.229,2.969,5.722,5.033,10.587,5.033c81.025,0,162.051,0,243.072,0c3.867,0,6.866-1.324,9.095-3.339 c2.973-2.229,5.037-5.725,5.037-10.59c0-18.717,0-37.433,0-56.153C375.969,264.074,347.915,263.913,347.915,281.983z"></path>
                        <path style="fill:#FFFFFF;" d="M303.279,187.027c-15.4,0-30.795,0-46.195,0c0-23.32,0-46.64,0-69.956 c0-27.168-42.078-27.407-42.078-0.303c0,23.421,0,46.838,0,70.259c-14.798,0-29.595,0-44.392,0 c-0.273,0.004-0.542,0.03-0.808,0.071c-2.902,0.251-4.783,1.993-5.621,4.196c-1.088,2.184-1.062,4.85,0.856,7.161 c0.217,0.299,0.46,0.572,0.725,0.83c22.056,22.041,44.101,44.09,66.149,66.134c2.715,2.711,7.229,2.64,9.917-0.052 c22.127-22.131,44.25-44.262,66.377-66.392C312.494,194.693,309.345,187.027,303.279,187.027z"></path>
                    </g>`;
    renameSVG.innerHTML = `<path style="fill:#F0F2FF;" d="M395.885,504.5H156.164c-47.427,0-85.873-38.447-85.873-85.873V178.907 c0-25.309,20.517-45.827,45.827-45.827h279.768c25.309,0,45.827,20.517,45.827,45.827v279.768 C441.712,483.984,421.194,504.5,395.885,504.5z"></path>
                    <path style="fill:#DBE1FF;" d="M395.885,504.5c24.987,0,45.288-20.001,45.802-44.865C270.401,458.744,165.55,339.07,217.01,133.08 H116.117c-25.309,0-45.827,20.517-45.827,45.827v239.721c0,47.427,38.447,85.873,85.873,85.873L395.885,504.5L395.885,504.5z"></path>
                    <path style="fill:#7F9AE6;" d="M237.815,363.272l20.967,66.265c6.812,21.528,35.023,26.503,48.787,8.602l42.366-55.097 c6.962-9.054,11.633-19.655,13.616-30.902l44.698-253.492L280.286,76.086l-44.698,253.491 C233.606,340.823,234.37,352.383,237.815,363.272z"></path>
                    <path style="fill:#BBE0F1;" d="M234.558,340.457c-0.156,7.709,0.916,15.417,3.257,22.815l20.967,66.265 c6.812,21.528,35.023,26.503,48.787,8.602l42.366-55.097c4.73-6.151,8.373-13.028,10.863-20.325L234.558,340.457z"></path>
                    <path style="opacity:0.2;fill:#254A74;enable-background:new ;" d="M349.973,382.988 c-59.985-43.632-48.783-198.289-33.977-300.605l-35.71-6.297l-44.698,253.491c-1.983,11.247-1.22,22.807,2.225,33.696l20.967,66.265 c6.812,21.528,35.023,26.503,48.787,8.602l42.366-55.097C349.948,383.024,349.96,383.005,349.973,382.988z"></path>
                    <path style="fill:#495059;" d="M249.994,401.764l8.787,27.772c6.812,21.528,35.023,26.503,48.787,8.602l17.756-23.092 L249.994,401.764z"></path>
                    <rect x="274.592" y="86.938" transform="matrix(-0.9848 -0.1736 0.1736 -0.9848 654.1611 285.3716)" style="fill:#F8E47C;" width="129.937" height="54.279"></rect>
                    <path style="fill:#E38892;" d="M408.247,98.648L280.286,76.086l8.487-48.13c2.373-13.458,15.206-22.444,28.664-20.071l79.226,13.97 c13.458,2.373,22.444,15.206,20.071,28.664L408.247,98.648z"></path>
                    <path style="fill:#909DE0;" d="M156.164,504.5c-47.427,0-85.873-38.447-85.873-85.873V390.63c0,13.173,8.169,36.254,31.791,36.254 c25.309,0,45.827,20.517,45.827,45.827c0,23.622,23.081,31.791,36.254,31.791L156.164,504.5L156.164,504.5z"></path>
                    <path style="opacity:0.15;fill:#C97B00;enable-background:new ;" d="M315.996,82.382l-35.71-6.297l-9.425,53.452l38.43,6.776 C311.23,117.406,313.564,99.188,315.996,82.382z"></path>
                    <path style="opacity:0.15;fill:#812B2F;enable-background:new ;" d="M328.283,9.798l-10.846-1.912 c-13.458-2.373-26.291,6.613-28.664,20.071l-8.487,48.13l35.71,6.297C320.355,52.257,325.025,26.675,328.283,9.798z"></path>
                    <path d="M410.739,127.703l4.893-27.749c0-0.001,0-0.002,0.001-0.003c0-0.001,0-0.002,0-0.003l8.486-48.127 c1.496-8.481-0.4-17.038-5.341-24.093c-4.939-7.056-12.331-11.765-20.813-13.26L318.74,0.499 c-8.481-1.498-17.038,0.401-24.094,5.341c-7.055,4.94-11.764,12.332-13.259,20.813l-17.444,98.927H116.117 c-29.404,0-53.326,23.922-53.326,53.325v46.542c0,4.143,3.358,7.5,7.5,7.5c4.142,0,7.5-3.357,7.5-7.5v-46.542 c0-21.133,17.193-38.326,38.327-38.326h145.182l-33.096,187.693c-2.184,12.385-1.333,25.27,2.461,37.261l12.205,38.576 c0.005,0.015,0.009,0.031,0.014,0.046l8.747,27.644c3.997,12.633,14.586,21.909,27.635,24.211c2.074,0.365,4.15,0.544,6.206,0.544 c10.886,0,21.249-5.009,28.042-13.844l42.366-55.097c7.666-9.97,12.873-21.786,15.057-34.172l35.27-200.028 c0.001-0.003,0.002-0.006,0.002-0.01c0-0.003,0-0.006,0.001-0.009l1.905-10.804c15.28,5.155,26.098,19.685,26.098,36.316v279.768 c0,21.134-17.193,38.327-38.327,38.327h-19.91c-4.143,0-7.5,3.357-7.5,7.5c0,4.143,3.357,7.5,7.5,7.5h19.91 c29.404,0,53.326-23.923,53.326-53.326V178.906C449.212,154.996,433.133,134.207,410.739,127.703z M301.623,433.568 c-4.728,6.148-12.109,9.015-19.753,7.67c-7.64-1.348-13.598-6.567-15.938-13.964l-5.054-15.975l50.959,8.985L301.623,433.568z M343.989,378.47l-21.84,28.403l-66.375-11.703l-10.809-34.161c-1.19-3.76-2.017-7.629-2.486-11.541l107.794,19.007 C348.493,371.991,346.393,375.344,343.989,378.47z M356.165,350.836c-0.197,1.116-0.429,2.224-0.685,3.327l-112.998-19.925 c0.136-1.123,0.297-2.244,0.494-3.359l33.97-192.654l113.189,19.959L356.165,350.836z M392.738,143.413L279.55,123.454l6.821-38.682 l113.188,19.959L392.738,143.413z M409.347,49.216l-7.184,40.745L288.975,70.002l7.184-40.743c0.8-4.536,3.318-8.489,7.092-11.132 c2.932-2.053,6.348-3.123,9.854-3.123c1.006,0,2.02,0.089,3.03,0.267l79.226,13.97c4.536,0.8,8.489,3.318,11.131,7.092 C409.132,40.105,410.147,44.681,409.347,49.216z M340.915,497H184.161c-7.46,0-28.754-4.463-28.754-24.291 c0-29.404-23.922-53.325-53.326-53.325c-19.828,0-24.29-21.294-24.29-28.754V260.094c0-4.143-3.358-7.5-7.5-7.5 c-4.142,0-7.5,3.357-7.5,7.5v158.533c0,51.486,41.887,93.373,93.372,93.373h184.751c4.143,0,7.5-3.357,7.5-7.5 C348.415,500.358,345.057,497,340.915,497z M78.136,425.839c6.534,5.611,14.651,8.545,23.945,8.545 c21.133,0,38.327,17.193,38.327,38.326c0,9.295,2.934,17.412,8.545,23.946C111.483,493.219,81.572,463.309,78.136,425.839z"></path>`;
    infoSVG.innerHTML = `<path style="fill:#1689FC;" d="M497,45v422c0,16.5-13.5,30-30,30H45c-16.5,0-30-13.5-30-30V45c0-16.5,13.5-30,30-30h422 C483.5,15,497,28.5,497,45z"></path>
                    <path style="fill:#136EF1;" d="M497,45v422c0,16.5-13.5,30-30,30H256V15h211C483.5,15,497,28.5,497,45z"></path>
                    <g>
                        <path style="fill:#CAE8F9;" d="M256,91c-24.901,0-45,20.099-45,45c0,24.899,20.099,45,45,45s45-20.101,45-45 C301,111.099,280.901,91,256,91z"></path>
                        <path style="fill:#CAE8F9;" d="M316,391h-15V226c0-8.401-6.599-15-15-15h-70.201c0,0-3.3,0-19.799,0c-8.401,0-15,6.599-15,15 c0,8.399,6.599,15,15,15h15v150h-15c-8.401,0-15,6.599-15,15c0,8.399,6.599,15,15,15h120c8.401,0,15-6.601,15-15 C331,397.599,324.401,391,316,391z"></path>
                    </g>
                    <path style="fill:#57555C;" d="M467,0H45C20.099,0,0,20.099,0,45v422c0,24.899,20.099,45,45,45h422c24.901,0,45-20.101,45-45V45 C512,20.099,491.901,0,467,0z M482,467c0,8.399-6.599,15-15,15H45c-8.401,0-15-6.601-15-15V45c0-8.401,6.599-15,15-15h422 c8.401,0,15,6.599,15,15V467z"></path>
                    <path style="fill:#3C3A41;" d="M512,45v422c0,24.899-20.099,45-45,45H256v-30h211c8.401,0,15-6.601,15-15V45c0-8.401-6.599-15-15-15 H256V0h211C491.901,0,512,20.099,512,45z"></path>
                    <g>
                        <path style="fill:#B7E0F6;" d="M256,181V91c24.901,0,45,20.099,45,45C301,160.899,280.901,181,256,181z"></path>
                        <path style="fill:#B7E0F6;" d="M331,406c0,8.399-6.599,15-15,15h-60V211h30c8.401,0,15,6.599,15,15v165h15 C324.401,391,331,397.599,331,406z"></path>
                    </g>`;
    accessControlSVG.innerHTML = `<g>
                        <circle style="fill:#61B4E4;" cx="272.458" cy="60.11" r="47.774" />
                        <circle style="fill:#61B4E4;" cx="272.458" cy="267.622" r="47.774" />
                        <circle style="fill:#005CB9;" cx="92.745" cy="163.866" r="85.245" />
                        <path style="fill:#071C2C;" d="M272.458,212.35c-17.728,0-33.521,8.398-43.643,21.415l-52.272-30.179 c5.733-12.047,8.948-25.515,8.948-39.72c0-14.206-3.214-27.674-8.948-39.721l52.272-30.178 c10.121,13.017,25.915,21.415,43.643,21.415c30.479,0,55.275-24.795,55.275-55.272S302.936,4.837,272.458,4.837 s-55.274,24.796-55.274,55.273c0,7.387,1.467,14.434,4.108,20.88l-52.272,30.179c-16.757-24.179-44.695-40.048-76.275-40.048 C41.605,71.121,0,112.727,0,163.866s41.605,92.745,92.744,92.745c31.581,0,59.52-15.87,76.276-40.049l52.272,30.179 c-2.641,6.447-4.108,13.494-4.108,20.881c0,30.478,24.796,55.273,55.274,55.273c30.479,0,55.275-24.796,55.275-55.273 S302.936,212.35,272.458,212.35z M272.458,19.837c22.208,0,40.275,18.066,40.275,40.273c0,22.206-18.067,40.272-40.275,40.272 c-22.207,0-40.274-18.066-40.274-40.272C232.184,37.903,250.25,19.837,272.458,19.837z M92.744,241.611 C49.876,241.611,15,206.735,15,163.866s34.876-77.745,77.744-77.745c42.869,0,77.746,34.876,77.746,77.745 S135.613,241.611,92.744,241.611z M272.458,307.896c-22.207,0-40.274-18.066-40.274-40.273c0-22.206,18.067-40.272,40.274-40.272 c22.208,0,40.275,18.066,40.275,40.272C312.732,289.829,294.665,307.896,272.458,307.896z" />
                    </g>`;
    deleteSVG.innerHTML = `<circle style="fill:#E21B1B;" cx="255.999" cy="255.999" r="255.999" />
                    <g>
                        <rect x="244.002" y="120.008" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -106.0397 256.0022)" style="fill:#FFFFFF;" width="24" height="271.988" />
                        <rect x="120.008" y="244.007" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -106.0428 256.0035)" style="fill:#FFFFFF;" width="271.988" height="24" />
                    </g>`;
    let tbody = document.querySelector('.files__tbody');
    tbody.append(tr);
    tr.append(tdNumber);
    tr.append(tdFileName);
    tr.append(tdActions);
    tdFileName.append(divFileName);
    divFileName.append(spanSvgFileName);
    divFileName.append(spanNameFileName);
    spanSvgFileName.append(fileTypeSVG);
    actionsContainer.append(downloadLink);
    actionsContainer.append(btnRename);
    actionsContainer.append(btnInfo);
    actionsContainer.append(btnAccessControl);
    actionsContainer.append(btnDelete);
    tdActions.append(actionsContainer);
    downloadLink.append(downloadSVG);
    btnRename.append(renameSVG);
    btnInfo.append(infoSVG);
    btnAccessControl.append(accessControlSVG);
    btnDelete.append(deleteSVG);

    btnDelete.addEventListener('click', deleteFile);
    tr.addEventListener('dblclick', openFolder);
    btnInfo.addEventListener('click', getInfoFile);
    let formWorkingFolders = document.querySelector('.working-folders');
    let overlay = document.querySelector('.overlay');
    btnRename.addEventListener('click', () => {
        openFormRenameFile(btnRename, formWorkingFolders, overlay);
    })
    let windowAccess = document.querySelector('.access-control-container');
    btnAccessControl.addEventListener('click', () => {
        openFormAccessConrol(btnAccessControl, windowAccess);
    })
}

// Выгрузка файлов при нажатии на пользователя (для admin)
function getFilesUserOnClick() {
    let usersTbody = document.querySelector('.users__tbody');
    let usersTr = usersTbody.querySelectorAll('.tbody__tr');
    let filesTbody = document.querySelector('.files__tbody');
    if (usersTr.length < 1) return;
    usersTr.forEach((tr) => {
        tr.addEventListener('click', (event) => {
            if (event.target.classList.contains('users__actions-element')) return;
            new Promise((resolve, reject) => {
                fetch(PATH + 'files/list?id=' + tr.id + '&outputType=echo')
                    .then(res => res.json())
                    .then(res => {
                        res['error'] === false ? resolve(res) : reject(res);
                    })
            }).then(res => {
                let filesTr = filesTbody.querySelectorAll('.tbody__tr');
                filesTr.forEach((tr) => {
                    tr.remove();
                })
                tr.classList.add('focus-users');
                for (let file in res['fileList']) {
                    addFiles(checkLastNumberFile(), res['fileList'][file], res);
                }
            }).catch(res => {
                alert('Файлы не найдены');
            })
        })
    })
}

// Удаление файла
function deleteFile() {
    let tr = this.closest('tr');
    let fileName = tr.querySelector('.file-name__name').textContent;
    if (tr.dataset.type === 'folder') {
        if (!confirm(`Удалить папку '${fileName}' со всем содержимым?`)) return;
    } else {
        if (!confirm(`Удалить файл ${fileName}?`)) return;
    }
    let url = new URL(document.location);
    let directory = url.searchParams.get('directory');
    let formData = new FormData();
    if (directory != null) {
        formData.append('directory', directory);
    }
    formData.append('fileName', fileName);
    new Promise((resolve, reject) => {
        fetch(PATH + 'files/delete_file', {
            method: 'POST',
            body: formData
        }).then(res => res.json())
            .then(res => {
                res['error'] === false ? resolve() : reject(res['message']);
            })
    }).then(() => {
        tr.remove();
        alert('Файл удален');
    }).catch(() => {
        alert(res);
    })
}

// Открыть выбранную папку
function openFolder() {
    if (this.dataset.type != 'folder') return;
    let folderName = this.querySelector('.file-name__name').textContent;
    let url = new URL(document.location);
    let directory = url.searchParams.get('directory');
    if (directory === null) {
        directory = '';
    } else {
        directory = directory + '/';
    }
    let path = directory + folderName;
    let encodePath = encodeURI(path);
    new Promise((resolve, reject) => {
        fetch(`${PATH}files/list?directory=${encodePath}&outputType=echo`)
            .then(res => res.json())
            .then(res => {
                res['error'] === false ? resolve(res) : reject();
            })
    }).then(res => {
        let currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('directory', path);
        history.pushState({}, '', decodeURIComponent(currentUrl));
        let tbody = document.querySelector('.files__tbody');
        let tr = tbody.querySelectorAll('.tbody__tr');
        tr.forEach((tr) => {
            tr.remove();
        })
        res['fileList'].forEach((element) => {
            addFiles(checkLastNumberFile(), element, res)
        })
        let pathText = document.querySelector('.directory__path');
        pathText.textContent = res['directory'];
    }).catch(() => {
        alert('Не удалось открыть папку');
    })
}

// Выгрузка файлов по заданному пути
function getFiles(path) {
    new Promise((resolve, reject) => {
        fetch(`${PATH}files/list${path}&outputType=echo`)
            .then(res => res.json())
            .then(res => {
                res['error'] === false ? resolve(res) : reject();
            })
    }).then(res => {
        let tbody = document.querySelector('.files__tbody');
        let tr = tbody.querySelectorAll('.tbody__tr');
        tr.forEach((el) => {
            el.remove();
        })
        res['fileList'].forEach((file) => {
            addFiles(checkLastNumberFile(), file, res);
        })
        let pathText = document.querySelector('.directory__path');
        pathText.textContent = res['directory'];
    }).catch(() => {
        alert('Не удалось перейти в другой каталог');
    })
}

// Шаг назад в предедущую директорию
function stepBack() {
    let url = new URL(window.location);
    if (url.search.length === 0) {
        alert('Вы в корневой директории');
    } else {
        history.back();
    }
}

// Получить информацию о файле
function getInfoFile() {
    let tr = this.closest('tr');
    let fileName = tr.querySelector('.file-name__name').textContent;
    let url = new URL(document.location);
    let path = url.searchParams.get('directory');
    let formData = new FormData();
    formData.append('fileName', fileName);
    if (path != null) {
        formData.append('directory', path);
    }
    new Promise((resolve, reject) => {
        fetch(`${PATH}files/info_file`, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(res => {
                res['error'] === false ? resolve(res) : reject();
            })
    }).then(res => {
        let info = document.querySelector('.info');
        let name = info.querySelector('.info-name');
        let size = info.querySelector('.info-size');
        let extension = info.querySelector('.info-extension');
        let type = info.querySelector('.info-type');
        let date = info.querySelector('.info-date');
        let transformSize = Number(res['size']) / 1024;
        if (transformSize === 0) {
            size.textContent = transformSize + ' КБ';
        }
        else if (transformSize >= 1024) {
            let arraySize = (String(transformSize / 1024).split('.'));
            arraySize[1] = arraySize[1].slice(0, 2);
            size.textContent = arraySize.join('.') + ' МБ';
        } else {
            let arraySize = (String(transformSize).split('.'));            
            arraySize[1] = arraySize[1].slice(0, 2);
            size.textContent = arraySize.join('.') + ' КБ';
        }
        name.textContent = res['name'];
        extension.textContent = res['extension'];
        type.textContent = res['type'];
        date.textContent = res['modificationDate'];

        let infoWindow = document.querySelector('.info');
        let coordinates = this.getBoundingClientRect();

        infoWindow.style.top = coordinates.top;
        infoWindow.style.left = coordinates.left;
        infoWindow.style.display = 'block';

        let closeButton = infoWindow.querySelector('.info__close-btn');
        closeButton.addEventListener('click', () => {
            if (infoWindow.style.display != 'block') return;
            infoWindow.style.display = 'none';
        })
    })

}

// Изменить имя файла/папки
function renameFile(form, overlay) {
    let input = form.querySelector('.form__input');
    if (input.value.length == 0) return;
    let url = new URL(document.location);
    let path = url.searchParams.get('directory');
    let currentName = document.querySelector('.active-rename');
    let formData = new FormData();
    formData.append('newName', input.value);
    formData.append('currentName', currentName.textContent);
    if (path != null) {
        formData.append('directory', path);
    }
    new Promise((resolve, reject) => {
        fetch(`${PATH}files/rename_file`, {
            method: 'POST',
            body: formData
        }).then(res => res.json())
            .then(res => {
                res['error'] === false ? resolve(res) : reject(res['message']);
            })
    })
        .then(res => {
            let tr = currentName.closest('tr');
            let link = tr.querySelector('.download-file');
            link.href = res['newPath'];
            currentName.textContent = input.value + res['extension'];
            form.style.display = 'none';
            overlay.style.display = 'none';
        })
        .catch(res => {
            alert(res);
            form.style.display = 'none';
            overlay.style.display = 'none';
        })
    currentName.classList.remove('active-rename');
}

//Открытие формы для переименовывания файла или папки
function openFormRenameFile(btn, form, overlay) {
    let input = form.querySelector('.working-folders-input');
    let button = form.querySelector('.working-folders-btn');
    let tr = btn.closest('tr');
    let fileName = tr.querySelector('.file-name__name');
    fileName.classList.add('active-rename');
    let coordinates = btn.getBoundingClientRect();
    form.style.display = 'grid';
    form.style.top = coordinates.top;
    form.style.left = coordinates.left;
    form.dataset.type = 'rename';
    input.type = 'text';
    input.placeholder = 'Введите новое имя';
    input.name = 'newName';
    button.textContent = 'Переименовать';
    overlay.style.display = 'block';
}

// Открытие формы управления доступом
function openFormAccessConrol(btn, windowAccess) {
    let tr = btn.closest('tr');
    if (tr.dataset.type === 'folder') {
        alert('Управление доступом не доступно для папки');
        return;
    }
    let fileName = tr.querySelector('.file-name__name').textContent;
    let url = new URL(document.location);
    let path = url.searchParams.get('directory');
    path = path === null ? '' : path;
    new Promise((resolve, reject) => {
        fetch(`${PATH}files/access_control?getUsersList=true&fileName=${fileName}&&directory=${path}`)
            .then(res => res.json())
            .then(res => {
                res['error'] === false ? resolve(res['emailList']) : reject(res['message']);
            })
    })
        .then(res => {
            let tbody = document.querySelector('.access-table__tbody');
            if (res.length > 0) {
                res.forEach((email) => {
                    addUserInAccessControl(tbody, email);
                })
            }
            let windowFileName = windowAccess.querySelector('.access-control__file-name');
            windowFileName.textContent = fileName;
            windowAccess.style.display = 'grid';
        })
        .catch(res => {
            alert(res);
        })

}

// Закрытие формы управления доступом
function closeFormAccessControl(windowAccess) {
    let trList = windowAccess.querySelectorAll('.access-table__tbody-tr');
    let input = windowAccess.querySelector('.access-control__form-input');
    input.value = '';
    windowAccess.style.display = 'none';
    trList.forEach((tr) => {
        tr.remove();
    })
}

// Предоставление доступа к файлу
function grantAccessToFile(form) {
    let input = form.querySelector('.access-control__form-input');
    if (input.value.length == 0) {
        input.style.outline = '1px solid red';
        alert('Введите Email');
        return;
    }
    let fileName = document.querySelector('.access-control__file-name').textContent;
    let url = new URL(document.location);
    let path = url.searchParams.get('directory');
    let formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('email', input.value);
    if (path != null) {
        formData.append('directory', path);
    }
    new Promise((resolve, reject) => {
        fetch(`${PATH}files/access_control?provide_access=true`, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(res => {
                res['error'] === false ? resolve(res['message']) : reject([res['message']]);
            })
    })
        .then(res => {
            let tbody = document.querySelector('.access-table__tbody');
            addUserInAccessControl(tbody, input.value);
            input.value = '';
        })
        .catch(res => {
            alert(res);
        })
}

// Добавление пользователя в список предоставленых доступов
function addUserInAccessControl(container, email) {
    let tr = document.createElement('tr');
    let tdEmail = document.createElement('td');
    let tdActions = document.createElement('td');
    let deleteBtn = document.createElement('button');
    let closeBtnSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    tr.classList.add('access-table__tbody-tr');
    tdEmail.classList.add('access-table__td', 'access-table-email');
    tdActions.classList.add('access-table__td', 'access-table-actions');
    deleteBtn.classList.add('access-table__delete-btn', 'btn');

    tdEmail.textContent = email;
    closeBtnSVG.setAttributeNS(null, 'viewBox', '0 0 511.999 511.999');
    closeBtnSVG.setAttributeNS(null, 'width', '20px');
    closeBtnSVG.setAttributeNS(null, 'height', '20px');
    closeBtnSVG.innerHTML = `<circle style="fill:#E21B1B;" cx="255.999" cy="255.999" r="255.999" />
                            <g>
                                <rect x="244.002" y="120.008" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -106.0397 256.0022)" style="fill:#FFFFFF;" width="24" height="271.988" />
                                <rect x="120.008" y="244.007" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -106.0428 256.0035)" style="fill:#FFFFFF;" width="271.988" height="24" />
                            </g>`;

    container.append(tr);
    tr.append(tdEmail);
    tr.append(tdActions);
    tdActions.append(deleteBtn);
    deleteBtn.append(closeBtnSVG);

    deleteBtn.addEventListener('click', removeAccessFile);
}

// Убрать доступ к файлу
function removeAccessFile() {
    if (!confirm('Вы уверены?')) return;
    let tr = this.closest('tr');
    let url = new URL(document.location);
    let path = url.searchParams.get('directory');
    path = path === null ? '' : path;
    let email = tr.querySelector('.access-table-email').textContent;
    let fileName = document.querySelector('.access-control__file-name').textContent;
    let formData = new FormData();
    formData.append('email', email);
    formData.append('fileName', fileName);
    formData.append('directory', path);
    new Promise((resolve, reject) => {
        fetch(`${PATH}files/access_control?removeAccess=true`, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(res => {
                res['error'] === false ? resolve() : reject(res['message']);
            })
    })
        .then(() => {
            tr.remove();
        })
        .catch(res => {
            alert(res);
        })

}

// Создание предоставленного файла
function createProvideFile(container, fileName, path, type) {
    let tr = document.createElement('tr');
    let tdFile = document.createElement('td');
    let spanFileType = document.createElement('span');
    let fileTypeSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let spanFileName = document.createElement('span');
    let tdActions = document.createElement('td');
    let downloadLink = document.createElement('a');
    let downloadLinkSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    tr.classList.add('provide-files__tbody-tr');
    tdFile.classList.add('provide-files__tbody-td', 'provide-file-name');
    spanFileType.classList.add('provide-file__file-type');
    spanFileName.classList.add('provide-file__file-name');
    tdActions.classList.add('provide-files__tbody-td', 'provide-file-actions');
    downloadLink.classList.add('provide-file__download');

    spanFileName.textContent = fileName;
    downloadLink.download = '';
    downloadLink.href = path;
    downloadLink.title = 'Скачать';
    downloadLinkSVG.setAttributeNS(null, 'viewBox', '0 0 473.677 473.677');
    downloadLinkSVG.setAttributeNS(null, 'width', '20px');
    downloadLinkSVG.setAttributeNS(null, 'height', '20px');
    downloadLinkSVG.innerHTML = `<path style="fill:#4ABC96;" d="M0,236.842C0,106.024,106.036,0,236.835,0c130.807,0,236.842,106.024,236.842,236.842 c0,130.792-106.036,236.835-236.842,236.835C106.036,473.677,0,367.634,0,236.842z"></path>
                            <g>
                                <path style="fill:#FFFFFF;" d="M347.915,281.983c0,14.076,0,28.148,0,42.227c-71.673,0-143.349,0-215.018,0 c0-14.008,0-28.017,0-42.025c0-18.111-28.054-18.272-28.054-0.202c0,18.717,0,37.433,0,56.153c0,3.867,1.324,6.866,3.339,9.095 c2.229,2.969,5.722,5.033,10.587,5.033c81.025,0,162.051,0,243.072,0c3.867,0,6.866-1.324,9.095-3.339 c2.973-2.229,5.037-5.725,5.037-10.59c0-18.717,0-37.433,0-56.153C375.969,264.074,347.915,263.913,347.915,281.983z"></path>
                                <path style="fill:#FFFFFF;" d="M303.279,187.027c-15.4,0-30.795,0-46.195,0c0-23.32,0-46.64,0-69.956 c0-27.168-42.078-27.407-42.078-0.303c0,23.421,0,46.838,0,70.259c-14.798,0-29.595,0-44.392,0 c-0.273,0.004-0.542,0.03-0.808,0.071c-2.902,0.251-4.783,1.993-5.621,4.196c-1.088,2.184-1.062,4.85,0.856,7.161 c0.217,0.299,0.46,0.572,0.725,0.83c22.056,22.041,44.101,44.09,66.149,66.134c2.715,2.711,7.229,2.64,9.917-0.052 c22.127-22.131,44.25-44.262,66.377-66.392C312.494,194.693,309.345,187.027,303.279,187.027z"></path>
                            </g>`;
    fileTypeSVG.setAttributeNS(null, 'width', '20px');
    fileTypeSVG.setAttributeNS(null, 'height', '20px');

    switch (type) {
        case 'music':
            fileTypeSVG.setAttributeNS(null, 'viewBox', '0 0 496.2 496.2');
            fileTypeSVG.innerHTML = `<path style='fill:#32BEA6;' d='M496.2,248.1C496.2,111.1,385.1,0,248.1,0S0,111.1,0,248.1s111.1,248.1,248.1,248.1 S496.2,385.1,496.2,248.1z'></path><path style='fill:#3A3A38;' d='M344.8,209.8c-2.3-9-6.9-17.7-13.2-25.3c-6-7.3-13-13.1-19.6-18.4l-1.6-1.3c-2.8-2.2-5.4-4.3-7.8-6.5 c-2.6-2.3-5.4-5-8.2-8.1c-5-5.5-9.8-11.8-14.2-18.6c-2.1-3.3-4.1-6.7-6-10.2c-0.9-1.7-1.8-3.5-2.7-5.2c-1-2-1.7-3.7-2.3-5v-0.1 c-0.1-0.2-0.2-0.4-0.2-0.5c-2-4.2-6.4-6.7-11-6.3c-1.4,0.1-2.7,0.5-3.9,1.1c-2.7,1.3-4.7,3.5-5.7,6.4c-0.3,0.8-0.5,1.7-0.6,2.6 c-0.2,0.9-0.4,1.8-0.3,2.8L261.9,295c-14.7-8.7-36.1-10.1-56.8-2.1c-31.2,12.2-49,41.1-39.8,64.7s41.9,32.9,73.1,20.7 c26.4-10.3,43.3-32.7,42.2-53.7l0,0l-14.2-176.5c4.5,5.7,9.1,11,14,15.8c3.5,3.4,6.9,6.4,10.2,9c2.9,2.3,5.9,4.4,8.7,6.4l1.8,1.3 c6.2,4.4,12.7,9.2,18,15c5.2,5.5,8.9,11.7,11,18.5c2.1,6.5,2.9,14,2.5,22.2c-0.4,7.2-1.7,14.8-4,23.4c-2,7.3-4.5,14.9-7.9,23.2 c-1.1,2.8,0.2,6,3,7.2c0.9,0.4,1.8,0.5,2.7,0.4c1.9-0.2,3.7-1.3,4.6-3.2c4-8.5,7.1-16.3,9.7-24c3-9.3,5-17.8,5.9-25.9 C347.5,227.5,347,218.2,344.8,209.8z'></path>`;
            tr.dataset.type = type;
            break;
        case 'img':
            fileTypeSVG.setAttributeNS(null, 'viewBox', '0 0 64 64');
            fileTypeSVG.innerHTML = `<g id='photos_android_app_aplication_phone' data-name='photos android app aplication phone'><path d='m60.11 16.636a14.539 14.539 0 0 0 -12.741-12.736 132.374 132.374 0 0 0 -30.73 0 14.537 14.537 0 0 0 -12.739 12.736 132.247 132.247 0 0 0 0 30.728c.01.091.031.179.043.269l19.775-19.776 6.214 6.214 10.358-10.357 20.174 20.174a132.135 132.135 0 0 0 -.354-27.252zm-43.103 4.364a4 4 0 1 1 4-4 4 4 0 0 1 -4 4z' fill='#4370ff'></path><path d='m47.14 5.879a12.477 12.477 0 0 1 10.989 10.986 130.928 130.928 0 0 1 .86 17.058l3.884 3.884a134.7 134.7 0 0 0 -.773-21.407 16.462 16.462 0 0 0 -14.5-14.5 134.86 134.86 0 0 0 -31.2 0 16.462 16.462 0 0 0 -14.5 14.5 134.869 134.869 0 0 0 0 31.2 16.535 16.535 0 0 0 14.5 14.5 134.841 134.841 0 0 0 15.6.9 134.836 134.836 0 0 0 15.6-.9 16.462 16.462 0 0 0 14.5-14.5c.3-2.6.424-4.363.433-4.472l-10.825-10.828-10-10a2 2 0 0 0 -2.828 0l-8.945 8.944-4.8-4.8a2 2 0 0 0 -2.829 0l-16.821 16.811a130.84 130.84 0 0 1 .394-26.39 12.476 12.476 0 0 1 10.988-10.986 130.907 130.907 0 0 1 30.273 0zm-23.424 24.806 4.8 4.8a2 2 0 0 0 2.829 0l8.945-8.945 18.093 18.09c-.08.835-.158 1.669-.255 2.5a12.477 12.477 0 0 1 -10.988 10.991 130.877 130.877 0 0 1 -30.273 0 12.505 12.505 0 0 1 -10.781-9.809z'></path><path d='m11.007 17a6 6 0 1 0 6-6 6.007 6.007 0 0 0 -6 6zm8 0a2 2 0 1 1 -2-2 2 2 0 0 1 2 2z'></path></g>`;
            tr.dataset.type = type;
            break;
        case 'video':
            fileTypeSVG.setAttributeNS(null, 'viewBox', '0 0 512 512');
            fileTypeSVG.innerHTML = `<path d='m0 96v384c0 17.679688 14.320312 32 32 32h448c17.679688 0 32-14.320312 32-32v-384zm0 0' fill='#e1eaf7'></path><path d='m0 0h512v128h-512zm0 0' fill='#b0bec5'></path><path d='m64 48h32v32h-32zm0 0' fill='#fff'></path><path d='m128 48h32v32h-32zm0 0' fill='#fff'></path><path d='m432 80h-224c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h224c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0' fill='#90a4ae'></path><path d='m208 378v-180l144 90zm0 0' fill='#e76e54'></path><path d='m432 448h-240v-32h240c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0' fill='#c1cee3'></path><path d='m144 480c-8.832031 0-16-7.167969-16-16v-64c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v64c0 8.832031-7.167969 16-16 16zm0 0' fill='#ffcb5a'></path><path d='m64 416h32v32h-32zm0 0' fill='#c1cee3'></path>`;
            tr.dataset.type = type;
            break;
        case 'folder':
            fileTypeSVG.setAttributeNS(null, 'viewBox', '0 0 512 512');
            fileTypeSVG.innerHTML = `<path style='fill:#FF9F00;' d='M512,100.949c0-8.275-6.702-14.987-14.978-15l-207.307-0.315l-50.011-49.2 C236.901,33.683,233.13,32,229.201,32H90.522C52.269,32,21,63.406,21,101.659v327.375h491V100.949z'></path><g><path style='fill:#FFD154;' d='M265.027,61.346l-25.322-24.912C236.901,33.683,233.13,32,229.201,32H90.522 C52.269,32,21,63.406,21,101.659v327.375h251.492V68.689L265.027,61.346z'></path><path style='fill:#FFD154;' d='M497.021,167.321l-245.332-0.334l-53.266-64.501C195.574,99.038,191.334,97,186.86,97H72.756 C32.638,97,0,129.721,0,169.839v294.877C0,473,6.716,480,15,480h482c8.284,0,15-7,15-15.284V182.321 C512,174.045,505.297,167.333,497.021,167.321z'></path></g><path style='fill:#FFDF8E;' d='M272.492,167.015l-20.803-0.028l-53.266-64.501C195.574,99.038,191.334,97,186.86,97H72.756 C32.638,97,0,129.721,0,169.839v294.877C0,473,6.716,480,15,480h257.492V167.015z'></path><g><path style='fill:#FF9F00;' d='M231.198,326H84.806c-8.284,0-15,6.716-15,15s6.716,15,15,15h146.393c8.284,0,15-6.716,15-15 S239.482,326,231.198,326z'></path><path style='fill:#FF9F00;' d='M193.152,380H84.806c-8.284,0-15,6.716-15,15s6.716,15,15,15h108.347c8.284,0,15-6.716,15-15 S201.437,380,193.152,380z'></path></g><path style='fill:#383838;' d='M425.286,358.309c-1.386-5.34-5.663-13.266-25.712-20.416c-3.146-1.122-7.959-2.587-13.635-3.855 c8.681-7.075,14.062-17.844,14.062-29.89v-8.105c0-21.259-17.204-38.554-38.539-38.554c-21.258,0-38.461,17.295-38.461,38.554v8.105 c0,12.046,5.582,22.815,14.262,29.89c-5.677,1.268-10.301,2.733-13.448,3.855c-20.049,7.15-24.079,15.076-25.464,20.416 c-0.319,1.231-0.35,2.497-0.35,3.769v39.673c0,8.284,6.466,15.25,14.75,15.25h97.784c8.284,0,15.466-6.966,15.466-15.25v-39.673 C426,360.806,425.605,359.54,425.286,358.309z'></path><path style='fill:#7C8388;' d='M361.461,257.488c-21.258,0-38.461,17.295-38.461,38.554v8.105c0,12.046,5.582,22.815,14.262,29.89 c-5.677,1.268-10.301,2.733-13.448,3.855c-20.049,7.15-24.079,15.076-25.464,20.416c-0.319,1.231-0.35,2.497-0.35,3.769v39.673 c0,8.284,6.466,15.25,14.75,15.25H362L361.461,257.488z'></path>`;
            tr.dataset.type = type;
            break;
        case 'document':
            fileTypeSVG.setAttributeNS(null, 'viewBox', '0 0 508 508');
            fileTypeSVG.innerHTML = `<circle style='fill:#FFD05B;' cx='254' cy='254' r='254'></circle><path style='fill:#FFFFFF;' d='M193.2,89.8v53.7c0,5.8-4.7,10.5-10.5,10.5H129v253.9c0,5.8,4.7,10.5,10.5,10.5h229 c5.8,0,10.5-4.7,10.5-10.5V100.2c0-5.8-4.7-10.5-10.5-10.5H193.2V89.8z'></path><path style='fill:#E6E9EE;' d='M193.2,89.8L129,153.9h53.7c5.8,0,10.5-4.7,10.5-10.5V89.8z'></path><g><path style='fill:#84DBFF;' d='M183.1,189.5h12.6v31.1H189v-25.2h-5.9V189.5z'></path><path style='fill:#84DBFF;' d='M214.9,221c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7s1.1-8.8,3.2-11.7c2.1-2.9,5.3-4.4,9.6-4.4 s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7s-1.1,8.8-3.2,11.7C222.4,219.5,219.2,221,214.9,221z M210.4,197.4c-1,1.9-1.5,4.4-1.5,7.5 s0.5,5.6,1.5,7.5s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8c1-1.9,1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5s-2.5-2.8-4.6-2.8 C212.9,194.6,211.3,195.5,210.4,197.4z'></path><path style='fill:#84DBFF;' d='M231.6,189.5h12.6v31.1h-6.7v-25.2h-5.9L231.6,189.5L231.6,189.5z'></path><path style='fill:#84DBFF;' d='M263.5,221c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7s1.1-8.8,3.2-11.7c2.1-2.9,5.3-4.4,9.6-4.4 s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7s-1.1,8.8-3.2,11.7S267.8,221,263.5,221z M258.9,197.4c-1,1.9-1.5,4.4-1.5,7.5s0.5,5.6,1.5,7.5 s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8c1-1.9,1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5s-2.5-2.8-4.6-2.8C261.4,194.6,259.9,195.5,258.9,197.4z'></path><path style='fill:#84DBFF;' d='M280.2,189.5h12.6v31.1h-6.7v-25.2h-5.9V189.5z'></path><path style='fill:#84DBFF;' d='M312.1,221c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7s1.1-8.8,3.2-11.7s5.3-4.4,9.6-4.4 s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7s-1.1,8.8-3.2,11.7S316.4,221,312.1,221z M307.5,197.4c-1,1.9-1.5,4.4-1.5,7.5s0.5,5.6,1.5,7.5 s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8c1-1.9,1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5s-2.5-2.8-4.6-2.8C310,194.6,308.5,195.5,307.5,197.4z'></path><path style='fill:#84DBFF;' d='M183.1,242.9h12.6V274H189v-25.2h-5.9V242.9z'></path><path style='fill:#84DBFF;' d='M214.9,274.3c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7c0-4.9,1.1-8.8,3.2-11.7 c2.1-2.9,5.3-4.4,9.6-4.4s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7s-1.1,8.8-3.2,11.7C222.4,272.8,219.2,274.3,214.9,274.3z M210.4,250.7 c-1,1.9-1.5,4.4-1.5,7.5s0.5,5.6,1.5,7.5s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8s1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5s-2.5-2.8-4.6-2.8 C212.9,247.9,211.3,248.8,210.4,250.7z'></path><path style='fill:#84DBFF;' d='M231.6,242.9h12.6V274h-6.7v-25.2h-5.9L231.6,242.9L231.6,242.9z'></path><path style='fill:#84DBFF;' d='M263.5,274.3c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7c0-4.9,1.1-8.8,3.2-11.7 c2.1-2.9,5.3-4.4,9.6-4.4s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7s-1.1,8.8-3.2,11.7C271,272.8,267.8,274.3,263.5,274.3z M258.9,250.7 c-1,1.9-1.5,4.4-1.5,7.5s0.5,5.6,1.5,7.5s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8s1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5s-2.5-2.8-4.6-2.8 C261.4,247.9,259.9,248.8,258.9,250.7z'></path><path style='fill:#84DBFF;' d='M280.2,242.9h12.6V274h-6.7v-25.2h-5.9V242.9z'></path><path style='fill:#84DBFF;' d='M312.1,274.3c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7c0-4.9,1.1-8.8,3.2-11.7s5.3-4.4,9.6-4.4 s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7s-1.1,8.8-3.2,11.7C319.6,272.8,316.4,274.3,312.1,274.3z M307.5,250.7c-1,1.9-1.5,4.4-1.5,7.5 s0.5,5.6,1.5,7.5s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8s1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5s-2.5-2.8-4.6-2.8 C310,247.9,308.5,248.8,307.5,250.7z'></path><path style='fill:#84DBFF;' d='M183.1,296.2h12.6v31.1H189v-25.2h-5.9V296.2z'></path><path style='fill:#84DBFF;' d='M214.9,327.6c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7c0-4.9,1.1-8.8,3.2-11.7 c2.1-2.9,5.3-4.4,9.6-4.4s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7c0,4.9-1.1,8.8-3.2,11.7C222.4,326.2,219.2,327.6,214.9,327.6z M210.4,304.1c-1,1.9-1.5,4.4-1.5,7.5s0.5,5.6,1.5,7.5s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8s1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5 s-2.5-2.8-4.6-2.8C212.9,301.2,211.3,302.2,210.4,304.1z'></path><path style='fill:#84DBFF;' d='M231.6,296.2h12.6v31.1h-6.7v-25.2h-5.9L231.6,296.2L231.6,296.2z'></path><path style='fill:#84DBFF;' d='M263.5,327.6c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7c0-4.9,1.1-8.8,3.2-11.7 c2.1-2.9,5.3-4.4,9.6-4.4s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7c0,4.9-1.1,8.8-3.2,11.7C271,326.2,267.8,327.6,263.5,327.6z M258.9,304.1c-1,1.9-1.5,4.4-1.5,7.5s0.5,5.6,1.5,7.5s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8s1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5 s-2.5-2.8-4.6-2.8C261.4,301.2,259.9,302.2,258.9,304.1z'></path><path style='fill:#84DBFF;' d='M280.2,296.2h12.6v31.1h-6.7v-25.2h-5.9V296.2z'></path><path style='fill:#84DBFF;' d='M312.1,327.6c-4.3,0-7.5-1.5-9.6-4.4s-3.2-6.8-3.2-11.7c0-4.9,1.1-8.8,3.2-11.7 c2.1-2.9,5.3-4.4,9.6-4.4s7.5,1.5,9.6,4.4s3.2,6.8,3.2,11.7c0,4.9-1.1,8.8-3.2,11.7C319.6,326.2,316.4,327.6,312.1,327.6z M307.5,304.1c-1,1.9-1.5,4.4-1.5,7.5s0.5,5.6,1.5,7.5s2.5,2.8,4.6,2.8s3.6-0.9,4.6-2.8s1.5-4.4,1.5-7.5s-0.5-5.6-1.5-7.5 s-2.5-2.8-4.6-2.8C310,301.2,308.5,302.2,307.5,304.1z'></path></g>`;
            tr.dataset.type = type;
            break;
    }

    container.append(tr);
    tr.append(tdFile);
    tr.append(tdActions);
    tdFile.append(spanFileType);
    spanFileType.append(fileTypeSVG);
    tdFile.append(spanFileName);
    tdActions.append(downloadLink);
    downloadLink.append(downloadLinkSVG);
}

// Открыть окно с предоставленными файлами
function openWindowProvideFiles() {
    new Promise((resolve, reject) => {
        fetch(`${PATH}files/get_provide_files`)
            .then(res => res.json())
            .then(res => {
                res['error'] === false ? resolve(res['fileInfo']) : reject(new Error(`${res['message']}`));
            })
    })
        .then(res => {
            let tbody = document.querySelector('.provide-files__tbody');
            let allTr = tbody.querySelectorAll('.provide-files__tbody-tr');
            if (allTr.length > 0) {
                allTr.forEach((tr) => { tr.remove() });
            }
            if (res) {
                res.forEach((file) => {
                    createProvideFile(tbody, file['fileName'], file['path'], file['type']);
                })
            } else {
                let tr = document.createElement('tr');
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                tr.classList.add('provide-files__tbody-tr');
                td1.textContent = 'Файлы отсутствуют';
                td1.style.textAlign = 'center';
                td1.style.padding = '10px 0';
                tbody.append(tr);
                tr.append(td1);
                tr.append(td2);

            }
            let windowProvideFiles = document.querySelector('.provide-files');
            windowProvideFiles.style.display = 'grid';
        })
        .catch(res => {
            alert(res.stack);
        })
}

// Изменение пароля
function resetPass() {
    new Promise(() => {
        fetch(`${PATH}users/reset_password`)
    })

}

document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.content');
    const switchRoleBtn = document.querySelector('.switch-role-btn');
    const deleteUserBtn = document.querySelectorAll('.delete-user');
    const formWorkingFolders = document.querySelector('.working-folders');
    const overlay = document.querySelector('.overlay');
    const userRole = document.querySelector('.header__user-role');

    if (userRole.textContent === 'admin') getFilesUserOnClick();

    if (switchRoleBtn.classList.contains('switch-admin')) {
        switchRoleBtn.addEventListener('click', () => {
            switchAdmin(content);
        })
    } else {
        switchRoleBtn.addEventListener('click', async () => {
            switchUser();
        })
    }

    deleteUserBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
            deleteUser(btn);
        })
    })

    overlay.addEventListener('click', () => {
        if (formWorkingFolders.style.display === 'grid') {
            let input = formWorkingFolders.querySelector('.form__input');
            formWorkingFolders.style.display = 'none';
            input.value = '';
            overlay.style.display = 'none';
            let activeRename = document.querySelector('.active-rename');
            if (activeRename != null) {
                activeRename.classList.remove('active-rename');
            }
        }
    })

    let createFolderBtn = document.querySelector('.create-folder');
    createFolderBtn.addEventListener('click', (event) => {
        openFormCreateFolder(formWorkingFolders, event);
    });

    let addFileBtn = document.querySelector('.add-file');
    addFileBtn.addEventListener('click', (event) => {
        openFormAddNewFile(formWorkingFolders, event);
    })

    formWorkingFolders.addEventListener('submit', (event) => {
        event.preventDefault();
        switch (formWorkingFolders.dataset.type) {
            case 'folder':
                createFolder(formWorkingFolders, overlay);
                break;
            case 'file':
                addFile(formWorkingFolders, overlay);
                break;
            case 'rename':
                renameFile(formWorkingFolders, overlay);
                break;
        }
    })

    let deleteFileBtn = document.querySelectorAll('.delete-file');
    deleteFileBtn.forEach((btn) => {
        btn.addEventListener('click', deleteFile);
    })

    let files = document.querySelectorAll('.tbody__tr');
    files.forEach((file) => {
        file.addEventListener('dblclick', openFolder);
    })

    let stepBackBtn = document.querySelector('.back');
    stepBackBtn.addEventListener('click', stepBack);
    window.addEventListener('popstate', () => {
        let url = new URL(window.location)
        getFiles(url.search);
    })

    let infoBtn = document.querySelectorAll('.info-file');
    infoBtn.forEach((btn) => {
        btn.addEventListener('click', getInfoFile);
    })

    let renameBtn = document.querySelectorAll('.rename-file');
    renameBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
            openFormRenameFile(btn, formWorkingFolders, overlay)
        });
    })

    let windowAccess = document.querySelector('.access-control-container');
    let accessControlBtn = document.querySelectorAll('.access-control');
    accessControlBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
            openFormAccessConrol(btn, windowAccess);
        });
    })
    let AccessCloseBtn = windowAccess.querySelector('.access-control__close-btn');
    AccessCloseBtn.addEventListener('click', () => {
        closeFormAccessControl(windowAccess);
    })
    let formAccessControl = windowAccess.querySelector('.access-control__form');
    formAccessControl.addEventListener('submit', (event) => {
        event.preventDefault();
        grantAccessToFile(formAccessControl);
    });

    let windowProvideFiles = document.querySelector('.provide-files');
    let openWindowProvideFilesBtn = document.querySelector('.open-provide-files');
    openWindowProvideFilesBtn.addEventListener('click', openWindowProvideFiles);
    let closeWindowProvideFilesBtn = document.querySelector('.provide-files__close-btn');
    closeWindowProvideFilesBtn.addEventListener('click', () => {
        windowProvideFiles.style.display = 'none';
        let allTr = windowProvideFiles.querySelectorAll('.provide-files__tbody-tr');
        if (allTr.length > 0) {
            allTr.forEach((tr) => { tr.remove() });
        }
    })

    let resetPassBtn = document.querySelector('.actions__pass-change');
    resetPassBtn.addEventListener('click', resetPass);
})

