import React, { useState, useEffect } from 'react';
import { createBook, updateBook } from '../../services/books';
import { toast } from 'react-toastify';

const categoryData = {
    "Fiction": [ "Literary Fiction", "Historical Fiction", "Science Fiction", "Fantasy", "Mystery & Thriller", "Romance", "Horror", "Adventure", "Dystopian", "Crime" ],
    "Non-Fiction": [ "Biography & Memoir", "History", "Self-Help", "Psychology", "Science & Nature", "Philosophy", "Religion & Spirituality", "Politics & Social Sciences", "Business & Economics", "Health & Wellness", "True Crime" ],
    "Children's & Young Adult": [ "Picture Books", "Early Readers", "Middle Grade", "Young Adult (YA) Fiction", "YA Fantasy / Sci-Fi / Romance" ],
    "Educational & Academic": [ "Textbooks", "Study Guides & Exam Prep", "Academic Journals", "Reference (Dictionaries, Encyclopedias)", "Language Learning" ],
    "Practical & Lifestyle": [ "Cookbooks & Food", "Travel Guides", "Home & Garden", "Arts & Crafts", "Hobbies & DIY", "Parenting & Family", "Personal Finance" ],
    "Art & Media": [ "Art & Photography", "Music", "Film & TV", "Graphic Novels & Comics", "Design & Fashion" ]
};
const mainCategories = Object.keys(categoryData);

const BookForm = ({ book, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '', author: '', description: '', price: '', cost: '',
        stock: '', category: '', subCategory: '', active: true,
    });
    const [image, setImage] = useState(null);
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || '', author: book.author || '', description: book.description || '',
                price: book.price || '', cost: book.cost || '', stock: book.stock || '',
                category: book.category || '', subCategory: book.subCategory || '',
                active: book.active !== undefined ? book.active : true,
            });
            if (book.category) {
                setSubCategories(categoryData[book.category] || []);
            }
        }
    }, [book]);

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setFormData({ ...formData, category: newCategory, subCategory: '' });
        setSubCategories(categoryData[newCategory] || []);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const bookData = new FormData();

        // Append each piece of form data as a separate field.
        for (const key in formData) {
            bookData.append(key, formData[key]);
        }
        
        if (image) {
            bookData.append('image', image);
        } else if (!book) {
            toast.error("Please select an image for the new book.");
            return;
        }

        try {
            if (book) {
                await updateBook(book.id, bookData);
                toast.success('Book updated successfully!');
            } else {
                await createBook(bookData);
                toast.success('Book created successfully!');
            }
            onSubmit();
        } catch (error) {
            console.error("Failed to save book:", error);
            const errorMessage = error.response?.data?.message || 'Failed to save book. Please try again.';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{book ? 'Edit Book' : 'Add New Book'}</h3>
                <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto pr-2">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Author</label>
                        <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
                        </div>
                        <div>
                           <label className="block text-gray-700 text-sm font-bold mb-2">Cost</label>
                           <input type="number" step="0.01" name="cost" value={formData.cost} onChange={handleChange} className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Book Cover Image</label>
                        <input type="file" name="image" onChange={handleImageChange} className="w-full px-3 py-2 border rounded" accept="image/*" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                        <select name="category" value={formData.category} onChange={handleCategoryChange} className="w-full px-3 py-2 border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" required>
                            <option value="">Select a Category</option>
                            {mainCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {subCategories.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Sub-Category</label>
                            <select name="subCategory" value={formData.subCategory} onChange={handleChange} className="w-full px-3 py-2 border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" required>
                                <option value="">Select a Sub-Category</option>
                                {subCategories.map(subCat => (
                                    <option key={subCat} value={subCat}>{subCat}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <span className="ml-2 text-gray-700">Book is Active and Visible</span>
                        </label>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded-md mr-2 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-primary text-white font-bold px-4 py-2 rounded-md hover:bg-primary-dark">Save Book</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookForm;