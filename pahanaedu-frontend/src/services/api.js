// Pahana/pahanaedu-frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api', // Ensure this matches your backend port
    withCredentials: true // Important for session cookies
});

export default API;