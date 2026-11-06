// ============================================
// 🌐 API Client
// ============================================
// সব HTTP রিকোয়েস্টের জন্য generic wrapper
// Payment, Email, SMS API তে ব্যবহার হবে

// ============================================
// ⚙️ Default Configuration
// ============================================
const DEFAULT_CONFIG = {
  timeout: 30000,          // ৩০ সেকেন্ড
  retries: 2,              // ২ বার retry
  retryDelay: 1000,        // ১ সেকেন্ড পর
  headers: {
    'Content-Type': 'application/json',
  },
};

// ============================================
// 🕐 Timeout Helper
// ============================================
const fetchWithTimeout = (url, options, timeout) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
};

// ============================================
// 🔄 Retry Helper
// ============================================
const fetchWithRetry = async (url, options, retries, delay) => {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw err;
  }
};

// ============================================
// 🎯 Core Request Function
// ============================================
const request = async (endpoint, options = {}) => {
  const config = { ...DEFAULT_CONFIG, ...options };
  const { timeout, retries, retryDelay, headers, body, ...rest } = config;

  const fetchOptions = {
    ...rest,
    headers: {
      ...DEFAULT_CONFIG.headers,
      ...headers,
    },
  };

  if (body && typeof body === 'object') {
    fetchOptions.body = JSON.stringify(body);
  } else if (body) {
    fetchOptions.body = body;
  }

  try {
    const response = await fetchWithRetry(
      endpoint,
      fetchOptions,
      retries,
      retryDelay
    );

    // Response parse
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw {
        status: response.status,
        statusText: response.statusText,
        data,
        message: data?.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return { success: true, data, status: response.status };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message || 'Request failed',
      status: error.status || 0,
      data: error.data || null,
    };
  }
};

// ============================================
// 📤 HTTP Methods
// ============================================
export const api = {
  // GET
  get: (url, options = {}) =>
    request(url, { ...options, method: 'GET' }),

  // POST
  post: (url, body, options = {}) =>
    request(url, { ...options, method: 'POST', body }),

  // PUT
  put: (url, body, options = {}) =>
    request(url, { ...options, method: 'PUT', body }),

  // PATCH
  patch: (url, body, options = {}) =>
    request(url, { ...options, method: 'PATCH', body }),

  // DELETE
  delete: (url, options = {}) =>
    request(url, { ...options, method: 'DELETE' }),

  // Custom request
  request,
};

// ============================================
// 🔐 Auth Header Helper
// ============================================
export const setAuthToken = (token) => {
  DEFAULT_CONFIG.headers['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  delete DEFAULT_CONFIG.headers['Authorization'];
};

// ============================================
// 🌐 Query String Builder
// ============================================
export const buildQuery = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      query.append(key, value);
    }
  });
  const str = query.toString();
  return str ? `?${str}` : '';
};

// ============================================
// 🔗 URL Builder
// ============================================
export const buildURL = (baseURL, endpoint, params = {}) => {
  const base = baseURL.replace(/\/$/, '');
  const path = endpoint.replace(/^\//, '');
  return `${base}/${path}${buildQuery(params)}`;
};

// ============================================
// 🎯 Health Check
// ============================================
export const pingServer = async (url) => {
  try {
    const response = await fetchWithTimeout(url, { method: 'HEAD' }, 5000);
    return response.ok;
  } catch {
    return false;
  }
};

// ============================================
// 📤 File Upload Helper
// ============================================
export const uploadFile = async (url, file, additionalData = {}) => {
  const formData = new FormData();
  formData.append('file', file);

  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Content-Type হেডার দেব না, ব্রাউজার অটো সেট করবে
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// 🎯 Response Helpers
// ============================================
export const isSuccess = (response) => {
  return response && response.success === true;
};

export const getData = (response, fallback = null) => {
  return isSuccess(response) ? response.data : fallback;
};

export const getError = (response) => {
  return !isSuccess(response) ? response?.error : null;
};