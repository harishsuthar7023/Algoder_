import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// console.log(API)

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
export default API;
