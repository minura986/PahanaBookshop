import React from 'react';

// A simple card to summarize an order within the history modal
const OrderSummaryCard = ({ order, onSelect }) => (
    <div className="border rounded-lg p-3 mb-3 hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(order)}>
        <div className="flex justify-between items-center">
            <div>
                <p className="font-semibold text-primary">Order ID: {order.id}</p>
                <p className="text-sm text-gray-600">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
                <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                <p className={`text-sm font-medium ${
                    order.status === 'Delivered' ? 'text-green-600' :
                    order.status === 'Cancelled' ? 'text-red-600' :
                    'text-yellow-600'
                }`}>{order.status}</p>
            </div>
        </div>
    </div>
);

const OrderHistoryModal = ({ orders, customerName, onClose, onSelectOrder }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Order History for {customerName}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
                <div className="overflow-auto max-h-96">
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <OrderSummaryCard key={order.id} order={order} onSelect={onSelectOrder} />
                        ))
                    ) : (
                        <p>No orders found for this customer.</p>
                    )}
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-md">Close</button>
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryModal;