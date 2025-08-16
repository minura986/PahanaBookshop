import API from './api';

export const getBooks = async () => {
    const response = await API.get('/books');
    return response.data;
};

export const getBookById = async (id) => {
    const response = await API.get(`/books/${id}`);
    return response.data;
};

export const createBook = async (bookData) => {
    const response = await API.post('/books', bookData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateBook = async (id, bookData) => {
    const response = await API.put(`/books/${id}`, bookData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteBook = async (id) => {
    await API.delete(`/books/${id}`);
};