// src/api.js - Your existing axios API utility (already perfect!)
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

// Interceptor automatically adds JWT token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Optional: Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401/403 errors globally
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Optional: Export specific API methods for convenience
export const expenseAPI = {
    getAll: () => api.get('/api/expenses'),
    create: (data) => api.post('/api/expenses', data),
    update: (id, data) => api.put(`/api/expenses/${id}`, data),
    delete: (id) => api.delete(`/api/expenses/${id}`)
};

export const budgetAPI = {
    getAll: () => api.get('/api/budgets'),
    create: (data) => api.post('/api/budgets', data),
    update: (id, data) => api.put(`/api/budgets/${id}`, data),
    delete: (id) => api.delete(`/api/budgets/${id}`)
};

export const accountAPI = {
    getAll: () => api.get('/api/accounts'),
    create: (data) => api.post('/api/accounts', data),
    update: (id, data) => api.put(`/api/accounts/${id}`, data),
    delete: (id) => api.delete(`/api/accounts/${id}`)
};

export const overviewAPI = {
    getHome: () => api.get('/api/overview/home')
};