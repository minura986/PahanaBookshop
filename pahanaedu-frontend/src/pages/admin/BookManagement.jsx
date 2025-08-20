import React, { useState, useEffect } from 'react';
import { deleteBook } from '../../services/books';
import { getAllBooksForAdmin, updateBookStatus } from '../../services/admin';
import BookForm from '../../components/admin/BookForm';
import DeleteConfirmation from '../../components/admin/DeleteConfirmation';
import SlideButton from '../../components/ui/SlideButton';
import { toast } from 'react-toastify';

const BookManagement = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const data = await getAllBooksForAdmin();
            setBooks(data);
        } catch (error) {
            toast.error('Failed to fetch books.');
        }
    };

    const handleStatusToggle = async (bookId, currentStatus) => {
        try {
            await updateBookStatus(bookId, !currentStatus);
            toast.success(`Book visibility updated!`);
            fetchBooks();
        } catch (error) {
            toast.error('Failed to update book status.');
        }
    };

    const handleAdd = () => {
        setSelectedBook(null);
        setIsFormOpen(true);
    };

    const handleEdit = (book) => {
        setSelectedBook(book);
        setIsFormOpen(true);
    };

    const handleDelete = (book) => {
        setSelectedBook(book);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteBook(selectedBook.id);
            toast.success('Book deleted successfully!');
            fetchBooks();
        } catch (error) {
            toast.error('Failed to delete book.');
        } finally {
            setIsConfirmOpen(false);
            setSelectedBook(null);
        }
    };

    const handleFormSubmit = () => {
        fetchBooks();
        setIsFormOpen(false);
        setSelectedBook(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Book Management</h1>
                <button onClick={handleAdd} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
                    Add Book
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-4">Title</th>
                        <th className="text-left p-4">Author</th>
                        <th className="text-left p-4">Category</th>
                        <th className="text-left p-4">Sub-Category</th> {}
                        <th className="text-left p-4">Price</th>
                        <th className="text-left p-4">Stock</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.map((book) => (
                        <tr key={book.id} className="border-b">
                            <td className="p-4">{book.title}</td>
                            <td className="p-4">{book.author}</td>
                            <td className="p-4">{book.category}</td>
                            <td className="p-4">{book.subCategory}</td> {}
                            <td className="p-4">Rs.{book.price.toFixed(2)}</td>
                            <td className="p-4">{book.stock}</td>
                            <td className="p-4">
                                <SlideButton 
                                    checked={book.active} 
                                    onChange={() => handleStatusToggle(book.id, book.active)}
                                />
                            </td>
                            <td className="p-4">
                                <button onClick={() => handleEdit(book)} className="text-blue-500 hover:underline mr-4">Edit</button>
                                <button onClick={() => handleDelete(book)} className="text-red-500 hover:underline">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <BookForm
                    book={selectedBook}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            )}

            {isConfirmOpen && (
                <DeleteConfirmation
                    onCancel={() => setIsConfirmOpen(false)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
};

export default BookManagement;