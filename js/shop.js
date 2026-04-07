// Скрипт для страницы категорий

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница категорий загружена');

    const serverTitle = document.querySelector('.server-title h1');
    const serverName = serverTitle ? serverTitle.textContent.replace('🏆 ', '') : 'Сервер';

    const categoryCards = document.querySelectorAll('.category-card');
    const categoryBtns = document.querySelectorAll('.select-category-btn');

    function selectCategory(categoryName, categoryId) {
        let server = 'reallyworld';
        const title = document.querySelector('.server-title h1');
        if (title) {
            if (title.textContent.includes('FunTime')) server = 'funtime';
            else if (title.textContent.includes('HolyWorld')) server = 'holyworld';
            else server = 'reallyworld';
        }
        window.location.href = `category.html?category=${categoryId}&server=${server}`;
    }

    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('select-category-btn')) {
                return;
            }
            const categoryName = this.querySelector('h3').textContent;
            const categoryId = this.getAttribute('data-category');
            selectCategory(categoryName, categoryId);
        });
    });

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const categoryCard = this.closest('.category-card');
            const categoryName = categoryCard.querySelector('h3').textContent;
            const categoryId = categoryCard.getAttribute('data-category');
            selectCategory(categoryName, categoryId);
        });
    });

    // ===== МОДАЛЬНОЕ ОКНО ПОДДЕРЖКИ =====
    const supportBtn = document.querySelector('a[href="#"]');
    if (supportBtn && supportBtn.textContent === 'Поддержка') {
        supportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = document.getElementById('supportModal');
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    }
    
    // Закрытие по крестику
    const closeModal = document.querySelector('.support-close');
    if (closeModal) {
        closeModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const modal = document.getElementById('supportModal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Закрытие по фону
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('supportModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Копирование Telegram
    const copyBtn = document.getElementById('copyTgBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const tgUsername = document.getElementById('telegramUsername').textContent;
            navigator.clipboard.writeText(tgUsername);
            alert('✅ Username скопирован: ' + tgUsername);
        });
    }
    
});