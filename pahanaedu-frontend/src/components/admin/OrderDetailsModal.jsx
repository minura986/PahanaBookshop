// Pahana/pahanaedu-frontend/src/components/admin/OrderDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { updateOrderStatus } from '../../services/admin';
import { toast } from 'react-toastify';
import ReviewDisplay from './ReviewDisplay'; // Import the new component

const OrderDetailsModal = ({ order, onClose, onUpdate }) => {
    const [currentStatus, setCurrentStatus] = useState(order.status);
    const [returnAddress, setReturnAddress] = useState(order.returnAddress || '');
    const [selectedAction, setSelectedAction] = useState('');
    const [showReviews, setShowReviews] = useState({});

    useEffect(() => {
        setCurrentStatus(order.status);
    }, [order]);

    const handleStatusUpdate = async (newStatus) => {
        if (!newStatus) {
            toast.error("Please select a status to update.");
            return;
        }
        try {
            await updateOrderStatus(order.id, newStatus, returnAddress);
            onUpdate();
            toast.success(`Order status updated to ${newStatus}`);
            onClose(); // Close modal after successful update
        } catch (error) {
            toast.error('Failed to update order status.');
        }
    };

    const toggleReviews = (bookId) => {
        setShowReviews(prevState => ({
            ...prevState,
            [bookId]: !prevState[bookId]
        }));
    };

    const normalStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    
    const exceptionStatuses = [
        'Cancellation Requested',
        'Cancellation Approved',
        'Return Requested',
        'Return Approved',
        'Items Returned',
        'Refunded'
    ];
    
    const isException = exceptionStatuses.includes(order.status);

    const getAvailableActions = () => {
        switch (order.status) {
            case 'Cancellation Requested':
                return ['Cancellation Approved', 'Refunded'];
            case 'Cancellation Approved':
                return ['Refunded'];
            case 'Return Requested':
                return ['Return Approved', 'Refunded'];
            case 'Return Approved':
                return ['Items Returned', 'Refunded'];
            default:
                return [];
        }
    };

    const availableActions = getAvailableActions();

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
            <div className="relative mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-xl bg-white">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <h4 className="font-bold text-lg mb-3">Customer & Shipping</h4>
                        <div className="text-gray-700 space-y-1">
                            <p className="font-semibold">{order.firstName} {order.lastName}</p>
                            <p>{order.shippingAddressLine1}</p>
                            {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
                            <p>{order.shippingCity}, {order.shippingPostalCode}</p>
                            <p>{order.shippingCountry}</p>
                            <p>{order.phoneNumber}</p>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        {!isException && (
                             <div className="bg-gray-50 p-4 rounded-lg border">
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <p className="font-semibold">Order ID: {order.id}</p>
                                        <p className="text-sm text-gray-600">Placed on: {new Date(order.orderDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className='text-right'>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Order Status</label>
                                        <select
                                            id="status"
                                            value={currentStatus}
                                            onChange={(e) => handleStatusUpdate(e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                        >
                                            {normalStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                       
                        {isException && (
                            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4" role="alert">
                                <p className="font-bold">Action Required</p>
                                <p>Current Status: <span className="font-semibold">{order.status}</span>.</p>
                                
                                {availableActions.length > 0 ? (
                                    <div className="mt-4">
                                        <label htmlFor="action" className="block text-sm font-medium text-orange-900">Select Action</label>
                                        <select
                                            id="action"
                                            value={selectedAction}
                                            onChange={(e) => setSelectedAction(e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-orange-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md bg-white"
                                        >
                                            <option value="">-- Choose Resolution --</option>
                                            {availableActions.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>

                                        {selectedAction === 'Return Approved' && (
                                            <div className="mt-2">
                                                <label htmlFor="returnAddress" className="block text-sm font-medium text-orange-900">Return Address</label>
                                                <textarea id="returnAddress" rows="3" value={returnAddress} onChange={(e) => setReturnAddress(e.target.value)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
                                            </div>
                                        )}

                                        <button onClick={() => handleStatusUpdate(selectedAction)} className="mt-3 bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600">
                                            Process Request
                                        </button>
                                    </div>
                                ) : <p className="mt-2">No further actions required at this stage.</p>}
                            </div>
                        )}

                        <div className="mt-6">
                           <h4 className="font-bold text-lg mb-3">Order Items</h4>
                           <div className="space-y-4">
                               {order.items.map(item => (
                                   <div key={item.bookId}>
                                       <div className="flex items-start gap-4 p-2 border-b">
                                           <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                                           <div className="flex-grow">
                                               <p className="font-semibold">{item.title}</p>
                                               <p className="text-sm text-gray-500">Rs.{item.price.toFixed(2)} x {item.quantity}</p>
                                               <button
                                                   onClick={() => toggleReviews(item.bookId)}
                                                   className="text-primary text-sm font-semibold mt-1"
                                               >
                                                   {showReviews[item.bookId] ? 'Hide Reviews' : 'Show Reviews'}
                                               </button>
                                           </div>
                                           <p className="font-semibold">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                                       </div>
                                       {showReviews[item.bookId] && <ReviewDisplay bookId={item.bookId} userId={order.userId} />}
                                   </div>
                               ))}
                           </div>
                           <div className="text-right mt-4">
                               <p className="text-xl font-bold">Total: Rs.{order.totalAmount.toFixed(2)}</p>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;