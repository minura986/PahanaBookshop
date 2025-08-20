import React, { useState, useEffect } from 'react';
import { getBooks } from '../services/books';
import { getReviewsByBookId } from '../services/review';
import BookCard from '../components/BookCard';
import Spinner from '../components/ui/Spinner';
import { Link } from 'react-router-dom';
import { FaBook, FaUserFriends, FaChild, FaGraduationCap, FaLightbulb, FaPalette } from 'react-icons/fa';
import FeedbackCard from '../components/FeedbackCard';

const Home = () => {
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [moreBooks, setMoreBooks] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const slideImages = [
        'https://res.cloudinary.com/dlevndncr/image/upload/v1752094265/library-filled-with-books-vyy56lqa9wji657j_kxqgmu.jpg',
        'https://res.cloudinary.com/dlevndncr/image/upload/v1752094734/photo-1529007196863-d07650a3f0ea_k0myss.jpg',
        'https://res.cloudinary.com/dlevndncr/image/upload/v1752095181/stack-of-books-on-a-brown-background-concept-for-world-book-day-photo_zmmy1s.jpg',
    ];
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const categories = [
        { name: 'Fiction', icon: <FaBook />, color: 'bg-red-100', iconBg: 'bg-red-300', link: `/books?category=${encodeURIComponent('Fiction')}` },
        { name: 'Non-Fiction', icon: <FaUserFriends />, color: 'bg-blue-100', iconBg: 'bg-blue-300', link: `/books?category=${encodeURIComponent('Non-Fiction')}` },
        { name: "Children's & YA", icon: <FaChild />, color: 'bg-green-100', iconBg: 'bg-green-300', link: `/books?category=${encodeURIComponent("Children's & Young Adult")}` },
        { name: 'Academic', icon: <FaGraduationCap />, color: 'bg-yellow-100', iconBg: 'bg-yellow-300', link: `/books?category=${encodeURIComponent('Educational & Academic')}` },
        { name: 'Lifestyle', icon: <FaLightbulb />, color: 'bg-purple-100', iconBg: 'bg-purple-300', link: `/books?category=${encodeURIComponent('Practical & Lifestyle')}` },
        { name: 'Art & Media', icon: <FaPalette />, color: 'bg-indigo-100', iconBg: 'bg-indigo-300', link: `/books?category=${encodeURIComponent('Art & Media')}` },
    ];


    useEffect(() => {
        const fetchBooksAndFeedbacks = async () => {
            try {
                const pageData = await getBooks(0, 12);
                
                const bookData = pageData.content || [];

                const booksWithRatings = await Promise.all(
                    bookData.map(async (book) => {
                        try {
                            const reviews = await getReviewsByBookId(book.id);
                            const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
                            return { ...book, averageRating, reviews };
                        } catch (reviewError) {
                            return { ...book, averageRating: 0, reviews: [] };
                        }
                    })
                );

                setFeaturedBooks(booksWithRatings.slice(0, 6));
                setMoreBooks(booksWithRatings.slice(6, 12));

                const featuredFeedbacks = booksWithRatings.slice(0, 6).flatMap(b => b.reviews.map(r => ({ ...r, book: b })));
                setFeedbacks(featuredFeedbacks.slice(0, 3));

            } catch (err) {
                setError('Failed to load data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooksAndFeedbacks();
    }, []);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slideImages.length);
        }, 5000);
        return () => clearInterval(slideInterval);
    }, [slideImages.length]);

    const renderBookGrid = (books) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {books.map((book) => (
                <BookCard key={book.id} book={book} />
            ))}
        </div>
    );

    return (
        
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                {}
                <section
                    className="relative bg-gradient-to-r from-primary to-secondary text-white py-20 flex items-center justify-center overflow-hidden"
                    style={{ backgroundImage: `url(${slideImages[currentSlide]})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 1s ease-in-out', minHeight: '400px' }}
                >
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Pahana EDU Bookshop</h1>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">Discover a world of knowledge with our extensive collection of educational books</p>
                        <Link to="/books"><button className="bg-white text-primary px-6 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition">Browse All Books</button></Link>
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                        {slideImages.map((_, index) => (
                            <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 w-2 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-gray-400 opacity-75'}`}></button>
                        ))}
                    </div>
                </section>

                {/* Category Section */}
                <section className="container mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                        {categories.map((cat, index) => (
                            <Link to={cat.link} key={index} className={`flex flex-col items-center justify-center p-2 rounded-lg text-center transition-transform hover:scale-105 ${cat.color}`}>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${cat.iconBg}`}><span className="text-3xl text-white">{cat.icon}</span></div>
                                <span className="font-semibold text-gray-800 text-sm">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>
                
                {/* Featured Books */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Featured Books</h2>
                        {loading ? (<div className="text-center"><Spinner /><p className="mt-4 text-gray-600">Loading books...</p></div>) : error ? (<div className="text-center"><p className="text-red-500 text-lg">{error}</p></div>) : (renderBookGrid(featuredBooks))}
                    </div>
                </section>

                {/* More Books Section */}
                {moreBooks.length > 0 && (
                     <section className="bg-gray-50 py-16">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center mb-12">More Books to Explore</h2>
                             {renderBookGrid(moreBooks)}
                             <div className="text-center mt-12">
                                 <Link to="/books"><button className="bg-primary text-white px-6 py-3 rounded-md font-bold text-lg hover:bg-primary-dark transition">View All Books</button></Link>
                             </div>
                        </div>
                    </section>
                )}

                {/* Customer Feedback Section */}
                {feedbacks.length > 0 && (
                    <section className="bg-gray-100 py-16">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center mb-12">From Our Readers</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {feedbacks.map((review) => (<FeedbackCard key={review.id} review={review} />))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default Home;