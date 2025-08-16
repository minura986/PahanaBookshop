// Pahana/pahanaedu-frontend/src/services/admin.js
import API from './api';

export const getDashboardStats = async () => {
    const response = await API.get('/dashboard/stats');
    return response.data;
};

export const getAllOrders = async () => {
    const response = await API.get('/orders');
    return response.data;
};

export const updateOrderStatus = async (id, status, returnAddress) => {
    const payload = { status };
    if (returnAddress) {
        payload.returnAddress = returnAddress;
    }
    const response = await API.put(`/orders/${id}/status`, payload);
    return response.data;
};

export const getAllUsers = async () => {
    const response = await API.get('/admin/users');
    return response.data;
};

export const getAllBooksForAdmin = async () => {
    const response = await API.get('/admin/books');
    return response.data;
};

export const getAllReviews = async () => {
    const response = await API.get('/admin/reviews');
    return response.data;
};

export const getReviewsByBookId = async (bookId) => {
    const response = await API.get(`/admin/reviews/${bookId}`);
    return response.data;
};

export const updateBookStatus = async (id, active) => {
    const response = await API.put(`/books/${id}/status`, { active });
    return response.data;
};

export const createOrder = async (order) => {
    const response = await API.post('/orders', order);
    return response.data;
};

export const deleteUser = async (id) => {
    await API.delete(`/admin/users/${id}`);
};

export const updateUser = async (id, userData) => {
    const response = await API.put(`/admin/users/${id}`, userData);
    return response.data;
};

export const getUserOrders = async (id) => {
    const response = await API.get(`/users/${id}/orders`);
    return response.data;
};

export const createAdminUser = async (userData) => {
    const response = await API.post('/admin/users', userData);
    return response.data;
};