(() => {
    let numbersCards = 4; // Количество карточек в игре
    // Генерируем парное число
    function createDoubleNumbers() {
        let DoubleNumbers = [];
        for (let i = 0; i < numbersCards; i++) {
            let max = numbersCards;
            let a = Math.floor(Math.random() * max);
            let b = a;
            let c = false;
            for (let i = 0; i < DoubleNumbers.length; i++) {
                if (DoubleNumbers[i] == a) {
                    c = true;
                }
            }
            if (c == false && DoubleNumbers.length < numbersCards) {
                DoubleNumbers.push(a, b);
            }
        }        
        return DoubleNumbers;
    };

    // Перемешиваем массив
    function createMixNumbers(arr) {
        let mixArr = arr;
        for (let i = mixArr.length - 1; i > 0; i--) {
            let a = mixArr[i];
            let b = Math.floor(Math.random() * (i + 1));

            mixArr[i] = mixArr[b];
            mixArr[b] = a;

        }

        return mixArr;
    };

    // Создаем карточки
    function createCards() {
        let list = document.querySelector('.list');
        let oldItem = document.querySelectorAll('.list__item');
        let oldBtn = document.querySelectorAll('.list__btn');

        oldItem.forEach((i) => {
            i.remove()
        });

        oldBtn.forEach((i) => {
            i.remove()
        });
        for (let i = numbersCards; i > 0; i--) {
            let item = document.createElement('li');
            let button = document.createElement('button');

            list.append(item);
            item.append(button);

            item.classList.add('list__item');
            button.classList.add('list__btn', 'no-open');
            button.disabled = true;
        };
        
    };

    // Создаем обработчик на открытие карточек
    function checkPair(event) {
        let btnClick = event.currentTarget;
        let container = document.querySelector('.container');
        let activeBtn = document.querySelector('.active');
        let allBtn = document.querySelectorAll('.list__btn');

        // Если кнопка на которую происходит "клик" первая
        if (container.contains(document.querySelector('.active')) == false) {
            btnClick.classList.add('active');
            btnClick.disabled = true;
            btnClick.classList.remove('color-transparent', 'no-open')
            // Если игрок угадывает карточки
        } else if (btnClick.textContent == activeBtn.textContent) {
            activeBtn.classList.add('bcg-green');
            btnClick.classList.add('bcg-green');

            activeBtn.classList.remove('active');
            btnClick.classList.remove('active', 'color-transparent', 'no-open');

            btnClick.disabled = true;

            // Если найдена последняя пара
            if (container.contains(document.querySelector('.no-open')) == false) {
                let winText = document.querySelector('.win-text');
                let restartBtn = document.querySelector('.restart-btn');

                winText.classList.remove('hidden');
                restartBtn.classList.remove('display-none');
            }

            // Если игрок не угадывает карточки
        } else {
            allBtn.forEach((i) => {
                i.disabled = true
            });
            btnClick.classList.remove('color-transparent', 'no-open');
            btnClick.classList.add('fail');
            activeBtn.classList.add('fail');
            setTimeout(() => {
                btnClick.classList.remove('fail');
                activeBtn.classList.remove('fail', 'active');

                btnClick.classList.add('color-transparent', 'no-open');
                activeBtn.classList.add('color-transparent', 'no-open');

                allBtn.forEach((i) => {
                    i.disabled = false
                });
            }, 1000);
        };
    };

    // Обработчик на кнопку "Начать игру"
    function startGame() {
        createCards();
        let goPlayBtn = document.querySelector('.main-btn');
        let btn = document.querySelectorAll('.list__btn');
        let arrDoubleNumbers = createDoubleNumbers();
        let arrMixNumbers = createMixNumbers(arrDoubleNumbers);
        let validityText = document.querySelector('.validity');
        let winText = document.querySelector('.win-text')

        goPlayBtn.classList.add('display-none');
        validityText.classList.add('display-none');  
        winText.classList.add('hidden');     
        btn.forEach((i) => {
            i.classList.remove('bcg-green', 'active');
            i.classList.add('color-transparent', 'no-open');
            let number = arrMixNumbers[0];
            i.textContent = number;
            arrMixNumbers.splice(0, 1);
            i.disabled = false;
        });
        // Создаем обработчик на нажатие карточек
        btn.forEach((i) => {
            i.addEventListener('click', checkPair)
        });
        
    };

    // Создаем обработчик на кнопку "Настройки"
    function openSettings() {
        let input = document.querySelector('.input');
        let saveSettingsBtn = document.querySelector('.save-settings');

        input.classList.toggle('display-none');
        saveSettingsBtn.classList.toggle('display-none');
    };

    // Создаем обработчик на кнопку "Сохранить изменения"
    function saveSettings() {
        let btn = document.querySelector('.save-settings');
        let input = document.querySelector('.input');
        let validity = document.querySelector('.validity');
        let goPlayBtn = document.querySelector('.main-btn');

        if (input.value <= 10 && input.value >= 2 && input.value % 2 == 0) {
            numbersCards = input.value;
            validity.textContent = 'Изменения сохранены! Нажмите начать игру.';
            validity.style.color = 'green';

            validity.classList.remove('display-none');
            btn.classList.add('display-none');
            input.classList.add('display-none');
            goPlayBtn.classList.remove('display-none');            
        } else {
            validity.textContent = 'Введите четное число от 2 до 10!';
            validity.style.color = 'red';
            validity.classList.remove('display-none');
        }       
    };

    // Обработчик на кнопку "Новая игра"
    function newGame() {
        let arrDoubleNumbers = createDoubleNumbers();
        let arrMixNumbers = createMixNumbers(arrDoubleNumbers);
        let btn = document.querySelectorAll('.list__btn');
        let newGameBtn = document.querySelector('.restart-btn');
        let winText = document.querySelector('.win-text');

        btn.forEach((i) => {
            i.classList.add('no-open', 'color-transparent');
            i.classList.remove('bcg-green');
            i.disabled = false;
            let number = arrMixNumbers[0];
            i.textContent = number;
            arrMixNumbers.splice(0, 1);
            i.disabled = false;
        })
        newGameBtn.classList.add('display-none');
        winText.classList.add('hidden');
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Генерируем карточки
        createCards();

        let goPlayBtn = document.querySelector('.main-btn');
        let btn = document.querySelectorAll('.list__btn');
        let newGameBtn = document.querySelector('.restart-btn');
        let settingsBtn = document.querySelector('.open-settings');
        let saveSettingsBtn = document.querySelector('.save-settings');

        // Обработчик на кнопку "Начать игру"
        goPlayBtn.addEventListener('click', startGame);

        // Обработчик на кнопку "Новая игра"
        newGameBtn.addEventListener('click', newGame);

        // Обработчик на кнопку "Настройки"
        settingsBtn.addEventListener('click', openSettings);

        // Обработчик на кнопку "Сохранить изменения"
        saveSettingsBtn.addEventListener('click', saveSettings);
    })   
})()

