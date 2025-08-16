// Pahana/pahanaedu-frontend/src/pages/MyCoupons.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CouponCard from '../components/profile/CouponCard';

const MyCoupons = () => {
    const { user } = useAuth();
    const { applyCoupon, isCouponApplied } = useCart();

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Available Coupons</h2>
            <div className="max-w-sm">
                 <CouponCard
                    isUsed={user.hasPlacedOrder}
                    onActivate={applyCoupon}
                    isCouponApplied={isCouponApplied}
                />
            </div>
             <div className="mt-6 p-4 border rounded-md bg-gray-50">
                <h3 className="text-lg font-semibold mb-3">Tiered Discounts</h3>
                <p className="text-gray-600">You also get automatic discounts at checkout based on your order total!</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><span className="font-semibold">5% OFF</span> on orders above $8000</li>
                    <li><span className="font-semibold">10% OFF</span> on orders above $10000</li>
                    <li><span className="font-semibold">15% OFF</span> on orders above $15000</li>
                </ul>
            </div>
        </div>
    );
};

export default MyCoupons;