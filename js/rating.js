import { supabase } from './supabase.js';

// Получить средний рейтинг продавца
export async function getSellerRating(sellerId) {
    const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('seller_id', sellerId);
    
    if (error || !data || data.length === 0) {
        return { rating: 0, count: 0 };
    }
    
    const sum = data.reduce((acc, r) => acc + r.rating, 0);
    const avg = sum / data.length;
    
    return {
        rating: Math.round(avg * 10) / 10,
        count: data.length
    };
}

// Получить рейтинг для нескольких продавцов сразу
export async function getMultipleSellersRatings(sellerIds) {
    const uniqueIds = [...new Set(sellerIds)];
    const ratings = {};
    
    for (const id of uniqueIds) {
        ratings[id] = await getSellerRating(id);
    }
    
    return ratings;
}

// Отобразить звёзды рейтинга
export function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<span class="star filled">★</span>';
    }
    if (hasHalfStar) {
        starsHtml += '<span class="star half">½</span>';
    }
    for (let i = starsHtml.length / 2; i < 5 - (hasHalfStar ? 1 : 0); i++) {
        starsHtml += '<span class="star">★</span>';
    }
    
    return starsHtml;
}