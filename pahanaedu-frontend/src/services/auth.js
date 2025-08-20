// Pahana/pahanaedu-frontend/src/services/auth.js
import API from './api';

export const loginUser = async (credentials) => {
    const response = await API.post('/auth/signin', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const { profilePicture, ...dataToSend } = userData;

    const response = await API.post('/auth/signup', dataToSend, {
        headers: {
            'Content-Type': 'application/json', 
        },
    });
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await API.get('/user/profile');
    return response.data;
};