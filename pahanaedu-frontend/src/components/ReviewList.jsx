// Pahana/pahanaedu-frontend/src/components/ReviewList.jsx
import React from 'react';
import Rating from './Rating';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import { Link } from 'react-router-dom';

const ReviewList = ({ reviews, onEdit }) => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-6 flex gap-4">
                    {review.book && ( // Check if book data exists
                        <Link to={`/book/${review.book.id}`}>
                            <img src={review.book.imageUrl} alt={review.book.title} className="w-24 h-36 object-cover rounded-md" />
                        </Link>
                    )}
                    <div className="flex-grow">
                        {review.book && ( // Check if book data exists
                            <Link to={`/book/${review.book.id}`}>
                                <h3 className="text-lg font-bold hover:text-primary">{review.book.title}</h3>
                            </Link>
                        )}
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-semibold">{review.username}</h4>
                                <p className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString()}</p>
                            </div>
                            <Rating value={review.rating} />
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        {user && user.id === review.userId && onEdit && (
                            <div className="text-right mt-2">
                                <Button variant="outline" size="sm" onClick={() => onEdit(review)}>Edit</Button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;