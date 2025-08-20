// Pahana/pahanaedu-frontend/src/services/auth.js
import API from './api';

export const loginUser = async (credentials) => {
    const response = await API.post('/auth/signin', credentials);
    return response.data;
};

// --- START OF MODIFIED registerUser ---
// We remove the imageFile parameter and send userData directly as JSON.
export const registerUser = async (userData) => {
    // The 'profilePicture' field (which is a File object) cannot be sent as JSON.
    // We create a new object without it before sending.
    const { profilePicture, ...dataToSend } = userData;

    const response = await API.post('/auth/signup', dataToSend, {
        headers: {
            'Content-Type': 'application/json', // Set content type to application/json
        },
    });
    return response.data;
};
// --- END OF MODIFIED registerUser ---


export const getCurrentUser = async () => {
    const response = await API.get('/user/profile');
    return response.data;
};