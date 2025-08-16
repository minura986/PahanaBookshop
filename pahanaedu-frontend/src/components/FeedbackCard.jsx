// Pahana/pahanaedu-frontend/src/components/FeedbackCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const FeedbackCard = ({ review }) => {
    const { comment, username, rating, book } = review;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <div className="flex items-center mb-4">
                {book && (
                    <Link to={`/book/${book.id}`}>
                        <img src={book.imageUrl} alt={book.title} className="w-16 h-24 object-cover rounded-md mr-4" />
                    </Link>
                )}
                <div>
                    {book && (
                        <Link to={`/book/${book.id}`}>
                            <h4 className="font-bold hover:text-primary">{book.title}</h4>
                        </Link>
                    )}
                    <p className="text-sm text-gray-500">by {username}</p>
                </div>
            </div>
            <div className="mb-4">
                <Rating value={rating} />
            </div>
            <p className="text-gray-700 italic">"{comment}"</p>
        </div>
    );
};

export default FeedbackCard;