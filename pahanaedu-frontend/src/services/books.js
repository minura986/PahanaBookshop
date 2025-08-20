import API from './api';

// This is the correct name for the function used in your components
export const getBooks = async (page = 0, size = 12) => {
    const response = await API.get('/books', {
        params: {
            page,
            size
        }
    });
    // Return the whole data object which includes { content, totalPages, ... }
    return response.data;
};

export const getBookById = async (id) => {
    const response = await API.get(`/books/${id}`);
    return response.data;
};

// Admin functions - ensure they are correct for multipart data if used
export const createBook = async (bookData) => {
    const response = await API.post('/books', bookData);
    return response.data;
};

export const updateBook = async (id, bookData) => {
    const response = await API.put(`/books/${id}`, bookData);
    return response.data;
};

export const deleteBook = async (id) => {
    await API.delete(`/books/${id}`);
};