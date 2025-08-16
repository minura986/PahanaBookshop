// Pahana/pahanaedu-frontend/src/services/review.js
import API from './api';

export const addReview = async (reviewData) => {
    const response = await API.post('/reviews', reviewData);
    return response.data;
};

export const getReviewsByBookId = async (bookId) => {
    const response = await API.get(`/reviews/book/${bookId}`);
    return response.data;
};

export const updateReview = async (id, reviewData) => {
    const response = await API.put(`/reviews/${id}`, reviewData);
    return response.data;
};

export const getReviewsByUser = async () => {
    const response = await API.get('/reviews/user');
    return response.data;
}