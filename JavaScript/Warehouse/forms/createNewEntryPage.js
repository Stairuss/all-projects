import * as components from './components.js';
import { setRecord } from '../apiLocalStorage/api.js';
import navigate from '../navigate.js';

export default function crateNewEntryPage(container) {
    const title = components.getTitleEl('Добавить запись');
    const form = components.getFormEl();

    const inputName = components.getInputEl('text', 'name', 'Название');
    const labelName = components.getLabelEl();

    const inputShelf = components.getInputEl('text', 'shelf', 'Полка');
    const labelShelf = components.getLabelEl();

    const inputWeight = components.getInputEl('number', 'weight', 'Вес');
    const labelWeight = components.getLabelEl();

    const inputDate = components.getInputEl('date', 'date');
    const labelDate = components.getLabelEl();

    const addRecordBtn = components.getButtonEl('Добавить запись', 'addRecord');
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
            setRecord(Array.from(new FormData(form)));
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