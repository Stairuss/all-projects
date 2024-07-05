(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const comment1 = document.getElementById("comment-1");
        const comment2 = document.getElementById("comment-2");
        const comment3 = document.getElementById("comment-3");

        const ratingCount1 = comment1.querySelector('.entrie-comments__rating-count');
        const ratingCount2 = comment2.querySelector('.entrie-comments__rating-count');
        const ratingCount3 = comment3.querySelector('.entrie-comments__rating-count');
        
        ratingCount1.textContent = '2';

        ratingCount2.textContent = '-2';
        ratingCount2.classList.add('dislike-style');
        ratingCount3.textContent = '48';

        const textContent = comment3.querySelector('.entrie-comments__text-content');        
        textContent.classList.add('mute');
        textContent.textContent = 'Комментарий скрыт по причине: обнаружена ссылка на внешний ресурс.'


    })

})();