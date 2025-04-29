import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // (eğer cookie token vs. kullanacaksan)
});
console.log('API baseURL:', import.meta.env.VITE_API_URL);

export default api;
