// Pahana/pahanaedu-frontend/src/pages/BookDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getBookById } from '../services/books';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import Rating from '../components/Rating';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { toast } from 'react-toastify';
import { getUserOrderHistory } from '../services/user';
import { getReviewsByBookId, addReview, updateReview } from '../services/review';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [isEditingReview, setIsEditingReview] = useState(false);

    const fetchBookAndReviews = async () => {
        try {
            const bookData = await getBookById(id);
            setBook(bookData);

            const reviewData = await getReviewsByBookId(id);
            setReviews(reviewData);

            if (reviewData.length > 0) {
                const total = reviewData.reduce((sum, review) => sum + review.rating, 0);
                setAverageRating(total / reviewData.length);
            }

            if (user) {
                const orders = await getUserOrderHistory();
                const purchased = orders.some(order =>
                    order.status === 'Delivered' && order.items.some(item => item.bookId === id)
                );
                setHasPurchased(purchased);

                const existingReview = reviewData.find(r => r.userId === user.id);
                setUserReview(existingReview);

                if (location.state?.editing) {
                    setIsEditingReview(true);
                    // Clean the state to prevent re-triggering
                    navigate(location.pathname, { replace: true, state: {} });
                }
            }

        } catch (err) {
            setError('Failed to load book details. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookAndReviews();
    }, [id, user]);

    const handleAddToCart = () => {
        if (book) {
            addToCart({ ...book, quantity });
            toast.success(`${book.title} has been added to your cart!`);
        }
    };

    const handleBuyNow = () => {
        if (book) {
            addToCart({ ...book, quantity });
            navigate('/checkout');
        }
    };

    const handleReviewSubmit = async (review) => {
        try {
            if (userReview) {
                // Update existing review
                const updatedReview = await updateReview(userReview.id, review);
                setReviews(reviews.map(r => r.id === userReview.id ? updatedReview : r));
                setUserReview(updatedReview);
                toast.success("Review updated successfully!");
                setIsEditingReview(false);
            } else {
                // Add new review
                const newReview = {
                    bookId: id,
                    rating: review.rating,
                    comment: review.comment,
                };
                const savedReview = await addReview(newReview);
                setReviews([savedReview, ...reviews]);
                setUserReview(savedReview);
                toast.success("Review submitted successfully!");
            }
        } catch (error) {
            toast.error(error.response?.data || "Failed to submit review.");
        }
    };

    const handleEditClick = () => {
        setIsEditingReview(true);
    }

    const handleCancelEdit = () => {
        setIsEditingReview(false);
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <Spinner />
                <p className="mt-4 text-gray-600">Loading book details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500 text-lg">{error}</p>
                <button
                    onClick={() => navigate('/books')}
                    className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                    Browse Books
                </button>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-gray-600 text-lg">Book not found.</p>
                <button
                    onClick={() => navigate('/books')}
                    className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                    Browse Books
                </button>
            </div>
        );
    }

    const showReviewForm = (hasPurchased && !userReview) || isEditingReview;

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-primary hover:text-primary-dark mb-6"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Books
            </button>

            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 mb-12">
                    <div className="md:w-1/3">
                        <img src={book.imageUrl} alt={book.title} className="bg-gray-200 rounded-xl w-full h-96 object-cover mb-4" />
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3].map((index) => (
                                <div
                                    key={index}
                                    className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                        <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                        <div className="flex items-center mb-4">
                            <Rating value={averageRating} />
                            <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
                        </div>

                        <p className="text-2xl font-bold text-primary mb-4">Rs.{book.price.toFixed(2)}</p>

                        <div className="mb-6">
                            <p className="text-gray-700 mb-4">{book.description}</p>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-gray-600">Category</h3>
                                    <p>{book.category}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-600">Availability</h3>
                                    <p className={book.stock > 0 ? "text-green-600" : "text-red-600"}>
                                        {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-gray-600">ISBN</h3>
                                    <p>{book.id || '978-3-16-148410-0'}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-600">Publisher</h3>
                                    <p>Pahana EDU Press</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                            {book.stock > 0 && (
                                <div className="flex items-center">
                                    <label htmlFor="quantity" className="mr-2 text-gray-700">Quantity:</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        min="1"
                                        max={book.stock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(book.stock, parseInt(e.target.value) || 1)))}
                                        className="w-20 p-2 border rounded"
                                    />
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={book.stock <= 0}
                                    className={`px-6 py-3 rounded-md font-medium transition-colors ${
                                        book.stock <= 0
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                    }`}
                                >
                                    {book.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>

                                {book.stock > 0 && (
                                    <button
                                        onClick={handleBuyNow}
                                        className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/10 transition-colors"
                                    >
                                        Buy Now
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4">Share this book</h3>
                            <div className="flex space-x-4">
                                <button className="text-gray-600 hover:text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </button>
                                <button className="text-gray-600 hover:text-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                </button>
                                <button className="text-gray-600 hover:text-blue-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h3 className="text-xl font-bold mb-4">Overall Rating</h3>
                                <div className="flex items-center justify-center mb-4">
                                    <span className="text-5xl font-bold mr-2">{averageRating.toFixed(1)}</span>
                                    <div>
                                        <Rating value={averageRating} size="lg" />
                                        <p className="text-gray-600 mt-1">{reviews.length} reviews</p>
                                    </div>
                                </div>
                            </div>
                            {showReviewForm && (
                                <ReviewForm
                                    onSubmit={handleReviewSubmit}
                                    existingReview={userReview}
                                    onCancel={handleCancelEdit}
                                />
                            )}
                        </div>

                        <div className="md:w-2/3">
                            {reviews.length > 0 ? (
                                <ReviewList reviews={reviews} onEdit={handleEditClick} />
                            ) : (
                                <p className="text-gray-600">No reviews yet. Be the first to review this book!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;