// Pahana/pahanaedu-frontend/src/components/GuestCheckoutModal.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';

const GuestCheckoutModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="relative mx-auto p-8 border w-full max-w-md shadow-lg rounded-md bg-white text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Wait a second!</h3>
                <p className="text-gray-700 mb-6">
                    You're missing out on special discounts and a faster checkout experience. Register now to unlock these benefits!
                </p>
                <div className="flex justify-center gap-4">
                    <Button onClick={onClose} variant="outline">
                        Continue as Guest
                    </Button>
                    <Link to="/register">
                        <Button>Register Now</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GuestCheckoutModal;