export const config = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  WEB_URL: import.meta.env.VITE_WEB_URL || 'http://localhost:8000',    
  get AUTH_TOKEN() {
    return localStorage.getItem('token');
  }
};
