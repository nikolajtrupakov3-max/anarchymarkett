// AnarchyMarket - Выбор сервера
import { supabase } from './js/supabase.js';

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Сайт выбора сервера загружен!');

    // === ОБНОВЛЕНИЕ UI (АВАТАРКА / КНОПКИ) ===
    async function updateAuthUI() {
        const { data: { user } } = await supabase.auth.getUser();
        const authButtons = document.getElementById('authButtons');
        const userProfile = document.getElementById('userProfile');
        const userAvatar = document.getElementById('userAvatar');
        
        console.log('updateAuthUI вызван, user:', user ? user.email : 'null');
        
        if (user) {
            if (authButtons) authButtons.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'flex';
                const avatarLetter = (user.user_metadata?.username?.[0] || user.email?.[0] || 'U').toUpperCase();
                if (userAvatar) userAvatar.textContent = avatarLetter;
                console.log('Аватарка показана, буква:', avatarLetter);
            }
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
            console.log('Кнопки входа показаны');
        }
    }
    
    await updateAuthUI();

    // === ВЫПАДАЮЩЕЕ МЕНЮ ===
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
    
    // === КНОПКА ВЫХОДА ===
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.location.href = 'index.html';
        });
    }

    // === ПЕРЕХОДЫ НА СЕРВЕРА ===
    const serverCards = document.querySelectorAll('.server-card');
    const selectBtns = document.querySelectorAll('.select-server-btn');

    function selectServer(serverName) {
        console.log(`Выбран сервер: ${serverName}`);
        
        if (serverName === 'ReallyWorld') {
            window.location.href = 'reallyworld-mode.html';
        } else if (serverName === 'FunTime') {
            window.location.href = 'funtime-mode.html';
        } else if (serverName === 'HolyWorld') {
            window.location.href = 'holyworld-mode.html';
        }
    }

    serverCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('select-server-btn')) {
                return;
            }
            const serverName = this.querySelector('.server-name').textContent;
            selectServer(serverName);
        });
    });

    selectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const serverCard = this.closest('.server-card');
            const serverName = serverCard.querySelector('.server-name').textContent;
            selectServer(serverName);
        });
    });

    // === МОДАЛЬНОЕ ОКНО ПОДДЕРЖКИ ===
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
                console.log('Модальное окно закрыто крестиком');
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
            const tgUsername = document.getElementById('telegramUsername');
            if (tgUsername) {
                navigator.clipboard.writeText(tgUsername.textContent);
                alert('✅ Username скопирован: ' + tgUsername.textContent);
            }
        });
    }
    
    // === УВЕДОМЛЕНИЯ О НОВЫХ СООБЩЕНИЯХ ===
    async function checkUnreadMessages() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data, error } = await supabase
            .from('messages')
            .select('id')
            .eq('receiver_id', user.id)
            .eq('is_read', false);
        
        if (error) {
            console.error('Ошибка проверки уведомлений:', error);
            return;
        }
        
        const hasUnread = data && data.length > 0;
        const userAvatarContainer = document.querySelector('.user-profile');
        
        if (userAvatarContainer) {
            const oldDot = document.querySelector('.notification-dot');
            if (oldDot) oldDot.remove();
            
            if (hasUnread) {
                const dot = document.createElement('span');
                dot.className = 'notification-dot';
                userAvatarContainer.style.position = 'relative';
                userAvatarContainer.appendChild(dot);
            }
        }
    }
    
    setInterval(checkUnreadMessages, 10000);
    checkUnreadMessages();
    
});