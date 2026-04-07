import { supabase } from './supabase.js';
import { getMultipleSellersRatings } from './rating.js';

// Загрузка предложений с сортировкой по рейтингу
export async function loadOffersFromSupabase(category = null, server = null, sortByRating = true) {
    let query = supabase
        .from('offers')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
    
    if (category && category !== 'all') {
        query = query.eq('category', category);
    }
    
    if (server) {
        query = query.eq('server', server);
    }
    
    const { data, error } = await query;
    
    if (error) {
        console.error('Ошибка загрузки:', error);
        return [];
    }
    
    if (!data || data.length === 0) {
        return [];
    }
    
    // Сортируем по рейтингу продавца
    if (sortByRating) {
        // Получаем всех уникальных продавцов
        const sellerIds = [...new Set(data.map(offer => offer.user_id))];
        const ratings = await getMultipleSellersRatings(sellerIds);
        
        // Добавляем рейтинг к каждому предложению
        const offersWithRating = data.map(offer => ({
            ...offer,
            rating: ratings[offer.user_id]?.rating || 0,
            ratingCount: ratings[offer.user_id]?.count || 0
        }));
        
        // Сортируем: сначала высокий рейтинг, потом по дате
        offersWithRating.sort((a, b) => {
            if (b.rating !== a.rating) {
                return b.rating - a.rating;
            }
            return new Date(b.created_at) - new Date(a.created_at);
        });
        
        return offersWithRating;
    }
    
    return data;
}

// Загрузка моих предложений (без сортировки по рейтингу)
export async function loadMyOffersFromSupabase() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return [];
    }
    
    const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Ошибка загрузки моих объявлений:', error);
        return [];
    }
    
    return data || [];
}