// Pahana/pahanaedu-frontend/src/components/admin/ReviewDisplay.jsx
import React, { useState, useEffect } from 'react';
import { getReviewsByBookId } from '../../services/admin';
import { toast } from 'react-toastify';
import Spinner from '../ui/Spinner';
import Rating from '../Rating';

const ReviewDisplay = ({ bookId, userId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getReviewsByBookId(bookId);
                const userReviews = data.filter(review => review.userId === userId);
                setReviews(userReviews);
            } catch (error) {
                toast.error('Failed to fetch reviews.');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [bookId, userId]);

    if (loading) {
        return <Spinner />;
    }

    if (reviews.length === 0) {
        return <p className="text-gray-500 text-sm">No reviews for this book by this user.</p>;
    }

    return (
        <div className="mt-4 space-y-4">
            {reviews.map((review) => (
                <div key={review.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">{review.username}</p>
                        <Rating value={review.rating} />
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-gray-400 text-xs mt-2">{new Date(review.date).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
};

export default ReviewDisplay;