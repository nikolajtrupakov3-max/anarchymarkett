// Скрипт для магазина HolyWorld - Классик Анархия

document.addEventListener('DOMContentLoaded', function() {
    console.log('HolyWorld Классик Анархия загружен');  // ← ЭТО ЕДИНСТВЕННОЕ ОТЛИЧИЕ

    const categoryCards = document.querySelectorAll('.category-card');
    const categoryBtns = document.querySelectorAll('.select-category-btn');

    function selectCategory(categoryName, categoryId) {
    window.location.href = `category.html?category=${categoryId}&server=holyworld-classic&mode=classic`;
}

    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('select-category-btn')) return;
            const categoryId = this.getAttribute('data-category');
            selectCategory('', categoryId);
        });
    });

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const categoryCard = this.closest('.category-card');
            const categoryId = categoryCard.getAttribute('data-category');
            selectCategory('', categoryId);
        });
    });

    // Поддержка
    const supportBtn = document.querySelector('a[href="#"]');
    if (supportBtn && supportBtn.textContent === 'Поддержка') {
        supportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('supportModal').style.display = 'flex';
        });
    }
    
    const closeModal = document.querySelector('.support-close');
    if (closeModal) {
        closeModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('supportModal').style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('supportModal');
        if (e.target === modal) modal.style.display = 'none';
    });
    
    const copyBtn = document.getElementById('copyTgBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const tgUsername = document.getElementById('telegramUsername').textContent;
            navigator.clipboard.writeText(tgUsername);
            alert('✅ Username скопирован: ' + tgUsername);
        });
    }
});