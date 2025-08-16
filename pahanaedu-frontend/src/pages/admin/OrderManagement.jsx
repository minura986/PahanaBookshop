// Pahana/pahanaedu-frontend/src/pages/admin/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { getAllOrders } from '../../services/admin';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import { toast } from 'react-toastify';
import Spinner from '../../components/ui/Spinner';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getAllOrders();
            setOrders(data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
        } catch (error) {
            toast.error('Failed to fetch orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Order Management</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-4">Order ID</th>
                        <th className="text-left p-4">Customer</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Total</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <td className="p-4 font-mono text-sm">{order.id}</td>
                            <td className="p-4">{order.firstName} {order.lastName}</td>
                            <td className="p-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td className="p-4">Rs.{order.totalAmount.toFixed(2)}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'Shipped' ? 'bg-orange-100 text-orange-800' :
                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                    order.status === 'Cancellation Approved' ? 'bg-purple-100 text-purple-800' :
                                    order.status === 'Return Approved' ? 'bg-teal-100 text-teal-800' :
                                    order.status === 'Cancellation Requested' || order.status === 'Return Requested' ? 'bg-orange-100 text-orange-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {order.status || 'Pending'}
                                </span>
                            </td>
                            <td className="p-4">
                                <button className="text-primary hover:underline">View Details</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdate={() => {
                        fetchOrders();
                        setSelectedOrder(null);
                    }}
                />
            )}
        </div>
    );
};

export default OrderManagement;