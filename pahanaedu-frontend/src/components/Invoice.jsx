// Pahana/pahanaedu-frontend/src/components/Invoice.jsx
import React from 'react';

const Invoice = React.forwardRef(({ order }, ref) => {
    if (!order) return null;

    return (
        <div ref={ref} className="p-8 bg-white text-gray-900">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Invoice</h1>
                    <p className="text-gray-600">Order ID: {order.id}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-xl">Pahana EDU Bookshop</p>
                    <p className="text-gray-600">123 Bookworm Lane, Colombo</p>
                    <p className="text-gray-600">info@pahanaedu.com</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h2 className="text-lg font-semibold mb-2">Billed To:</h2>
                    <p>{order.firstName} {order.lastName}</p>
                    <p>{order.shippingAddressLine1}</p>
                    {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
                    <p>{order.shippingCity}, {order.shippingPostalCode}</p>
                    <p>{order.shippingCountry}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-semibold">Invoice Date:</span> {new Date().toLocaleDateString()}</p>
                    <p><span className="font-semibold">Order Date:</span> {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
            </div>

            <table className="w-full mb-8">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-3">Item</th>
                        <th className="text-center p-3">Quantity</th>
                        <th className="text-right p-3">Price</th>
                        <th className="text-right p-3">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map(item => (
                        <tr key={item.bookId} className="border-b">
                            <td className="p-3">{item.title}</td>
                            <td className="text-center p-3">{item.quantity}</td>
                            <td className="text-right p-3">Rs.{item.price.toFixed(2)}</td>
                            <td className="text-right p-3">Rs.{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end">
                <div className="w-full md:w-1/3">
                    <div className="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>Rs.{order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Shipping:</span>
                        <span>Rs.0.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl border-t pt-2">
                        <span>Total:</span>
                        <span>Rs.{order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="text-center mt-12 text-gray-600">
                <p>Thank you for your purchase!</p>
            </div>
        </div>
    );
});

export default Invoice;