// Pahana/pahanaedu-frontend/src/pages/GuestOrderConfirmation.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getGuestOrderById } from '../services/user';
import Spinner from '../components/ui/Spinner';
import Invoice from '../components/Invoice';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';
import ReactDOMServer from 'react-dom/server';

const GuestOrderConfirmation = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const invoiceRef = useRef();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await getGuestOrderById(id);
                setOrder(orderData);
            } catch (error) {
                toast.error("Could not retrieve order details.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handlePrint = () => {
        const invoiceHTML = ReactDOMServer.renderToString(<Invoice order={order} />);
        const printWindow = window.open('', '_blank', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print Invoice</title>');
        printWindow.document.write('<link rel="stylesheet" href="/src/index.css" type="text/css" />'); // Link to your stylesheet
        printWindow.document.write('</head><body>');
        printWindow.document.write(invoiceHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    if (!order) return <div className="text-center py-10"><h2>Order Not Found</h2><p>We couldn't find the order details. Please check the ID and try again.</p></div>;

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You For Your Order!</h1>
                <p className="text-gray-700 mb-2">Your order has been placed successfully.</p>
                <p className="text-gray-600 mb-6">Your Order ID is: <span className="font-semibold text-primary">{order.id}</span></p>
                <p className="text-gray-600 mb-8">Keep this ID for your records. You can use it to track your order.</p>

                <div className="text-left border-t pt-6">
                    <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                    <Invoice ref={invoiceRef} order={order} />
                </div>
                
                <Button onClick={handlePrint} className="mt-6">
                    Print Invoice
                </Button>
            </div>
        </div>
    );
};

export default GuestOrderConfirmation;