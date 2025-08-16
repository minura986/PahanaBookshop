import React, { useState, useEffect } from 'react';
import { createBook, updateBook } from '../../services/books';
import { toast } from 'react-toastify';

const categoryData = {
    "Fiction": [
        "Literary Fiction", "Historical Fiction", "Science Fiction", "Fantasy",
        "Mystery & Thriller", "Romance", "Horror", "Adventure", "Dystopian", "Crime"
    ],
    "Non-Fiction": [
        "Biography & Memoir", "History", "Self-Help", "Psychology", "Science & Nature",
        "Philosophy", "Religion & Spirituality", "Politics & Social Sciences",
        "Business & Economics", "Health & Wellness", "True Crime"
    ],
    "Children's & Young Adult": [
        "Picture Books", "Early Readers", "Middle Grade", "Young Adult (YA) Fiction",
        "YA Fantasy / Sci-Fi / Romance"
    ],
    "Educational & Academic": [
        "Textbooks", "Study Guides & Exam Prep", "Academic Journals",
        "Reference (Dictionaries, Encyclopedias)", "Language Learning"
    ],
    "Practical & Lifestyle": [
        "Cookbooks & Food", "Travel Guides", "Home & Garden", "Arts & Crafts",
        "Hobbies & DIY", "Parenting & Family", "Personal Finance"
    ],
    "Art & Media": [
        "Art & Photography", "Music", "Film & TV", "Graphic Novels & Comics", "Design & Fashion"
    ]
};

const mainCategories = Object.keys(categoryData);

const BookForm = ({ book, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        subCategory: ''
    });
    const [image, setImage] = useState(null);
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || '',
                author: book.author || '',
                description: book.description || '',
                price: book.price || '',
                stock: book.stock || '',
                category: book.category || '',
                subCategory: book.subCategory || ''
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const bookData = new FormData();
        bookData.append('book', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
        if (image) {
            bookData.append('image', image);
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
            toast.error('Failed to save book.');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{book ? 'Edit Book' : 'Add Book'}</h3>
                <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto pr-2">
                    <div className="mb-4">
                        <label className="block text-gray-700">Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Author</label>
                        <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border rounded"></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Price</label>
                        <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Stock</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Image</label>
                        <input type="file" name="image" onChange={handleImageChange} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Category</label>
                        <select name="category" value={formData.category} onChange={handleCategoryChange} className="w-full px-3 py-2 border rounded" required>
                            <option value="">Select a Category</option>
                            {mainCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {subCategories.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-gray-700">Sub-Category</label>
                            <select name="subCategory" value={formData.subCategory} onChange={handleChange} className="w-full px-3 py-2 border rounded" required>
                                <option value="">Select a Sub-Category</option>
                                {subCategories.map(subCat => (
                                    <option key={subCat} value={subCat}>{subCat}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2">Cancel</button>
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookForm;