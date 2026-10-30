// ============================================
// 🛠️ Helper Functions
// ============================================
// সব সাধারণ কাজের ফাংশন এখানে

// ============================================
// ⏱️ Delay / Sleep
// ============================================
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// 🔢 Random ID Generator
// ============================================
export const generateId = (prefix = '') => {
  const random = Math.random().toString(36).substr(2, 9);
  const timestamp = Date.now().toString(36);
  return `${prefix}${timestamp}${random}`;
};

// ============================================
// 📋 Debounce (ইনপুট দেরিতে প্রসেস)
// ============================================
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// ============================================
// ⚡ Throttle (নির্দিষ্ট সময়ে একবার)
// ============================================
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ============================================
// 📋 Copy to Clipboard
// ============================================
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
};

// ============================================
// 📥 Download File
// ============================================
export const downloadFile = (content, filename, type = 'text/plain') => {
  try {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Download failed:', err);
    return false;
  }
};

// ============================================
// 📊 Export JSON
// ============================================
export const exportToJSON = (data, filename = 'data.json') => {
  const json = JSON.stringify(data, null, 2);
  return downloadFile(json, filename, 'application/json');
};

// ============================================
// 📊 Export CSV
// ============================================
export const exportToCSV = (data, filename = 'data.csv') => {
  if (!data || data.length === 0) return false;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          // কমা থাকলে quotes দিয়ে মুড়ে দিই
          return stringValue.includes(',')
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
        })
        .join(',')
    ),
  ];

  return downloadFile(csvRows.join('\n'), filename, 'text/csv');
};

// ============================================
// 🔤 String Helpers
// ============================================
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str, length = 50) => {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ============================================
// 🔢 Number Helpers
// ============================================
export const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

// ============================================
// 📅 Date Helpers
// ============================================
export const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

export const getDaysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2 - d1);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

// ============================================
// 🎨 Color Helpers
// ============================================
export const getStatusColor = (status) => {
  const colors = {
    pending: 'yellow',
    processing: 'blue',
    completed: 'green',
    cancelled: 'red',
    failed: 'red',
    active: 'green',
    inactive: 'gray',
    online: 'green',
    offline: 'red',
  };
  return colors[status?.toLowerCase()] || 'gray';
};

// ============================================
// 🔍 Array Helpers
// ============================================
export const uniqueBy = (arr, key) => {
  return arr.filter((item, index, self) =>
    index === self.findIndex((t) => t[key] === item[key])
  );
};

export const groupBy = (arr, key) => {
  return arr.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
};

export const shuffle = (arr) => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// ============================================
// 📱 Device Helpers
// ============================================
export const isMobile = () => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isOnline = () => {
  return navigator.onLine;
};

// ============================================
// 🔐 Security Helpers
// ============================================
export const maskEmail = (email) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  const maskedName = name.substring(0, 3) + '***';
  return `${maskedName}@${domain}`;
};

export const maskPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{3})\d{4}(\d+)/, '$1****$2');
};

// ============================================
// 🎯 Storage Helpers
// ============================================
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};