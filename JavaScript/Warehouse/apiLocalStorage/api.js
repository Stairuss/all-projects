// Получить все записи из localStorage
function getRecords() {
    const data = {};
    data.records = JSON.parse(localStorage.getItem('records'));
    data.id = JSON.parse(localStorage.getItem('id'));
    return data;
}

// Сохранить записи в localStorage
function saveRecords(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Добавить запись в localStorage
function setRecord(arrRecord) {
    let data = getRecords();
    let recordsList;
    let id;
    if (data.records != null) {
        id = data.id + 1;
        recordsList = data.records;
    } else {
        recordsList = [];
        id = 1;
    }
    const objRecord = {};
    arrRecord.forEach(el => {
        switch (el[0]) {
            case 'name':
                objRecord[el[0]] = el[1];
                break;
            case 'shelf':
                objRecord[el[0]] = el[1];
                break;
            case 'weight':
                objRecord[el[0]] = el[1];
                break;
            case 'date':
                objRecord[el[0]] = el[1];
                break;

        }
    });
    objRecord.id = id;
    recordsList.push(objRecord);
    saveRecords('records', recordsList);
    saveRecords('id', id);
}

// Удалить запись из localStorage
function deleteRecord(id) {
    let data = getRecords();
    for (let i = 0; i < data.records.length; i++) {
        if (data.records[i].id == id) {
            data.records.splice(i, 1);
            saveRecords('records', data.records);
            break;
        }
    }
    return true;
}

// Получить запись по id
function getRecord(id) {
    let data = getRecords();
    let result;
    let index;
    for (let i = 0; i < data.records.length; i++) {
        if (data.records[i].id == id) {
            result = data.records[i];
            index = i;
        }
    }
    return { result, index };
}

// Схохранить отредактированную заапись
function saveEditRecord(arrRecord, id) {
    const data = getRecords();    
    const currentRecord = getRecord(id);
    const newRecord = {}
    arrRecord.forEach(el => {
        switch (el[0]) {
            case 'name':
                newRecord[el[0]] = el[1];
                break;
            case 'shelf':
                newRecord[el[0]] = el[1];
                break;
            case 'weight':
                newRecord[el[0]] = el[1];
                break;
            case 'date':
                newRecord[el[0]] = el[1];
                break;

        }
    });    
    newRecord.id = currentRecord.result.id;
    data.records[currentRecord.index] = newRecord;    
    saveRecords('records', data.records);
}

export {
    getRecords,
    setRecord,
    deleteRecord,
    getRecord,
    saveEditRecord
}