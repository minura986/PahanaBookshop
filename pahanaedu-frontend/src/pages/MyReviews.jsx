// Pahana/pahanaedu-frontend/src/pages/MyReviews.jsx
import React, { useState, useEffect } from 'react';
import { getReviewsByUser } from '../services/review';
import { getBookById } from '../services/books';
import ReviewList from '../components/ReviewList';
import Spinner from '../components/ui/Spinner';
import { toast } from 'react-toastify';

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviewsAndBooks = async () => {
            try {
                const userReviews = await getReviewsByUser();
                const reviewsWithBookDetails = await Promise.all(
                    userReviews.map(async (review) => {
                        try {
                            const book = await getBookById(review.bookId);
                            return { ...review, book };
                        } catch (error) {
                            console.error(`Failed to fetch book with id ${review.bookId}`, error);
                            return { ...review, book: null };
                        }
                    })
                );
                setReviews(reviewsWithBookDetails);
            } catch (error) {
                toast.error("Failed to load your reviews.");
            } finally {
                setLoading(false);
            }
        };

        fetchReviewsAndBooks();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
            {reviews.length > 0 ? (
                <ReviewList reviews={reviews} />
            ) : (
                <p>You haven't written any reviews yet.</p>
            )}
        </div>
    );
};

export default MyReviews;