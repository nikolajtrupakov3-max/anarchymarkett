// Скрипт для страницы выбора сервера ReallyWorld
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
    
    let rw_bedrock = 0;
    let rw_grif = 0;
    let rw_grif_ru = 0;
    let rw_mega = 0;
    let rw_grif121 = 0;
    
    offers.forEach(offer => {
        const server = offer.server;
        if (server === 'rw-bedrock') rw_bedrock++;
        if (server === 'rw-grif') rw_grif++;
        if (server === 'rw-grif-ru') rw_grif_ru++;
        if (server === 'rw-mega') rw_mega++;
        if (server === 'rw-grif121') rw_grif121++;
    });
    
    const rw1 = document.getElementById('productsCount_rw_bedrock');
    const rw2 = document.getElementById('productsCount_rw_grif');
    const rw3 = document.getElementById('productsCount_rw_grif_ru');
    const rw4 = document.getElementById('productsCount_rw_mega');
    const rw5 = document.getElementById('productsCount_rw_grif121');
    
    if (rw1) rw1.textContent = rw_bedrock;
    if (rw2) rw2.textContent = rw_grif;
    if (rw3) rw3.textContent = rw_grif_ru;
    if (rw4) rw4.textContent = rw_mega;
    if (rw5) rw5.textContent = rw_grif121;
    
    console.log(`📊 ReallyWorld: BEDROCK: ${rw_bedrock}, ГРИФ: ${rw_grif}, ГРИФ(RU): ${rw_grif_ru}, МЕГА: ${rw_mega}, ГРИФ1.21: ${rw_grif121}`);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница выбора сервера ReallyWorld загружена');

    const modeCards = document.querySelectorAll('.mode-card');
    const modeBtns = document.querySelectorAll('.select-mode-btn');

    function selectMode(modeName, modeType) {
        if (modeType === 'bedrock') {
            window.location.href = 'shop-rw-bedrock.html';
        } else if (modeType === 'grif') {
            window.location.href = 'shop-rw-grif.html';
        } else if (modeType === 'grif-ru') {
            window.location.href = 'shop-rw-grif-ru.html';
        } else if (modeType === 'mega') {
            window.location.href = 'shop-rw-mega.html';
        } else if (modeType === 'grif121') {
            window.location.href = 'shop-rw-grif121.html';
        }
    }

    modeCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('select-mode-btn')) return;
            const modeType = this.getAttribute('data-mode');
            selectMode('', modeType);
        });
    });

    modeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const modeCard = this.closest('.mode-card');
            const modeType = modeCard.getAttribute('data-mode');
            selectMode('', modeType);
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