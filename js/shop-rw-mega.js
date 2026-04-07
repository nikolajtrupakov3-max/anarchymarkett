// Скрипт для магазина ReallyWorld - МЕГА ГРИФ
import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('ReallyWorld - МЕГА ГРИФ загружен');

    async function updateAuthUI() {
        const { data: { user } } = await supabase.auth.getUser();
        const authButtons = document.getElementById('authButtons');
        const userProfile = document.getElementById('userProfile');
        const userAvatar = document.getElementById('userAvatar');
        
        if (user) {
            if (authButtons) authButtons.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'flex';
                const avatarLetter = (user.user_metadata?.username?.[0] || user.email?.[0] || 'U').toUpperCase();
                if (userAvatar) userAvatar.textContent = avatarLetter;
            }
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
        }
    }
    
    updateAuthUI();
    
    const userAvatar = document.getElementById('userAvatar');
    const userDropdown = document.getElementById('userDropdown');
    if (userAvatar && userDropdown) {
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        document.addEventListener('click', () => {
            userDropdown.classList.remove('show');
        });
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.location.href = 'index.html';
        });
    }

    const categoryCards = document.querySelectorAll('.category-card');
    const categoryBtns = document.querySelectorAll('.select-category-btn');

    function selectCategory(categoryName, categoryId) {
        window.location.href = `category.html?category=${categoryId}&server=rw-mega`;
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