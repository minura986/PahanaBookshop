// src/pages/MyOrders.jsx
import React, { useState, useEffect } from 'react';
import { getUserOrderHistory, cancelOrder } from '../services/user';
import { getReviewsByUser } from '../services/review';
import { toast } from 'react-toastify';
import Spinner from '../components/ui/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Rating from '../components/Rating';

const OrderCard = ({ order, onCancelRequest, reviews }) => {
    const navigate = useNavigate();
    const getStatusPill = (status) => {
        const statusText = status || 'Pending';
        let statusClasses;

        switch (statusText) {
            case 'Delivered':
                statusClasses = 'bg-green-200 text-green-800';
                break;
            case 'Shipped':
                statusClasses = 'bg-blue-200 text-blue-800';
                break;
            case 'Cancelled':
                statusClasses = 'bg-red-200 text-red-800';
                break;
            case 'Cancellation Requested':
                statusClasses = 'bg-orange-200 text-orange-800';
                break;
            case 'Pending':
            default:
                statusClasses = 'bg-yellow-200 text-yellow-800';
                break;
        }
        return <span className={`px-2 py-1 text-xs rounded-full ${statusClasses}`}>{statusText}</span>;
    };

    const handleEditReview = (bookId) => {
        navigate(`/book/${bookId}`, { state: { editing: true } });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <div>
                    <span className="text-sm text-gray-500">Order date: {new Date(order.orderDate).toLocaleDateString()}</span>
                    <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                </div>
                <div className="flex items-center gap-4">
                    {getStatusPill(order.status)}
                    <Link to={`/profile/my-orders/${order.id}`} target="_blank" className="text-primary hover:underline font-semibold">
                        Order details &gt;
                    </Link>
                </div>
            </div>

            {order.items.map(item => {
                 const userReview = reviews.find(review => review.bookId === item.bookId);
                 return (
                     <div key={item.bookId} className="flex items-start gap-4 mb-4">
                         <img src={item.imageUrl} alt={item.title} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
                         <div className="flex-grow">
                             <p className="font-semibold">{item.title}</p>
                             <p className="text-sm text-gray-500">Rs.{item.price.toFixed(2)} x {item.quantity}</p>
                             <p className="text-sm text-blue-600">Free returns</p>
                             <p className="text-sm text-green-600">Delivery guarantee</p>
                         </div>
                         <div className="flex flex-col items-end gap-2 text-right">
                            {order.status === 'Delivered' && (
                                userReview ? (
                                    <div>
                                        <p className="text-sm font-semibold">Your Review:</p>
                                        <div onClick={() => handleEditReview(item.bookId)} className="cursor-pointer inline-block">
                                            <Rating value={userReview.rating} />
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 italic">"{userReview.comment}"</p>
                                    </div>
                                ) : (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => navigate(`/book/${item.bookId}`)}
                                >
                                    Leave a Review
                                </Button>
                                )
                            )}
                        </div>
                     </div>
                 )
            })}

            <div className="flex justify-end items-center border-t pt-4">
                 <p className="text-lg font-bold">Total: Rs.{order.totalAmount.toFixed(2)}</p>
            </div>
        </div>
    );
};


const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrderHistory = async () => {
        setLoading(true);
        try {
            const orderData = await getUserOrderHistory();
            const sortedOrders = orderData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            setOrders(sortedOrders);

            const reviewData = await getReviewsByUser();
            setReviews(reviewData);

        } catch (error) {
            toast.error("Failed to fetch order history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    const handleCancelRequest = async (orderId) => {
        const order = orders.find(o => o.id === orderId);
        let confirmMessage = 'Are you sure you want to proceed with this request?';
        if (order) {
            if (order.status === 'Delivered') {
                confirmMessage = 'Are you sure you want to request a return for this order?';
            } else if (order.status === 'Pending') {
                confirmMessage = 'Are you sure you want to request cancellation for this order? An admin will review it.';
            }
        }

        if (window.confirm(confirmMessage)) {
            try {
                const response = await cancelOrder(orderId);
                toast.success(response || 'Request submitted successfully!');
                fetchOrderHistory();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to submit request.");
            }
        }
    };

     if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    return (
        <div className="container mx-auto py-10">
             <h1 className="text-3xl font-bold mb-6">My Orders</h1>
            {orders.length > 0 ? (
                orders.map(order => (
                    <OrderCard key={order.id} order={order} onCancelRequest={handleCancelRequest} reviews={reviews} />
                ))
            ) : (
                <div className="text-center py-12">
                     <p className="text-gray-600 text-lg mb-6">You have no orders yet.</p>
                     <Link to="/books">
                         <Button>Browse Books</Button>
                     </Link>
                </div>
            )}
        </div>
    );
};

export default MyOrders;