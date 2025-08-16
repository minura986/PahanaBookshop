import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isCouponApplied, setIsCouponApplied] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const applyCoupon = () => {
        setIsCouponApplied(true);
    };

    const removeCoupon = () => {
        setIsCouponApplied(false);
    };

    const addToCart = (book, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === book.id);

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === book.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { ...book, quantity }];
            }
        });
    };

    const removeFromCart = (bookId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== bookId));
    };

    const updateQuantity = (bookId, quantity) => {
        if (quantity < 1) {
            removeFromCart(bookId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === bookId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        setIsCouponApplied(false);
    };
    
    const subtotal = cartItems.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
    );

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <CartContext.Provider value={{
            cartItems,
            subtotal,
            isCouponApplied,
            applyCoupon,
            removeCoupon,
            cartCount,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);