import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getBooks } from '../services/books';
import { getReviewsByBookId } from '../services/review';
import BookCard from '../components/BookCard';
import Spinner from '../components/ui/Spinner';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/ui/Pagination';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Books = () => {
    const [allBooks, setAllBooks] = useState([]); // Holds the current page's books
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const query = useQuery();
    const [searchTerm, setSearchTerm] = useState(query.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(query.get('category') || 'All');
    
    // --- State for Pagination ---
    const [currentPage, setCurrentPage] = useState(0); 
    const [totalPages, setTotalPages] = useState(0);

    // Effect for fetching data when the page changes
    useEffect(() => {
        const fetchBooksForPage = async () => {
            setLoading(true);
            try {
                // Fetch data for the current page
                const pageData = await getBooks(currentPage);
                
                const booksFromApi = pageData.content || [];

                const booksWithRatings = await Promise.all(
                    booksFromApi.map(async (book) => {
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
                
                setAllBooks(booksWithRatings);
                setTotalPages(pageData.totalPages || 0); 

            } catch (err) {
                setError('Failed to load books. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooksForPage();
    }, [currentPage]); 

    useEffect(() => {
        let result = allBooks;

        if (searchTerm) {
            result = result.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            result = result.filter(book => book.category === selectedCategory);
        }

        setFilteredBooks(result);
    }, [searchTerm, selectedCategory, allBooks]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center"><Spinner /></div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    const categories = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Fantasy', 'Crime'];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">Book Collection</h1>
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />
            </div>

            {filteredBooks.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No books found matching your criteria.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {filteredBooks.map(book => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                    {totalPages > 1 &&
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    }
                </>
            )}
        </div>
    );
};

export default Books;