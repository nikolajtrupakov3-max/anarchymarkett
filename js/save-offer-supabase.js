import { supabase } from './supabase.js';

export async function saveOfferToSupabase(offerData) {
    // Получаем текущего пользователя
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { success: false, error: 'Пользователь не авторизован' };
    }
    
    const { data, error } = await supabase
        .from('offers')
        .insert([
            {
                name: offerData.name,
                description: offerData.description,
                price: parseInt(offerData.price),
                seller: offerData.seller,
                contact: offerData.contact || 'Через сайт',
                category: offerData.category,
                server: offerData.server,
                status: 'active',
                user_id: user.id  // ← ПРИВЯЗКА К АККАУНТУ
            }
        ]);
    
    if (error) {
        console.error('Ошибка сохранения:', error);
        return { success: false, error: error.message };
    }
    
    console.log('Предложение сохранено!', data);
    return { success: true, data };
}