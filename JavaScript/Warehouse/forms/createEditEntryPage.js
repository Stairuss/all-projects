import * as components from './components.js';
import { getRecord, saveEditRecord } from '../apiLocalStorage/api.js';
import navigate from '../navigate.js';

export default function crateEditEntryPage(container) {

    // Получить id записи
    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    const recordId = getCookie('idEditUser');
    const record = getRecord(recordId).result;

    const title = components.getTitleEl('Редактирование записи');
    const form = components.getFormEl();

    const inputName = components.getInputEl('text', 'name', 'Название', record.name);
    const labelName = components.getLabelEl();

    const inputShelf = components.getInputEl('text', 'shelf', 'Полка', record.shelf);
    const labelShelf = components.getLabelEl();

    const inputWeight = components.getInputEl('number', 'weight', 'Вес', record.weight);
    const labelWeight = components.getLabelEl();

    const inputDate = components.getInputEl('date', 'date', record.date);
    inputDate.value = record.date;
    const labelDate = components.getLabelEl();

    const addRecordBtn = components.getButtonEl('Применить изменения', 'editRecord');
    const stepBackBtn = components.getButtonEl('Вернуться к таблице', 'stepBack');

    const validator = new JustValidate(form, {
        focusInvalidField: false,

    });
    validator
        .addField(inputName, [
            {
                rule: 'required',
                errorMessage: 'Поле не может быть пустым',
            },
            {
                rule: 'minLength',
                value: 2,
                errorMessage: 'Минимальное количество символов 2',
            },
            {
                rule: 'maxLength',
                value: 20,
                errorMessage: 'Максимальное количество символов 20',
            },

        ])
        .addField(inputShelf, [
            {
                rule: 'required',
                errorMessage: 'Поле не может быть пустым',
            },
            {
                rule: 'minLength',
                value: 2,
                errorMessage: 'Минимальное количество символов 2',
            },
            {
                rule: 'maxLength',
                value: 4,
                errorMessage: 'Максимальное количество символов 20',
            },
            {
                validator: (value) => {
                    return /^[a-z]{1}\d{1,3}$/i.test(value);
                },
                errorMessage: 'Формат полки должен быть по типу "B17"',
            }

        ])
        .addField(inputWeight, [
            {
                rule: 'required',
                errorMessage: 'Поле не может быть пустым',
            },
            {
                rule: 'number',
            },
            {
                rule: 'minNumber',
                value: 1,
                errorMessage: 'Вес не может быть меньше 1',
            }
        ])
        .addField(inputDate, [
            {
                rule: 'required',
                errorMessage: 'Поле не может быть пустым',
            },
        ])
        .onSuccess(() => {
            saveEditRecord(Array.from(new FormData(form)), recordId);           
            navigate();
        });

    stepBackBtn.addEventListener('click', navigate);

    container.append(title);
    container.append(form);

    labelName.append(inputName)
    form.append(labelName);

    labelShelf.append(inputShelf);
    form.append(labelShelf);

    labelWeight.append(inputWeight);
    form.append(labelWeight);

    labelDate.append(inputDate);
    form.append(labelDate);

    form.append(addRecordBtn);
    form.append(stepBackBtn);
}