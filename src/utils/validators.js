// ============================================
// ✅ Validation Functions
// ============================================
// সব ভ্যালিডেশনের ফাংশন এখানে

// ============================================
// 📧 Email Validation
// ============================================
export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim().toLowerCase());
};

// ============================================
// 📱 Phone Validation (Bangladesh)
// ============================================
export const isValidPhone = (phone) => {
  if (!phone) return false;
  // বাংলাদেশি ফোন: 01XXXXXXXXX (১১ ডিজিট)
  const regex = /^(?:\+?88)?01[3-9]\d{8}$/;
  return regex.test(phone.replace(/[\s-]/g, ''));
};

// ============================================
// 🔐 Password Validation
// ============================================
export const isValidPassword = (password) => {
  if (!password) return false;
  // কমপক্ষে ৬ অক্ষর
  return password.length >= 6;
};

export const isStrongPassword = (password) => {
  if (!password) return false;
  // কমপক্ষে ৮ অক্ষর, বড় হাতের, ছোট হাতের, সংখ্যা
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'none', color: 'gray' };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'weak', color: 'red' };
  if (score <= 4) return { score, label: 'medium', color: 'yellow' };
  if (score <= 5) return { score, label: 'strong', color: 'green' };
  return { score, label: 'very-strong', color: 'green' };
};

// ============================================
// 👤 Name Validation
// ============================================
export const isValidName = (name) => {
  if (!name) return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
};

export const isValidUsername = (username) => {
  if (!username) return false;
  // ৩-২০ অক্ষর, শুধু letter, number, underscore
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
};

// ============================================
// 🔢 Number Validation
// ============================================
export const isValidNumber = (value) => {
  if (value === null || value === undefined || value === '') return false;
  return !isNaN(value) && isFinite(value);
};

export const isValidPositiveNumber = (value) => {
  if (!isValidNumber(value)) return false;
  return Number(value) > 0;
};

export const isValidPrice = (price) => {
  if (!isValidNumber(price)) return false;
  const num = Number(price);
  return num > 0 && num <= 1000000;
};

export const isValidQuantity = (qty) => {
  if (!isValidNumber(qty)) return false;
  const num = Number(qty);
  return Number.isInteger(num) && num > 0 && num <= 999;
};

// ============================================
// 🎮 Game Validation
// ============================================
export const isValidGameData = (game) => {
  const errors = {};

  if (!game.name || !isValidName(game.name)) {
    errors.name = 'Game name is required (2-100 characters)';
  }

  if (!game.price || !isValidPrice(game.price)) {
    errors.price = 'Valid price is required (0-1,000,000)';
  }

  if (game.icon && game.icon.length > 10) {
    errors.icon = 'Icon should be a single emoji';
  }

  if (game.description && game.description.length > 500) {
    errors.description = 'Description max 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================
// 📢 Notice Validation
// ============================================
export const isValidNoticeData = (notice) => {
  const errors = {};

  if (!notice.title || notice.title.trim().length < 3) {
    errors.title = 'Title is required (min 3 characters)';
  }

  if (notice.title && notice.title.length > 100) {
    errors.title = 'Title max 100 characters';
  }

  if (!notice.content || notice.content.trim().length < 5) {
    errors.content = 'Content is required (min 5 characters)';
  }

  if (notice.content && notice.content.length > 1000) {
    errors.content = 'Content max 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================
// 🔐 Login Validation
// ============================================
export const isValidLoginData = (email, password) => {
  const errors = {};

  if (!email || !isValidEmail(email)) {
    errors.email = 'Valid email is required';
  }

  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================
// 📝 Registration Validation
// ============================================
export const isValidRegistrationData = (data) => {
  const errors = {};

  if (!data.fullName || !isValidName(data.fullName)) {
    errors.fullName = 'Full name is required (2-100 characters)';
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Valid email is required';
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.phone = 'Valid Bangladeshi phone number required';
  }

  if (!data.password || !isValidPassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================
// 📋 Form Field Validation
// ============================================
export const validateField = (field, value, rules = {}) => {
  const errors = [];

  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push(`${field} is required`);
    return errors;
  }

  if (!value) return errors;

  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`${field} must be at least ${rules.minLength} characters`);
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`${field} must be at most ${rules.maxLength} characters`);
  }

  if (rules.isEmail && !isValidEmail(value)) {
    errors.push('Invalid email format');
  }

  if (rules.isPhone && !isValidPhone(value)) {
    errors.push('Invalid phone number');
  }

  if (rules.isNumber && !isValidNumber(value)) {
    errors.push('Must be a number');
  }

  if (rules.min !== undefined && Number(value) < rules.min) {
    errors.push(`Must be at least ${rules.min}`);
  }

  if (rules.max !== undefined && Number(value) > rules.max) {
    errors.push(`Must be at most ${rules.max}`);
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push(rules.patternMessage || 'Invalid format');
  }

  return errors;
};

// ============================================
// 🎟️ Coupon Validation
// ============================================
export const isValidCouponCode = (code) => {
  if (!code) return false;
  // 3-20 অক্ষর, A-Z, 0-9
  const regex = /^[A-Z0-9]{3,20}$/i;
  return regex.test(code.trim());
};

// ============================================
// 💳 Payment Validation
// ============================================
export const isValidAmount = (amount) => {
  if (!isValidNumber(amount)) return false;
  const num = Number(amount);
  // সর্বনিম্ন ১০ টাকা, সর্বোচ্চ ১,০০,০০০ টাকা
  return num >= 10 && num <= 100000;
};

export const isValidTransactionId = (txId) => {
  if (!txId) return false;
  return txId.trim().length >= 5 && txId.trim().length <= 50;
};

// ============================================
// 🖼️ File Validation
// ============================================
export const isValidImageFile = (file) => {
  if (!file) return false;
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  return validTypes.includes(file.type) && file.size <= maxSize;
};

export const getFileError = (file) => {
  if (!file) return 'No file selected';
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return 'Only JPG, PNG, WEBP, GIF allowed';
  }
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return 'File size must be less than 5MB';
  }
  return null;
};

// ============================================
// 🔍 Search Validation
// ============================================
export const isValidSearchQuery = (query) => {
  if (!query) return false;
  const trimmed = query.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
};

// ============================================
// 📝 Review Validation
// ============================================
export const isValidReview = (review) => {
  const errors = {};

  if (!review.rating || review.rating < 1 || review.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  }

  if (!review.comment || review.comment.trim().length < 3) {
    errors.comment = 'Review must be at least 3 characters';
  }

  if (review.comment && review.comment.length > 500) {
    errors.comment = 'Review max 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================
// 🎫 Support Ticket Validation
// ============================================
export const isValidTicket = (ticket) => {
  const errors = {};

  if (!ticket.subject || ticket.subject.trim().length < 5) {
    errors.subject = 'Subject must be at least 5 characters';
  }

  if (!ticket.message || ticket.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================
// 🔗 URL Validation
// ============================================
export const isValidURL = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidImageURL = (url) => {
  if (!isValidURL(url)) return false;
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
};