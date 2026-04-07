// Скрипт для страницы выбора версии FunTime
import { supabase } from './supabase.js';

// === ПОДСЧЁТ ТОВАРОВ ===
async function updateProductCounts() {
    const { data: offers, error } = await supabase
        .from('offers')
        .select('server')
        .eq('status', 'active');
    
    if (error) {
        console.error('Ошибка загрузки товаров:', error);
        return;
    }
    
    let funtime_1_16 = 0;
    let funtime_1_21 = 0;
    
    offers.forEach(offer => {
        const server = offer.server;
        if (server === 'funtime-1_16') funtime_1_16++;
        if (server === 'funtime-1_21') funtime_1_21++;
    });
    
    const ft16 = document.getElementById('productsCount_funtime_1_16');
    const ft21 = document.getElementById('productsCount_funtime_1_21');
    
    if (ft16) ft16.textContent = funtime_1_16;
    if (ft21) ft21.textContent = funtime_1_21;
    
    console.log(`📊 FunTime: 1.16.5: ${funtime_1_16}, 1.21: ${funtime_1_21}`);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница выбора версии FunTime загружена');

    const modeCards = document.querySelectorAll('.mode-card');
    const modeBtns = document.querySelectorAll('.select-mode-btn');

    function selectMode(modeName, modeType) {
        console.log(`Выбрана версия: ${modeName} (${modeType})`);
        
        if (modeType === '1_16') {
            window.location.href = 'shop-funtime-1_16.html';
        } else if (modeType === '1_21') {
            window.location.href = 'shop-funtime-1_21.html';
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
            if (modal) modal.style.display = 'flex';
        });
    }
    
    const closeModal = document.querySelector('.support-close');
    if (closeModal) {
        closeModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const modal = document.getElementById('supportModal');
            if (modal) modal.style.display = 'none';
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
    
    // ЗАПУСКАЕМ ПОДСЧЁТ ТОВАРОВ
    updateProductCounts();
});