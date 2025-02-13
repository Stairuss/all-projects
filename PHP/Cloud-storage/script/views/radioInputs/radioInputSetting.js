// Настройка радио-инпутов
const maleRadioInput = document.getElementById('male');
const maleRadioSpan = document.querySelector('.male-check');
const femaleRadioInput = document.getElementById('female');
const femaleRadioSpan = document.querySelector('.female-check');

if(maleRadioInput.checked) {
    maleRadioSpan.classList.add('--radio-checked');
}

if(femaleRadioInput.checked) {
    femaleRadioSpan.classList.add('--radio-checked');
}

function radioCheck(radioInput, newTarget, oldTarget) {
    radioInput.addEventListener('change', () => {
        if (newTarget.classList.contains('--radio-checked') === true) return;
        newTarget.classList.add('--radio-checked');
        if (oldTarget.classList.contains('--radio-checked')) {
            oldTarget.classList.remove('--radio-checked');
        }
    })
}

radioCheck(maleRadioInput, maleRadioSpan, femaleRadioSpan);
radioCheck(femaleRadioInput, femaleRadioSpan, maleRadioSpan);





