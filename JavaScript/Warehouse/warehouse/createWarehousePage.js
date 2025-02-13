import * as components from './components.js';
import { getRecords, deleteRecord } from '../apiLocalStorage/api.js';
import navigate from '../navigate.js';

export default function createWarehousePage(container) {

    document.cookie = `idEditUser=;expires=${new Date(0)}`;
    const topBlock = components.getTopBlockEl();
    const title = components.getTitleEl('Склад');
    const addBtn = components.getButtonEl('Добавить запись', 2);
    const table = components.getTableEl();

    const thead = components.getTheadEl();
    const trThead = components.getTrEl();
    const thName = components.getThEl('Название');
    const thShelf = components.getThEl('Полка');
    const thWeight = components.getThEl('Вес');
    const thStorageTime = components.getThEl('Время хранения');
    const thActions = components.getThEl();

    const tbody = components.getTbodyEl();

    container.append(topBlock);
    container.append(table);
    topBlock.append(title, addBtn);
    table.append(thead, tbody);
    thead.append(trThead);
    trThead.append(thName);
    trThead.append(thShelf);
    trThead.append(thWeight);
    trThead.append(thStorageTime);
    trThead.append(thActions);

    addBtn.addEventListener('click', () => {
        navigate('newEntry');
    })

    // Выгрузка всех записей в таблицу    
    const data = getRecords();
    if (data.records && data.records.length > 0) {
        data.records.forEach(record => {
            const trTbody = components.getTrEl(record.id);
            const tdName = components.getTdEl(record.name);
            const tdShelf = components.getTdEl(record.shelf);
            const tdWeight = components.getTdEl(record.weight);
            const tdStorageTime = components.getTdEl(record.date);
            const tdActions = components.getTdEl();
            const containerBtn = components.getButtonContainerEl();
            const deleteBtn = components.getButtonEl('Удалить', 1);
            const editBtn = components.getButtonEl('Редактировать', 3);
            trTbody.append(tdName, tdShelf, tdWeight, tdStorageTime, tdActions);
            tdActions.append(containerBtn);
            containerBtn.append(editBtn, deleteBtn);
            tbody.append(trTbody);

            deleteBtn.addEventListener('click', (event) => {
                const tr = event.target.closest('tr');
                if (deleteRecord(tr.id)) {
                    tr.remove();
                    if(!tbody.querySelector('tr')) {
                        const stub = components.getStubEl('Пусто');
                        container.append(stub);
                    }
                } else {
                    alert('Не удалось удалить запись');
                }
            })

            editBtn.addEventListener('click', (event) => {
                const tr = event.target.closest('tr');
                document.cookie = `idEditUser=${tr.id}`;
                navigate('editEntry');
            })
        });
    } else {
        const stub = components.getStubEl('Пусто');
        container.append(stub);
    }



}

