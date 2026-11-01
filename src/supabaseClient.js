import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase Environment Variables!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

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
// 📊 ANALYTICS
// ============================================
export const getAnalytics = async () => {
  const [usersRes, gamesRes, ordersRes, txRes] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('games').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('transactions').select('*', { count: 'exact', head: true }),
  ]);
  return {
    totalUsers: usersRes.count || 0, totalGames: gamesRes.count || 0,
    totalOrders: ordersRes.count || 0, totalTransactions: txRes.count || 0,
  };
};
