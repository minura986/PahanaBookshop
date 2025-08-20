// Pahana/pahanaedu-frontend/src/components/BookCard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Rating from './Rating';
import Button from '../components/ui/Button';
import { FaShoppingCart } from 'react-icons/fa'; // Import the cart icon

const BookCard = ({ book }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        addToCart(book); // Directly add to cart
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
            <Link to={`/book/${book.id}`} className="flex-grow flex flex-col">
                <img src={book.imageUrl} alt={book.title} className="w-full h-48 object-cover" />
                <div className="p-4 flex-grow">
                    <h2 className="text-lg font-semibold mb-1 line-clamp-2">{book.title}</h2>
                    <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                    <div className="mb-3">
                        <Rating value={book.averageRating} />
                    </div>
                    <p className="text-lg font-bold text-primary">Rs.{book.price.toFixed(2)}</p>
                </div>
            </Link>
            <div className="p-4 border-t flex gap-2">
                <Link to={`/book/${book.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full">View</Button>
                </Link>
                <Button
                    onClick={handleAddToCart}
                    size="sm"
                    className="w-full flex items-center justify-center" 
                >
                    <FaShoppingCart className="mr-1" /> Cart
                </Button>
            </div>
        </div>
    );
};

export default BookCard;