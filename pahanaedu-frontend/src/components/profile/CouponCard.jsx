import React from 'react';
import { toast } from 'react-toastify';

const CouponCard = ({ isUsed, onActivate, isCouponApplied }) => {
    if (isUsed) {
        return (
            <div className="bg-gray-200 p-4 rounded-lg text-center border-2 border-dashed">
                <h3 className="text-lg font-semibold text-gray-500">First Order Coupon</h3>
                <p className="text-2xl font-bold text-gray-400 my-2">10% OFF</p>
                <p className="text-gray-500">You have already used your first order coupon.</p>
            </div>
        );
    }

    if (isCouponApplied) {
        return (
            <div className="bg-green-500 text-white p-4 rounded-lg text-center border-2 border-green-600">
                <h3 className="text-lg font-semibold">Coupon Activated!</h3>
                <p className="text-2xl font-bold my-2">10% OFF</p>
                <p>Your discount will be applied at checkout.</p>
            </div>
        );
    }

    const handleActivate = () => {
        onActivate();
        toast.success("Coupon activated! 10% discount will be applied at checkout.");
    };

    return (
        <div
            className="bg-red-500 text-white p-4 rounded-lg cursor-pointer hover:bg-red-600 transition-all text-center"
            onClick={handleActivate}
        >
            <p className="text-sm">From: Pahana EDU</p>
            <h3 className="text-2xl font-bold my-2">10% OFF</h3>
            <p>Your first order of any amount</p>
            <p className="text-xs mt-2 font-semibold">Click to Activate</p>
        </div>
    );
};

export default CouponCard;