// Pahana/pahanaedu-frontend/src/services/user.js
import API from './api';

export const getUserProfile = async () => {
    const response = await API.get('/user/profile');
    return response.data;
};

export const updateUserProfile = async (userData) => {
    const response = await API.put('/user/profile', userData);
    return response.data;
};

// New function to update user profile with a photo
export const updateUserProfileWithPhoto = async (userData, imageFile) => {
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const response = await API.put('/user/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};


export const getUserOrderHistory = async () => {
    const response = await API.get('/user/orders');
    return response.data;
};

export const cancelOrder = async (orderId) => {
    const response = await API.put(`/orders/${orderId}/cancel`);
    return response.data;
};

export const getGuestOrderById = async (orderId) => {
    const response = await API.get(`/orders/guest/${orderId}`);
    return response.data;
};