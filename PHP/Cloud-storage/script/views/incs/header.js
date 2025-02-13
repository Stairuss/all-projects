const actionsBtn = document.querySelector('.header__open-list-btn');
const actionsContainer = document.querySelector('.actions__container');
const overlay = document.querySelector('.overlay');
const actions = document.querySelectorAll('.actions-element');
const form = document.querySelector('.working-folders');

// Открыть список actions
function openActions() {
    overlay.style.display = 'block';
    actionsContainer.style.display = 'block';
}

// Закрыть список actions и формы по работе с папками
function closeActions() {
    if (actionsContainer.style.display === 'block') {
        overlay.style.display = 'none';
        actionsContainer.style.display = 'none';
    }
}

actionsBtn.addEventListener('click', openActions);
overlay.addEventListener('click', closeActions);
actions.forEach((action) => {
    action.addEventListener('click', closeActions);
})

// Окно с уведомлением об отправке письма на почту о сбросе пароля
const resetPassBtn = document.querySelector('.actions__pass-change');

resetPassBtn.addEventListener('click', () => {
    alert('Письмо с инструкциями по сбросу пароля отправлены на ваш Email');
})
