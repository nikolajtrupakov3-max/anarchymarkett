import { supabase } from './supabase.js';

// Добавить отзыв
export async function addReview(offerId, sellerId, rating, comment) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { success: false, error: 'Вы не авторизованы' };
    }
    
    // Проверяем, не оставлял ли уже отзыв
    const { data: existing } = await supabase
        .from('reviews')
        .select('id')
        .eq('offer_id', offerId)
        .eq('buyer_id', user.id);
    
    if (existing && existing.length > 0) {
        return { success: false, error: 'Вы уже оставили отзыв на это объявление' };
    }
    
    const { data, error } = await supabase
        .from('reviews')
        .insert([
            {
                offer_id: offerId,
                seller_id: sellerId,
                buyer_id: user.id,
                rating: rating,
                comment: comment
            }
        ]);
    
    if (error) {
        console.error('Ошибка добавления отзыва:', error);
        return { success: false, error: error.message };
    }
    
    return { success: true, data };
}

// Получить отзывы продавца
export async function getSellerReviews(sellerId) {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Ошибка загрузки отзывов:', error);
        return [];
    }
    
    return data || [];
}

// Получить средний рейтинг продавца
export async function getSellerRating(sellerId) {
    const reviews = await getSellerReviews(sellerId);
    
    if (reviews.length === 0) {
        return { rating: 0, count: 0 };
    }
    
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = sum / reviews.length;
    
    return {
        rating: Math.round(avg * 10) / 10,
        count: reviews.length
    };
}