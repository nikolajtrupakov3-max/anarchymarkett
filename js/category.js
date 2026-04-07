// Скрипт для страницы категории
import { supabase } from './supabase.js';
import { loadOffersFromSupabase } from './load-offers-supabase.js';
import { saveOfferToSupabase } from './save-offer-supabase.js';

document.addEventListener('DOMContentLoaded', function() {
    
    // === КОД ДЛЯ АВАТАРКИ ===
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
    // === КОНЕЦ КОДА ДЛЯ АВАТАРКИ ===
    
    // ОПРЕДЕЛЯЕМ, С КАКОГО СЕРВЕРА ПРИШЛИ (СНАЧАЛА ЭТО!)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    const server = urlParams.get('server') || 'reallyworld';
    const mode = urlParams.get('mode') || '';
    
    // ПОЛУЧАЕМ НАЗВАНИЕ СЕРВЕРА ДЛЯ ОТОБРАЖЕНИЯ (ИСПРАВЛЕНО!)
    let serverName = '';
    let serverIcon = '';
    
    if (server === 'funtime') {
        serverName = 'FunTime';
        serverIcon = '🎮';
    } else if (server === 'funtime-1_16') {
        serverName = 'FunTime 1.16.5';
        serverIcon = '⚙️';
    } else if (server === 'funtime-1_21') {
        serverName = 'FunTime 1.21';
        serverIcon = '🚀';
    } else if (server === 'holyworld-classic') {
        serverName = 'HolyWorld Classic';
        serverIcon = '⚔️';
    } else if (server === 'holyworld-lite') {
        serverName = 'HolyWorld Lite';
        serverIcon = '🍃';
    } else if (server === 'holyworld' && mode === 'lite') {
        serverName = 'HolyWorld Lite';
        serverIcon = '🍃';
    } else if (server === 'holyworld' && mode === 'classic') {
        serverName = 'HolyWorld Classic';
        serverIcon = '⚔️';
    } else if (server === 'holyworld') {
        serverName = 'HolyWorld';
        serverIcon = '🏆';
    } else if (server === 'rw-bedrock') {
        serverName = 'ReallyWorld BEDROCK';
        serverIcon = '🪨';
    } else if (server === 'rw-grif') {
        serverName = 'ReallyWorld ГРИФ';
        serverIcon = '⚔️';
    } else if (server === 'rw-grif-ru') {
        serverName = 'ReallyWorld ГРИФ (RU)';
        serverIcon = '🇷🇺';
    } else if (server === 'rw-mega') {
        serverName = 'ReallyWorld МЕГА ГРИФ';
        serverIcon = '💀';
    } else if (server === 'rw-grif121') {
        serverName = 'ReallyWorld ГРИФ 1.21';
        serverIcon = '🚀';
    } else {
        serverName = 'ReallyWorld';
        serverIcon = '🌍';
    }
    
    // Переменная для текущего типа сортировки
    let currentSort = 'rating';
    
    // МЕНЯЕМ ФОН В ЗАВИСИМОСТИ ОТ СЕРВЕРА И РЕЖИМА
    const body = document.getElementById('categoryPage');
    if (body) {
        body.classList.remove('category-page', 'funtime-page', 'shop-page', 'holyworld-lite-category', 'holyworld-classic-category');
        
        if (server === 'funtime') {
            body.classList.add('funtime-page');
        } else if (server === 'holyworld' && mode === 'lite') {
            body.classList.add('holyworld-lite-category');
        } else if (server === 'holyworld' && mode === 'classic') {
            body.classList.add('holyworld-classic-category');
        } else if (server === 'holyworld') {
            body.classList.add('holyworld-classic-category');
        } else {
            body.classList.add('shop-page');
        }
    }
    
    // Устанавливаем правильную ссылку для кнопки "Назад"
    const backLink = document.getElementById('backLink');
    if (backLink) {
        if (server === 'funtime') {
            backLink.href = 'shop-funtime.html';
        } else if (server === 'holyworld' && mode === 'lite') {
            backLink.href = 'shop-holyworld-lite.html';
        } else if (server === 'holyworld' && mode === 'classic') {
            backLink.href = 'shop-holyworld-classic.html';
        } else if (server === 'holyworld') {
            backLink.href = 'shop-holyworld-classic.html';
        } else {
            backLink.href = 'shop.html';
        }
    }
    
    // Названия категорий для отображения
    const categoryNames = {
        resources: 'Блоки и ресурсы',
        weapons: 'Оружие',
        armor: 'Броня',
        potions: 'Зелья и еда',
        rare: 'Редкие предметы',
        other: 'Другое'
    };
    
    const categoryDescriptions = {
        resources: 'Алмазы, незерит, редкие руды',
        weapons: 'Мечи, луки, топоры с зачарованиями',
        armor: 'Незеритовая броня, зачарования',
        potions: 'Зелья силы, регенерации, золотые яблоки',
        rare: 'Элитры, тотемы, спавнеры',
        other: 'Всё остальное'
    };
    
    const categoryIcons = {
        resources: '💎',
        weapons: '⚔️',
        armor: '🛡️',
        potions: '🧪',
        rare: '📜',
        other: '📦'
    };
    
    // Обновляем заголовок страницы
    const categoryIcon = document.getElementById('categoryIcon');
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryDescription = document.getElementById('categoryDescription');
    const serverBadge = document.getElementById('serverBadge');
    
    if (categoryIcon) categoryIcon.textContent = categoryIcons[categoryId] || '📦';
    if (categoryTitle) categoryTitle.textContent = categoryNames[categoryId] || 'Категория';
    if (categoryDescription) categoryDescription.textContent = categoryDescriptions[categoryId] || 'Товары';
    
    // Добавляем название сервера в бейдж
    if (serverBadge) {
        serverBadge.innerHTML = `${serverIcon} ${serverName}`;
        console.log('Бейдж обновлён:', serverBadge.innerHTML);
    }
    
    // Обновляем заголовок вкладки браузера
    document.title = `${serverName} - ${categoryNames[categoryId] || 'Категория'} | AnarchyMarket`;
    
    // Элементы для переключения секций
    const offersSection = document.getElementById('offersSection');
    const createOfferSection = document.getElementById('createOfferSection');
    
    // Функция для безопасного вывода текста
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // Функция отображения звёзд рейтинга
    function renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let starsHtml = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<span class="star-filled">★</span>';
        }
        if (hasHalfStar) {
            starsHtml += '<span class="star-half">½</span>';
        }
        for (let i = starsHtml.length / 2; i < 5 - (hasHalfStar ? 1 : 0); i++) {
            starsHtml += '<span class="star-empty">★</span>';
        }
        return starsHtml;
    }
    
    // Функция отображения предложений
    function renderOffers(offers) {
        const offersGrid = document.getElementById('offersGrid');
        if (!offersGrid) return;
        offersGrid.innerHTML = '';
        
        if (offers.length === 0) {
            offersGrid.innerHTML = '<div class="no-offers">😕 Пока нет предложений. Будьте первым!</div>';
            return;
        }
        
        offers.forEach(offer => {
            const rating = offer.rating || 0;
            const ratingCount = offer.ratingCount || 0;
            const starsHtml = renderStars(rating);
            
            const offerCard = document.createElement('div');
            offerCard.className = 'offer-card';
            offerCard.innerHTML = `
                <div class="offer-header">
                    <h3>${escapeHtml(offer.name)}</h3>
                </div>
                <div class="offer-description">${escapeHtml(offer.description || '')}</div>
                <div class="offer-price">💰 ${offer.price} ₽</div>
                <div class="offer-seller">📛 Продавец: ${escapeHtml(offer.seller)}</div>
                <div class="offer-rating">
                    <span class="rating-stars">${starsHtml}</span>
                    <span class="rating-value">${rating.toFixed(1)}</span>
                    <span class="rating-count">(${ratingCount} отзывов)</span>
                </div>
                <button class="buy-offer-btn" data-offer-id="${offer.id}" data-price="${offer.price}" data-name="${escapeHtml(offer.name)}" data-seller="${escapeHtml(offer.seller)}" data-seller-id="${offer.user_id}">🛒 Купить</button>
            `;
            offersGrid.appendChild(offerCard);
        });
        
        document.querySelectorAll('.buy-offer-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const offerId = this.getAttribute('data-offer-id');
                const productName = this.getAttribute('data-name');
                const price = this.getAttribute('data-price');
                const seller = this.getAttribute('data-seller');
                const sellerId = this.getAttribute('data-seller-id');
                
                window.location.href = `chat.html?user_id=${sellerId}&name=${encodeURIComponent(seller)}&offer_id=${offerId}&product=${encodeURIComponent(productName)}&price=${price}`;
            });
        });
    }
    
    // Загрузка предложений из Supabase с учётом сортировки
    async function loadAndRenderOffers() {
        const sortByRating = (currentSort === 'rating');
        const offers = await loadOffersFromSupabase(categoryId, server, sortByRating);
        renderOffers(offers);
    }
    
    // Кнопка "Просмотреть все предложения"
    const viewOffersBtn = document.getElementById('viewOffersBtn');
    if (viewOffersBtn) {
        viewOffersBtn.addEventListener('click', async function() {
            if (offersSection) offersSection.style.display = 'block';
            if (createOfferSection) createOfferSection.style.display = 'none';
            
            const sortButtons = document.getElementById('sortButtons');
            if (sortButtons) sortButtons.style.display = 'flex';
            
            await loadAndRenderOffers();
        });
    }
    
    // Кнопка "Создать предложение"
    const createOfferBtn = document.getElementById('createOfferBtn');
    if (createOfferBtn) {
        createOfferBtn.addEventListener('click', function() {
            if (createOfferSection) createOfferSection.style.display = 'block';
            if (offersSection) offersSection.style.display = 'none';
            
            const sortButtons = document.getElementById('sortButtons');
            if (sortButtons) sortButtons.style.display = 'none';
        });
    }
    
    // Кнопка отмены
    const cancelOfferBtn = document.getElementById('cancelOfferBtn');
    if (cancelOfferBtn) {
        cancelOfferBtn.addEventListener('click', function() {
            if (createOfferSection) createOfferSection.style.display = 'none';
        });
    }
    
    // Обработчики кнопок сортировки
    const sortBtns = document.querySelectorAll('.sort-btn');
    if (sortBtns.length > 0) {
        sortBtns.forEach(btn => {
            btn.addEventListener('click', async function() {
                sortBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentSort = this.getAttribute('data-sort');
                await loadAndRenderOffers();
            });
        });
    }
    
    // СОЗДАНИЕ ПРЕДЛОЖЕНИЯ
    const submitOfferBtn = document.getElementById('submitOfferBtn');
    if (submitOfferBtn) {
        submitOfferBtn.addEventListener('click', async function() {
            const itemNameInput = document.getElementById('itemName');
            const itemDescriptionInput = document.getElementById('itemDescription');
            const itemPriceInput = document.getElementById('itemPrice');
            
            if (!itemNameInput || !itemDescriptionInput || !itemPriceInput) {
                alert('❌ Ошибка: не все поля найдены на странице!');
                return;
            }
            
            const itemName = itemNameInput.value;
            const itemDescription = itemDescriptionInput.value;
            const itemPrice = itemPriceInput.value;
            
            if (!itemName || !itemDescription || !itemPrice) {
                alert('❌ Заполните все поля!');
                return;
            }
            
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                alert('❌ Вы не авторизованы! Пожалуйста, войдите в аккаунт.');
                return;
            }
            
            const loggedInUsername = user.user_metadata?.username || user.email;
            
            const offerData = {
                name: itemName,
                description: itemDescription,
                price: parseInt(itemPrice),
                seller: loggedInUsername,
                contact: 'Через сайт',
                category: categoryId,
                server: server,
                user_id: user.id
            };
            
            const result = await saveOfferToSupabase(offerData);
            
            if (result.success) {
                alert(`✅ Ваше предложение сохранено!\n\n📦 Товар: ${itemName}\n💰 Цена: ${itemPrice} ₽`);
                
                itemNameInput.value = '';
                itemDescriptionInput.value = '';
                itemPriceInput.value = '';
                
                if (createOfferSection) createOfferSection.style.display = 'none';
            } else {
                alert(`❌ Ошибка сохранения: ${result.error}`);
            }
        });
    }

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
            const tgUsername = document.getElementById('telegramUsername');
            if (tgUsername) {
                navigator.clipboard.writeText(tgUsername.textContent);
                alert('✅ Username скопирован: ' + tgUsername.textContent);
            }
        });
    }
    
});