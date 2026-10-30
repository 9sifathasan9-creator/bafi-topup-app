// ============================================
// 🎨 Formatter Functions
// ============================================
// সব ফরম্যাটিং ফাংশন এখানে (তারিখ, টাকা, ইত্যাদি)

// ============================================
// 💰 Currency Formatter
// ============================================
export const formatCurrency = (amount, currency = '৳') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency}0`;
  }
  const num = Number(amount);
  return `${currency}${num.toLocaleString('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export const formatBDT = (amount) => {
  if (!amount && amount !== 0) return '৳0';
  const num = Number(amount);
  return `৳${num.toLocaleString('en-BD')}`;
};

export const formatUSD = (amount) => {
  if (!amount && amount !== 0) return '$0';
  const num = Number(amount);
  return `$${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// ============================================
// 🔢 Number Formatter
// ============================================
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-US');
};

export const formatCompactNumber = (num) => {
  if (!num) return '0';
  const n = Number(num);
  if (n >= 1000000000) return `${(n / 1000000000).toFixed(1)}B`;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

// ============================================
// 📅 Date Formatter
// ============================================
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

export const formatDateLong = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const formatDateShort = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

// ============================================
// ⏰ Time Formatter
// ============================================
export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours || 12;
  
  return `${hours}:${minutes} ${ampm}`;
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return `${formatDate(date)} ${formatTime(date)}`;
};

// ============================================
// ⏱️ Relative Time (কতক্ষণ আগে)
// ============================================
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 30) return 'just now';
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

// ============================================
// 📱 Phone Formatter
// ============================================
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  // বাংলাদেশি ফোন: 01XXXXXXXXX
  if (cleaned.length === 11 && cleaned.startsWith('01')) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // +880 সহ
  if (cleaned.length === 13 && cleaned.startsWith('880')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }
  
  return phone;
};

// ============================================
// 🔤 Text Formatter
// ============================================
export const formatTruncate = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

export const formatTextCase = (text, type = 'sentence') => {
  if (!text) return '';
  
  switch (type) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\w\S*/g, (word) =>
        word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
      );
    case 'sentence':
    default:
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
};

export const formatName = (name) => {
  if (!name) return '';
  return name
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// ============================================
// 📧 Email Formatter
// ============================================
export const formatEmailDisplay = (email, maxLength = 30) => {
  if (!email) return '';
  if (email.length <= maxLength) return email;
  
  const [name, domain] = email.split('@');
  const availableNameLength = maxLength - domain.length - 4; // @ + ... + domain
  
  if (availableNameLength < 3) {
    return email.substring(0, maxLength - 3) + '...';
  }
  
  return `${name.substring(0, availableNameLength)}...@${domain}`;
};

// ============================================
// 🎯 Status Formatter
// ============================================
export const formatStatus = (status) => {
  if (!status) return '';
  const statusMap = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    failed: 'Failed',
    active: 'Active',
    inactive: 'Inactive',
    online: 'Online',
    offline: 'Offline',
    open: 'Open',
    closed: 'Closed',
  };
  return statusMap[status.toLowerCase()] || formatTextCase(status, 'title');
};

// ============================================
// 📦 File Size Formatter
// ============================================
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(2);
  
  return `${size} ${sizes[i]}`;
};

// ============================================
// 🆔 ID Formatter
// ============================================
export const formatOrderId = (id) => {
  if (!id) return '';
  const str = String(id);
  if (str.length > 8) return `#${str.slice(-8).toUpperCase()}`;
  return `#${str.toUpperCase()}`;
};

export const formatTransactionId = (id) => {
  if (!id) return '';
  const str = String(id);
  if (str.length <= 12) return str.toUpperCase();
  return `${str.slice(0, 6)}...${str.slice(-6)}`;
};

// ============================================
// 🎮 Game Formatter
// ============================================
export const formatGamePrice = (price, currency = '৳') => {
  if (!price && price !== 0) return `${currency}0`;
  return `${currency}${Number(price).toLocaleString('en-BD')}`;
};

export const formatGameName = (name) => {
  if (!name) return '';
  return name.length > 30 ? `${name.substring(0, 30)}...` : name;
};

// ============================================
// 📊 Stats Formatter
// ============================================
export const formatStats = (value) => {
  if (value === null || value === undefined) return '0';
  const num = Number(value);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

// ============================================
// ⭐ Rating Formatter
// ============================================
export const formatRating = (rating) => {
  if (!rating) return '0.0';
  return Number(rating).toFixed(1);
};

export const formatRatingCount = (count) => {
  if (!count) return '0 reviews';
  if (count === 1) return '1 review';
  return `${formatCompactNumber(count)} reviews`;
};

// ============================================
// 📍 Address Formatter
// ============================================
export const formatAddress = (address) => {
  if (!address) return '';
  if (typeof address === 'string') return address;
  
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ].filter(Boolean);
  
  return parts.join(', ');
};