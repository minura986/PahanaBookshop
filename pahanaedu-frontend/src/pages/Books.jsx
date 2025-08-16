// Pahana/pahanaedu-frontend/src/pages/Books.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getBooks } from '../services/books';
import { getReviewsByBookId } from '../services/review';
import BookCard from '../components/BookCard';
import Spinner from '../components/ui/Spinner';
import CategoryFilter from '../components/CategoryFilter';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Books = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const query = useQuery();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState(query.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(query.get('category') || 'All');
    const [selectedSubCategory, setSelectedSubCategory] = useState(query.get('subCategory') || 'All');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchBooksAndReviews = async () => {
            try {
                const bookData = await getBooks();
                const booksWithRatings = await Promise.all(
                    bookData.map(async (book) => {
                        try {
                            const reviews = await getReviewsByBookId(book.id);
                            const averageRating = reviews.length > 0
                                ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                                : 0;
                            return { ...book, averageRating };
                        } catch (reviewError) {
                            console.error(`Could not fetch reviews for book ${book.id}`, reviewError);
                            return { ...book, averageRating: 0 };
                        }
                    })
                );
                setBooks(booksWithRatings);
                const uniqueCategories = ['All', ...new Set(bookData.map(book => book.category))];
                setCategories(uniqueCategories);
            } catch (err) {
                setError('Failed to load books. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooksAndReviews();
    }, [location]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchTerm(params.get('search') || '');
        setSelectedCategory(params.get('category') || 'All');
        setSelectedSubCategory(params.get('subCategory') || 'All');
    }, [location.search]);

    useEffect(() => {
        let result = books;

        if (searchTerm) {
            result = result.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            result = result.filter(book => book.category === selectedCategory);
        }
        
        if (selectedSubCategory !== 'All') {
            result = result.filter(book => book.subCategory === selectedSubCategory);
        }

        setFilteredBooks(result);
    }, [searchTerm, selectedCategory, selectedSubCategory, books]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <Spinner />
                <p className="mt-4 text-gray-600">Loading books...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500 text-lg">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">Book Collection</h1>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                </div>
            </div>

            {filteredBooks.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg mb-4">No books found matching your criteria.</p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('All');
                            setSelectedSubCategory('All');
                        }}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-4 flex justify-between items-center">
                        <p className="text-gray-600">
                            Showing {filteredBooks.length} of {books.length} books
                        </p>
                        {selectedCategory !== 'All' && (
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className="text-primary hover:underline"
                            >
                                Clear Category Filter
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        {filteredBooks.map(book => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Books;