// src/App.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Spinner from './components/ui/Spinner';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ProfileLayout from './pages/ProfileLayout'; // Import the new layout
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import MyReviews from './pages/MyReviews'; // Import the new page
import MyCoupons from './pages/MyCoupons'; // Import the new page
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Dashboard from './pages/admin/Dashboard';
import BookManagement from './pages/admin/BookManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import AdminManagement from './pages/admin/AdminManagement';
import AdminRoute from './components/auth/AdminRoute';
import PrivateRoute from './components/auth/PrivateRoute';
import OrderHistoryModal from './components/profile/OrderHistoryModal';
import GuestOrderConfirmation from './pages/GuestOrderConfirmation';

const AppContent = () => {
    const { loading } = useAuth();
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            {!isAdminPage && <Header />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/register" element={<Auth />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/book/:id" element={<BookDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation/:id" element={<GuestOrderConfirmation />} />

                    {/* Updated Protected User Routes with Layout */}
                    <Route path="/profile" element={<PrivateRoute />}>
                        <Route element={<ProfileLayout />}>
                            <Route index element={<Profile />} />
                            <Route path="my-orders" element={<MyOrders />} />
                            <Route path="my-orders/:id" element={<OrderHistoryModal />} />
                            <Route path="my-reviews" element={<MyReviews />} />
                            <Route path="coupons" element={<MyCoupons />} />
                        </Route>
                    </Route>

                    {/* Protected Admin Routes */}
                    <Route path="/admin" element={<AdminRoute />}>
                        <Route path="" element={<Admin />}>
                            <Route index element={<Dashboard />} />
                            <Route path="books" element={<BookManagement />} />
                            <Route path="orders" element={<OrderManagement />} />
                            <Route path="customers" element={<CustomerManagement />} />
                            <Route path="admins" element={<AdminManagement />} />
                        </Route>
                    </Route>

                
                </Routes>
            </main>
            {!isAdminPage && <Footer />}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <AppContent />
            </CartProvider>
        </AuthProvider>
    );
}

export default App;