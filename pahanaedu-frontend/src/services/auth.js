// Pahana/pahanaedu-frontend/src/services/auth.js
import API from './api';

export const loginUser = async (credentials) => {
    const response = await API.post('/auth/signin', credentials);
    return response.data;
};

// Modified registerUser to accept an image file
export const registerUser = async (userData, imageFile) => {
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const response = await API.post('/auth/signup', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await API.get('/user/profile');
    return response.data;
};