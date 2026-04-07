// Скрипт для страницы выбора режима HolyWorld

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница выбора режима HolyWorld загружена');

    // Кнопки выбора режима
    const modeCards = document.querySelectorAll('.mode-card');
    const modeBtns = document.querySelectorAll('.select-mode-btn');

    function selectMode(modeName, modeType) {
        console.log(`Выбран режим: ${modeName} (${modeType})`);
        
        if (modeType === 'lite') {
            window.location.href = 'shop-holyworld-lite.html';
        } else if (modeType === 'classic') {
            window.location.href = 'shop-holyworld-classic.html';
        }
    }

    modeCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('select-mode-btn')) {
                return;
            }
            const modeName = this.querySelector('h2').textContent;
            const modeType = this.getAttribute('data-mode');
            selectMode(modeName, modeType);
        });
    });

    modeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const modeCard = this.closest('.mode-card');
            const modeName = modeCard.querySelector('h2').textContent;
            const modeType = modeCard.getAttribute('data-mode');
            selectMode(modeName, modeType);
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
    
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('supportModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
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