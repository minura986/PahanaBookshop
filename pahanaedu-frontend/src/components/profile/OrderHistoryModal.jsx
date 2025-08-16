// Pahana/pahanaedu-frontend/src/components/profile/OrderHistoryModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { getUserOrderHistory, cancelOrder } from '../../services/user';
import { getReviewsByUser } from '../../services/review';
import Spinner from '../ui/Spinner';
import Invoice from '../Invoice';
import ReactDOMServer from 'react-dom/server';

const OrderHistoryModal = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const { addToCart } = useCart();
    const componentRef = useRef();

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const orderData = await getUserOrderHistory();
                const foundOrder = orderData.find(o => o.id === id);
                setOrder(foundOrder);
                const reviewData = await getReviewsByUser();
                setReviews(reviewData);
            } catch (error) {
                toast.error("Failed to fetch order details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    const handlePrint = () => {
        const invoiceHTML = ReactDOMServer.renderToString(<Invoice order={order} />);
        const printWindow = window.open('', '_blank', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print Invoice</title>');
        printWindow.document.write('<link rel="stylesheet" href="/src/index.css" type="text/css" />');
        printWindow.document.write('</head><body>');
        printWindow.document.write(invoiceHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    const handleCancelRequest = async (orderId) => {
        let confirmMessage = 'Are you sure you want to proceed with this request?';
        if (order) {
            if (order.status === 'Delivered' || order.status === 'Shipped') {
                confirmMessage = 'Are you sure you want to request a return for this order?';
            } else if (order.status === 'Pending') {
                confirmMessage = 'Are you sure you want to request cancellation for this order? An admin will review it.';
            }
        }

        if (window.confirm(confirmMessage)) {
            try {
                const response = await cancelOrder(orderId);
                toast.success(response || 'Request submitted successfully!');
                const orderData = await getUserOrderHistory();
                const foundOrder = orderData.find(o => o.id === id);
                setOrder(foundOrder);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to submit request.");
            }
        }
    };

    const handleAddToCart = (item) => {
        const bookToAdd = {
            id: item.bookId,
            title: item.title,
            price: item.price,
            author: 'N/A',
            description: '',
            stock: 1,
            imageUrl: '',
            category: 'N/A'
        };
        addToCart(bookToAdd, item.quantity);
        toast.success(`${item.title} has been added back to your cart!`);
    };

    const getReturnOrCancelText = (status) => {
        if(status === 'Delivered' || status === 'Shipped') return 'Request Return/Refund';
        if(status === 'Pending') return 'Request Cancellation';
        return 'Returns/Refunds';
    }

    const renderActionButton = () => {
        if (!order) return null;
        
        const hasReviewed = order.items.some(item => reviews.some(review => review.bookId === item.bookId));

        if (order.status === 'Pending') {
            return (
                <Button variant="outline" onClick={() => handleCancelRequest(order.id)}>
                    Request Cancellation
                </Button>
            );
        }
        if (order.status === 'Delivered') {
            if (hasReviewed) {
                return null;
            }
            return (
                <Button variant="outline" onClick={() => handleCancelRequest(order.id)}>
                    Request Return/Refund
                </Button>
            );
        }
        if (order.status === 'Shipped' || order.status === 'Refunded') {
            return null;
        }
        return (
            <Button variant="outline" disabled>
                {getReturnOrCancelText(order.status)}
            </Button>
        );
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    if (!order) {
        return <div className="text-center py-10">Order not found.</div>;
    }
    
    return (
        <div className="container mx-auto py-10 px-4">
             <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <div className="flex items-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <h4 className="font-bold text-lg">Delivery Address</h4>
                    </div>
                    <div className="text-gray-700 space-y-1 pl-8">
                        <p className="font-semibold">{order.firstName} {order.lastName}</p>
                        <p>{order.shippingAddressLine1}</p>
                        {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
                        <p>{order.shippingCity}, {order.shippingPostalCode}</p>
                        <p>{order.shippingCountry}</p>
                        <p>{order.phoneNumber}</p>
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-lg shadow-md">
                     <div className="flex items-center mb-3">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        <h4 className="font-bold text-lg">Order Information</h4>
                    </div>
                    <div className="space-y-1 pl-8 text-gray-700">
                        <div className="flex justify-between items-center">
                            <span>Order ID: {order.id}</span>
                            <button onClick={() => navigator.clipboard.writeText(order.id)} className="text-primary text-sm font-semibold">Copy</button>
                        </div>
                        <p>Order placed on: {new Date(order.orderDate).toLocaleDateString()}</p>
                        { (order.status === 'Shipped' || order.status === 'Delivered') &&
                            <p>Shipment completed on: {new Date(order.orderDate).toLocaleDateString()}</p>
                        }
                        { order.status === 'Delivered' &&
                            <p>Order completed on: {new Date(order.orderDate).toLocaleDateString()}</p>
                        }
                         <p>Status: <span className="font-semibold">{order.status || 'Pending'}</span></p>

                        {order.status === 'Return Approved' && (
                             <div className="mt-4 p-4 border-t">
                                <h4 className="font-semibold text-lg mb-2">Return Address</h4>
                                <p className="whitespace-pre-line">{order.returnAddress}</p>
                            </div>
                        )}
                         <div className="mt-4">
                            <Button onClick={handlePrint}>Print Invoice</Button>
                        </div>
                    </div>
                 </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h4 className="font-semibold text-gray-800 mb-3 text-lg">Items in your order</h4>
                {order.items.map(item => (
                    <div key={item.bookId} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4 border-b pb-4">
                        <div className="flex items-start gap-4 col-span-2">
                             <img src={item.imageUrl} alt={item.title} className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0 object-cover" />
                            <div className="flex-grow">
                                <p className="font-medium text-lg">{item.title}</p>
                                <p className="text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
                                <p className="text-sm text-blue-600">Free returns</p>
                                <p className="text-sm text-green-600">Delivery guarantee</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                             {order.status === 'Delivered' && <Button size="sm" variant="primary" onClick={() => handleAddToCart(item)}>Buy Again</Button>}
                        </div>
                    </div>
                ))}
                
                <div className="flex justify-between items-center border-t pt-4 mt-4">
                    <div>
                         <p className="text-gray-600">Subtotal: <span className="font-semibold">${order.totalAmount.toFixed(2)}</span></p>
                         <p className="text-xl font-bold">Total: <span className="font-bold">${order.totalAmount.toFixed(2)}</span></p>
                    </div>

                    {renderActionButton()}
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryModal;