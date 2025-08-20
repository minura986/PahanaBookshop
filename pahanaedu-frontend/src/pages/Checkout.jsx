// Pahana/pahanaedu-frontend/src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/admin';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import CouponCard from '../components/profile/CouponCard';
import GuestCheckoutModal from '../components/GuestCheckoutModal';

const Checkout = () => {
    const { cartItems, subtotal, isCouponApplied, applyCoupon, clearCart } = useCart();
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [useDifferentAddress, setUseDifferentAddress] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const [guestDetails, setGuestDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });
    
    const [errors, setErrors] = useState({
        guest: {},
        shipping: {}
    });
    
    const [tieredDiscountMessageShown, setTieredDiscountMessageShown] = useState(false);
    const [showGuestModal, setShowGuestModal] = useState(false);

    // --- DISCOUNT LOGIC ---
    const canApplyFirstOrderCoupon = user && !user.hasPlacedOrder;
    let couponDiscount = 0;
    let couponDiscountMessage = '';
    let tieredDiscount = 0;
    let tieredDiscountMessageText = '';

    if (isCouponApplied && canApplyFirstOrderCoupon) {
        couponDiscount = subtotal * 0.10;
        couponDiscountMessage = 'First-Order Coupon (10%)';
    }

    if (user) {
        if (subtotal > 15000) {
            tieredDiscount = subtotal * 0.15;
            tieredDiscountMessageText = 'A 15% discount has been applied to your order!';
        } else if (subtotal > 10000) {
            tieredDiscount = subtotal * 0.10;
            tieredDiscountMessageText = 'A 10% discount has been applied to your order!';
        } else if (subtotal > 8000) {
            tieredDiscount = subtotal * 0.05;
            tieredDiscountMessageText = 'A 5% discount has been applied to your order!';
        }
    }
    const finalTotal = subtotal - couponDiscount - tieredDiscount;
    // --- END OF LOGIC ---

    useEffect(() => {
        if (user && !useDifferentAddress) {
            setShippingAddress({
                addressLine1: user.defaultAddressLine1 || '',
                addressLine2: user.defaultAddressLine2 || '',
                city: user.defaultCity || '',
                postalCode: user.defaultPostalCode || '',
                country: user.defaultCountry || '',
            });
        }
    }, [user, useDifferentAddress]);

    useEffect(() => {
        if (tieredDiscount > 0 && !tieredDiscountMessageShown) {
            toast.info(tieredDiscountMessageText);
            setTieredDiscountMessageShown(true);
        } else if (tieredDiscount === 0 && tieredDiscountMessageShown) {
            setTieredDiscountMessageShown(false);
        }
    }, [tieredDiscount, tieredDiscountMessageText, tieredDiscountMessageShown]);

    useEffect(() => {
        if (!user) {
            setShowGuestModal(true);
        }
    }, [user]);

    const validateGuestField = (name, value) => {
        let error = '';
        
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value.trim()) error = 'This field is required';
                break;
            case 'email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!value.includes('@')) {
                    error = 'Email must contain @ symbol';
                }
                break;
            case 'phoneNumber':
                if (!value.trim()) {
                    error = 'Phone number is required';
                } else if (!/^07\d{8}$/.test(value)) {
                    error = 'Phone number must start with 07 and have 10 digits total';
                }
                break;
            default:
                break;
        }
        
        return error;
    };

    const validateShippingField = (name, value) => {
        if (!value.trim()) return 'This field is required';
        return '';
    };

    const handleShippingAddressChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress({ ...shippingAddress, [name]: value });
        
        const error = validateShippingField(name, value);
        setErrors(prev => ({
            ...prev,
            shipping: { ...prev.shipping, [name]: error }
        }));
    };

    const handleGuestDetailsChange = (e) => {
        const { name, value } = e.target;
        setGuestDetails({ ...guestDetails, [name]: value });
        
        const error = validateGuestField(name, value);
        setErrors(prev => ({
            ...prev,
            guest: { ...prev.guest, [name]: error }
        }));
    };

    const validateForm = () => {
        const newErrors = { guest: {}, shipping: {} };
        
        if (!user) {
            Object.keys(guestDetails).forEach(key => {
                newErrors.guest[key] = validateGuestField(key, guestDetails[key]);
            });
        }
        
        if (!user || useDifferentAddress) {
            Object.keys(shippingAddress).forEach(key => {
                newErrors.shipping[key] = validateShippingField(key, shippingAddress[key]);
            });
        }
        
        setErrors(newErrors);
        
        const hasErrors = Object.values(newErrors.guest).some(error => error) || 
                         Object.values(newErrors.shipping).some(error => error);
        
        return !hasErrors;
    };

    const handleCheckout = async () => {
        if (!validateForm()) {
            toast.error('Please fix the form errors');
            return;
        }

        const order = {
            userId: user ? user.id : null,
            firstName: user ? user.firstName : guestDetails.firstName,
            lastName: user ? user.lastName : guestDetails.lastName,
            email: user ? user.email : guestDetails.email,
            phoneNumber: user ? user.phoneNumber : guestDetails.phoneNumber,
            items: cartItems.map(item => ({
                bookId: item.id,
                title: item.title,
                quantity: item.quantity,
                price: item.price,
                imageUrl: item.imageUrl
            })),
            totalAmount: finalTotal,
            shippingAddressLine1: shippingAddress.addressLine1,
            shippingAddressLine2: shippingAddress.addressLine2,
            shippingCity: shippingAddress.city,
            shippingPostalCode: shippingAddress.postalCode,
            shippingCountry: shippingAddress.country
        };

        try {
            const savedOrder = await createOrder(order);
            toast.success('Order placed successfully!');
            
            if(user) {
                setUser(currentUser => ({
                    ...currentUser,
                    hasPlacedOrder: true
                }));
                 clearCart();
                navigate('/profile/my-orders');
            } else {
                clearCart();
                navigate(`/order-confirmation/${savedOrder.id}`);
            }
        } catch (error) {
            toast.error('Failed to place order.');
            console.error('Checkout error:', error.response?.data || error);
        }
    };

    return (
        <div className="container mx-auto py-10">
            {showGuestModal && <GuestCheckoutModal onClose={() => setShowGuestModal(false)} />}
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                         {user ? (
                             <>
                                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                                <p className="mb-1">{user.firstName} {user.lastName}</p>
                                <p className="mb-1 text-gray-600">{user.email}</p>
                                <p className="text-gray-600">{user.phoneNumber}</p>
                             </>
                         ) : (
                             <div>
                                <h3 className="text-lg font-semibold mb-3">Guest Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input type="text" name="firstName" placeholder="First Name" value={guestDetails.firstName} onChange={handleGuestDetailsChange} className="w-full px-3 py-2 border rounded" required />
                                        {errors.guest.firstName && <p className="text-red-500 text-sm mt-1">{errors.guest.firstName}</p>}
                                    </div>
                                    <div>
                                        <input type="text" name="lastName" placeholder="Last Name" value={guestDetails.lastName} onChange={handleGuestDetailsChange} className="w-full px-3 py-2 border rounded" required />
                                        {errors.guest.lastName && <p className="text-red-500 text-sm mt-1">{errors.guest.lastName}</p>}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <input type="email" name="email" placeholder="Email" value={guestDetails.email} onChange={handleGuestDetailsChange} className="w-full px-3 py-2 border rounded" required />
                                    {errors.guest.email && <p className="text-red-500 text-sm mt-1">{errors.guest.email}</p>}
                                </div>
                                <div className="mt-4">
                                    <input type="tel" name="phoneNumber" placeholder="Phone Number (07XXXXXXX)" value={guestDetails.phoneNumber} onChange={handleGuestDetailsChange} className="w-full px-3 py-2 border rounded" required />
                                    {errors.guest.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.guest.phoneNumber}</p>}
                                </div>
                            </div>
                         )}

                        {user && (
                            <div className="mt-4 mb-4">
                                <input
                                    type="checkbox"
                                    id="useDifferentAddress"
                                    checked={useDifferentAddress}
                                    onChange={(e) => setUseDifferentAddress(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="useDifferentAddress" className="text-gray-700">Use a different shipping address</label>
                            </div>
                        )}

                        {(useDifferentAddress || !user) && (
                            <div className="mb-6 p-4 border rounded-md bg-gray-50 mt-4">
                                <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                                 <div className="mb-4">
                                    <label className="block text-gray-700">Address Line 1</label>
                                    <input type="text" name="addressLine1" value={shippingAddress.addressLine1} onChange={handleShippingAddressChange} className="w-full px-3 py-2 border rounded" required />
                                    {errors.shipping.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.shipping.addressLine1}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Address Line 2 (Optional)</label>
                                    <input type="text" name="addressLine2" value={shippingAddress.addressLine2} onChange={handleShippingAddressChange} className="w-full px-3 py-2 border rounded" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">City</label>
                                    <input type="text" name="city" value={shippingAddress.city} onChange={handleShippingAddressChange} className="w-full px-3 py-2 border rounded" required />
                                    {errors.shipping.city && <p className="text-red-500 text-sm mt-1">{errors.shipping.city}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Postal Code</label>
                                    <input type="text" name="postalCode" value={shippingAddress.postalCode} onChange={handleShippingAddressChange} className="w-full px-3 py-2 border rounded" required />
                                    {errors.shipping.postalCode && <p className="text-red-500 text-sm mt-1">{errors.shipping.postalCode}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Country</label>
                                    <input type="text" name="country" value={shippingAddress.country} onChange={handleShippingAddressChange} className="w-full px-3 py-2 border rounded" required />
                                    {errors.shipping.country && <p className="text-red-500 text-sm mt-1">{errors.shipping.country}</p>}
                                </div>
                            </div>
                        )}
                         {user && !useDifferentAddress && (
                            <div className="mb-6 p-4 border rounded-md bg-gray-50">
                                <h3 className="text-lg font-semibold mb-3">Default Shipping Address</h3>
                                <p>{user.defaultAddressLine1}</p>
                                {user.defaultAddressLine2 && <p>{user.defaultAddressLine2}</p>}
                                <p>{user.defaultCity}, {user.defaultPostalCode}</p>
                                <p>{user.defaultCountry}</p>
                            </div>
                        )}
                    </div>
                    {user && !user.hasPlacedOrder && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Available Coupons</h2>
                            <CouponCard
                                isUsed={user.hasPlacedOrder}
                                onActivate={applyCoupon}
                                isCouponApplied={isCouponApplied}
                            />
                        </div>
                    )}
                </div>
                <div>

                    <div className="bg-white p-6 rounded-lg shadow-md">

                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>Rs.{subtotal.toFixed(2)}</span>
                            </div>

                            {couponDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>{couponDiscountMessage}</span>
                                    <span>-Rs.{couponDiscount.toFixed(2)}</span>
                                </div>
                            )}

                             {tieredDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>{tieredDiscountMessageText}</span>
                                    <span>-Rs.{tieredDiscount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>Rs.0.00</span>
                            </div>

                            <div className="flex justify-between border-t pt-4 font-bold text-lg">
                                <span>Total</span>
                                <span>Rs.{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark mt-6"
                            disabled={cartItems.length === 0}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;