import API from './api';

export const getBooks = async (page = 0, size = 12) => {
    const response = await API.get('/books', {
        params: {
            page,
            size
        }
    });

    return response.data;
};

export const getBookById = async (id) => {
    const response = await API.get(`/books/${id}`);
    return response.data;
};

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