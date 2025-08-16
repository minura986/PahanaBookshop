// Pahana/pahanaedu-frontend/src/components/ReviewForm.jsx
import React, { useState, useEffect } from 'react';
import Rating from './Rating';
import Button from './ui/Button';

const ReviewForm = ({ onSubmit, existingReview, onCancel }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment);
        } else {
            setRating(0);
            setComment('');
        }
    }, [existingReview]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await onSubmit({ rating, comment });
        setSubmitting(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">{existingReview ? 'Update Your Review' : 'Write a Review'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Your Rating</label>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="mr-1 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-6 w-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="comment" className="block text-gray-700 mb-2">Your Review</label>
                    <textarea
                        id="comment"
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Share your experience with this book..."
                        required
                    ></textarea>
                </div>

                <div className="flex justify-end gap-2">
                    {existingReview && onCancel && (
                         <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    )}
                    <Button
                        type="submit"
                        disabled={submitting || rating === 0}
                        className={`${submitting || rating === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;