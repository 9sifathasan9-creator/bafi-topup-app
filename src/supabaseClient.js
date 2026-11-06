import { createClient } from '@supabase/supabase-js';

// 🔴 এখানে সরাসরি আপনার URL এবং Key বসানো হলো
const supabaseUrl = 'https://oqktbopciovcmhwwzjing.supabase.co';
const supabaseAnonKey = 'sb_publishable_Sk2-W1WuR1Es5d0mvsNBag_VMm7Yfn_';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const ADMIN_EMAIL = '9sifathasan9@gmail.com';

export const doCopy = (text) => {
  if (!text) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
};

function fallbackCopy(text) {
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  try { document.execCommand('copy'); } catch (err) { console.error(err); }
  document.body.removeChild(el);
}

// ============================================
// 🎮 GAMES
// ============================================
export const getGames = async () => {
  const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
};
export const addGame = async (game) => {
  const { data, error } = await supabase.from('games').insert([game]).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};
export const updateGame = async (id, updates) => {
  const { data, error } = await supabase.from('games').update(updates).eq('id', id).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};
export const deleteGame = async (id) => {
  const { error } = await supabase.from('games').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
};

// ============================================
// 📢 NOTICES
// ============================================
export const getNotices = async () => {
  const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
};
export const addNotice = async (notice) => {
  const { data, error } = await supabase.from('notices').insert([notice]).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};
export const updateNotice = async (id, updates) => {
  const { data, error } = await supabase.from('notices').update(updates).eq('id', id).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};
export const deleteNotice = async (id) => {
  const { error } = await supabase.from('notices').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
};

// ============================================
// ⚙️ SETTINGS
// ============================================
export const getSettings = async () => {
  const { data, error } = await supabase.from('settings').select('*').single();
  if (error && error.code !== 'PGRST116') console.error(error);
  return data || { site_name: 'BAFI Topup', contact_email: 'admin@bafi.gd', welcome_message: 'Welcome!' };
};
export const updateSettings = async (updates) => {
  const { data: existing } = await supabase.from('settings').select('id').single();
  if (existing) {
    const { data, error } = await supabase.from('settings').update(updates).eq('id', existing.id).select();
    if (error) { console.error(error); return null; }
    return data?.[0];
  }
  const { data, error } = await supabase.from('settings').insert([updates]).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};

// ============================================
// 👤 PROFILE
// ============================================
export const getProfile = async (userId) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) { console.error(error); return null; }
  return data;
};
export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};

// ============================================
// 💰 WALLET
// ============================================
export const getWallet = async (userId) => {
  const { data, error } = await supabase.from('wallets').select('*').eq('user_id', userId).single();
  if (error && error.code !== 'PGRST116') console.error(error);
  return data || { balance: 0 };
};
export const updateWallet = async (userId, balance) => {
  const { data: existing } = await supabase.from('wallets').select('id').eq('user_id', userId).single();
  if (existing) {
    const { data, error } = await supabase.from('wallets').update({ balance }).eq('user_id', userId).select();
    if (error) { console.error(error); return null; }
    return data?.[0];
  }
  const { data, error } = await supabase.from('wallets').insert([{ user_id: userId, balance }]).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};

// ============================================
// 📜 TRANSACTIONS & ORDERS
// ============================================
export const getTransactions = async (userId) => {
  const { data, error } = await supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
};
export const addTransaction = async (transaction) => {
  const { data, error } = await supabase.from('transactions').insert([transaction]).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};
export const getOrders = async (userId) => {
  const { data, error } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
};
export const getAllOrders = async () => {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
};
export const addOrder = async (order) => {
  const { data, error } = await supabase.from('orders').insert([order]).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};
export const updateOrder = async (id, updates) => {
  const { data, error } = await supabase.from('orders').update(updates).eq('id', id).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};

// ============================================
// ⭐ REVIEWS
// ============================================
export const getReviews = async (gameId) => {
  const { data, error } = await supabase.from('reviews').select('*').eq('game_id', gameId).order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
};
export const addReview = async (review) => {
  const { data, error } = await supabase.from('reviews').insert([review]).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};
export const deleteReview = async (id) => {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
};

// ============================================
// 💬 SUPPORT TICKETS
// ============================================
export const getTickets = async (userId) => {
  const { data, error } = await supabase.from('tickets').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
};
export const addTicket = async (ticket) => {
  const { data, error } = await supabase.from('tickets').insert([ticket]).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};
export const updateTicketStatus = async (id, status) => {
  const { data, error } = await supabase.from('tickets').update({ status }).eq('id', id).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};

// ============================================
// 🎟️ COUPONS
// ============================================
export const getCoupons = async () => {
  const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
};
export const validateCoupon = async (code) => {
  const { data, error } = await supabase.from('coupons').select('*').eq('code', code).eq('active', true).single();
  if (error) return null;
  return data;
};
export const addCoupon = async (coupon) => {
  const { data, error } = await supabase.from('coupons').insert([coupon]).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};

// ============================================
// ❤️ FAVORITES
// ============================================
export const getFavorites = async (userId) => {
  const { data, error } = await supabase.from('favorites').select('*').eq('user_id', userId);
  if (error) { console.error(error); return []; }
  return data || [];
};
export const toggleFavorite = async (userId, gameId) => {
  const { data: existing } = await supabase.from('favorites').select('id').eq('user_id', userId).eq('game_id', gameId).single();
  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id);
    return false;
  }
  await supabase.from('favorites').insert([{ user_id: userId, game_id: gameId }]);
  return true;
};
