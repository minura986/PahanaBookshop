import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, getUserOrders } from '../../services/admin';
import OrderHistoryModal from '../../components/admin/OrderHistoryModal';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import { toast } from 'react-toastify';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const data = await getAllUsers();
            const customerUsers = data.filter(user => !user.roles.includes('ROLE_ADMIN'));
            setCustomers(customerUsers);
        } catch (error) {
            toast.error('Failed to fetch customers.');
        }
    };

    const handleDelete = async (customerId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(customerId);
                toast.success('User deleted successfully!');
                fetchCustomers();
            } catch (error) {
                toast.error('Failed to delete user.');
            }
        }
    };

    const handleViewHistory = async (customer) => {
        try {
            const orders = await getUserOrders(customer.id);
            setOrderHistory(orders);
            setSelectedCustomer(customer);
            setIsHistoryOpen(true);
        } catch (error) {
            toast.error("Failed to fetch order history.");
        }
    };

    const handleSelectOrderFromHistory = (order) => {
        setSelectedOrder(order);
    };
    
    const handleCloseHistory = () => {
        setIsHistoryOpen(false);
        setSelectedCustomer(null);
        setOrderHistory([]);
    }

    const handleCloseDetails = () => {
        setSelectedOrder(null);
    }

    const handleUpdateDetails = async () => {
        if (selectedCustomer) {
            const orders = await getUserOrders(selectedCustomer.id);
            setOrderHistory(orders);
        }
        setSelectedOrder(null);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Customer Management</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-4">Username</th>
                        <th className="text-left p-4">Email</th>
                        <th className="text-left p-4">Full Name</th>
                        <th className="text-left p-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id} className="border-b">
                            <td className="p-4">{customer.username}</td>
                            <td className="p-4">{customer.email}</td>
                            <td className="p-4">{customer.firstName} {customer.lastName}</td>
                            <td className="p-4">
                                <button onClick={() => handleViewHistory(customer)} className="text-blue-500 hover:underline mr-4">Order History</button>
                                <button onClick={() => alert('Edit feature coming soon!')} className="text-green-500 hover:underline mr-4">Edit</button>
                                <button onClick={() => handleDelete(customer.id)} className="text-red-500 hover:underline">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {isHistoryOpen && (
                <OrderHistoryModal
                    orders={orderHistory}
                    customerName={selectedCustomer?.username}
                    onClose={handleCloseHistory}
                    onSelectOrder={handleSelectOrderFromHistory}
                />
            )}
            
            {selectedOrder && (
                 <OrderDetailsModal
                    order={selectedOrder}
                    onClose={handleCloseDetails}
                    onUpdate={handleUpdateDetails}
                />
            )}
        </div>
    );
};

export default CustomerManagement;