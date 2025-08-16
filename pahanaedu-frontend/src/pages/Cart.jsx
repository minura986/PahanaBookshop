// Pahana/pahanaedu-frontend/src/pages/Cart.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const Cart = () => {
    const { cartItems, subtotal, updateQuantity, removeFromCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-6">Add some books to your cart!</p>
                <Link to="/books">
                    <Button>Browse Books</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-4">Book</th>
                                <th className="text-left p-4">Price</th>
                                <th className="text-left p-4">Quantity</th>
                                <th className="text-left p-4">Total</th>
                                <th className="text-left p-4"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <img src={item.imageUrl} alt={item.title} className="w-16 h-16 mr-4 object-cover rounded-md" />
                                            <div>
                                                <h3 className="font-semibold">{item.title}</h3>
                                                <p className="text-gray-600">{item.author}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">Rs.{item.price.toFixed(2)}</td>
                                    <td className="p-4">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                            className="w-16 p-2 border rounded"
                                        />
                                    </td>
                                    <td className="p-4">Rs.{(item.price * item.quantity).toFixed(2)}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>Rs.{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>Rs.0.00</span>
                            </div>
                            <div className="flex justify-between border-t pt-4">
                                <span className="font-bold">Total</span>
                                <span className="font-bold">Rs.{subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <Link to="/checkout">
                            <Button className="w-full mt-6">Proceed to Checkout</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;