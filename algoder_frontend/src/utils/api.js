import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('access_token');

  // Don't add token for login and register
  if (!req.url.includes('login') && !req.url.includes('register')) {
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }

  return req;
});

// Access token ab sirf 30 min ka hai — expire hone par refresh token se
// naya access token le aao aur original request dobara bhejo.
let isRefreshing = false;
let pendingQueue = [];

function resolvePendingQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint =
      originalRequest.url.includes('login') ||
      originalRequest.url.includes('register') ||
      originalRequest.url.includes('token/refresh');

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // window.location.href = '/';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Ek refresh call already chal rahi hai, usi ka result use karo
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        const newAccessToken = res.data.access;
        localStorage.setItem('access_token', newAccessToken);
        // ROTATE_REFRESH_TOKENS is on backend to True — naya refresh token bhi aayega
        if (res.data.refresh) {
          localStorage.setItem('refresh_token', res.data.refresh);
        }

        resolvePendingQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        resolvePendingQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // window.location.href = '/';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;