(() => {
    document.addEventListener('DOMContentLoaded', () => {

        // Слайдер
        new Swiper('.swiper', {
            direction: 'horizontal',
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            scrollbar: {
                el: '.swiper-scrollbar',
            },
            keyboard: {
                enabled: true,
            },
            initialSlide: 0,
            autoplay: {
                delay: 7000,
            },

            speed: 1000,
            effect: 'fade',
            parallax: true,
        });

        // Регулирем высоту header при прокрутке страинцы
        const header = document.querySelector('.header');
        const arrow1 = document.getElementById('arrow-no-scroll');
        const arrow2 = document.getElementById('arrow-scroll');
        const headerLinks = header.querySelectorAll('.header__link');
        const headerLogo = header.querySelector('.header__logo');
        const headerProductsBtn = header.querySelector('.header__products-btn');
        const userDataBlock = header.querySelector('.header__user-data-block');
        const headerMainBtn = header.querySelector('.header__main-btn');

        document.addEventListener('scroll', () => {
            if (window.pageYOffset < 200) {
                setTimeout(() => {
                    header.style.height = '154px';
                    userDataBlock.style.top = '154px';
                    arrow1.classList.remove('display-none');
                    arrow2.classList.add('display-none');
                    headerMainBtn.style.height = '154px';
                    headerMainBtn.style.backgroundSize = '66px 95px';
                    headerLogo.style.width = '265px';
                    headerLogo.style.height = '80px';
                    headerLinks.forEach((link) => {
                        link.style.fontSize = '32px';
                    });
                    headerProductsBtn.style.fontSize = '32px';
                }, 1)
            } else {
                setTimeout(() => {
                    header.style.height = '101px';
                    userDataBlock.style.top = '101px';
                    arrow1.classList.add('display-none');
                    arrow2.classList.remove('display-none');
                    headerMainBtn.style.height = '101px';
                    headerMainBtn.style.backgroundSize = '52px 75px';
                    headerLogo.style.width = '183px';
                    headerLogo.style.height = '56px';
                    headerLinks.forEach((link) => {
                        link.style.fontSize = '24px';
                    });
                    headerProductsBtn.style.fontSize = '24px';
                }, 1)
            }
        });

        function openHeaderWindow(block, element, className) {
            block.classList.add(className);
            setTimeout(() => {
                element.forEach((el) => {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                })
            }, 50)
        };

        function closeHeaderWindow(block, element, className) {
            setTimeout(() => {
                block.classList.remove(className);
            }, 50)
            element.forEach((el) => {
                el.style.opacity = '0';
                el.style.visibility = 'hidden';
            })
        }

        // Открываем данные пользователя и список продукции
        const userDataBtn = header.querySelector('.header__main-btn');
        const userElement = header.querySelectorAll('.user-element');
        const productsBtn = header.querySelector('.header__products-btn');
        const productsBlock = header.querySelector('.header-item-products__list');
        const productsItem = header.querySelectorAll('.header-item-products__item');
        // Открываем и закрываем данные пользователя
        document.body.addEventListener('click', (event) => {
            if (event.target == userDataBtn) {
                if (!userDataBlock.classList.contains('open-user-data')) {
                    openHeaderWindow(userDataBlock, userElement, 'open-user-data');
                } else {
                    closeHeaderWindow(userDataBlock, userElement, 'open-user-data')
                }
            }
            if (!userDataBlock.contains(event.target) && event.target != userDataBtn) {
                closeHeaderWindow(userDataBlock, userElement, 'open-user-data')
            }

            // Открываем и закрываем список продукции
            if (event.target == productsBtn || event.target == productsBtn.firstElementChild) {
                if (!productsBlock.classList.contains('open-header-item-products-list')) {
                    openHeaderWindow(productsBlock, productsItem, 'open-header-item-products-list');
                } else {
                    closeHeaderWindow(productsBlock, productsItem, 'open-header-item-products-list')
                }
            }
            if (!productsBlock.contains(event.target) && event.target != productsBtn && event.target != productsBtn.firstElementChild) {
                closeHeaderWindow(productsBlock, productsItem, 'open-header-item-products-list')
            }
        });

        // hover эффект блока в секции hero
        const heroContentBlock = document.querySelectorAll('.hero__content-block');
        const swiperButton = document.querySelector('.swiper-button-next');

        swiperButton.addEventListener('mouseover', () => {
            heroContentBlock.forEach((el) => {
                el.style.background = 'rgba(0, 0, 0, 0.80)';
            })
        })

        heroContentBlock.forEach((el) => {
            el.addEventListener('mouseover', (event) => {
                if (event.currentTarget == el) {
                    el.style.background = 'rgba(0, 0, 0, 0.80)';
                }
                el.addEventListener('mouseout', () => {
                    el.style.background = 'rgba(0, 0, 0, 0.50)';
                })
            });
        });
    })
})()
