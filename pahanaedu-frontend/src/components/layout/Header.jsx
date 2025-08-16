// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import SearchBar from '../SearchBar';

const Header = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
        setDropdownOpen(false);
    };

    const cartItemCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/books?search=${searchTerm}`);
            setSearchTerm('');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-primary flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.32,17.22a1.06,1.06,0,0,0,.15.18,1,1,0,0,0,.71.28,1,1,0,0,0,.71-0.29l1.41-1.42A3,3,0,0,1,8.41,15H15.6a3,3,0,0,1,2.12,0.88l1.42,1.42a1,1,0,0,0,1.41-1.41L19.14,14.5a5,5,0,0,0-3.54-1.47H8.41a5,5,0,0,0-3.54,1.46Z"/>
                        <path d="M12,2A3.2,3.2,0,0,0,9,5.2C9,7.19,12,12,12,12s3-4.81,3-6.8A3.2,3.2,0,0,0,12,2Z"/>
                    </svg>
                    Pahana EDU
                </Link>

                <nav className="hidden md:flex space-x-6 items-center">
                    {user?.roles?.includes('ROLE_ADMIN') && (
                        <Link to="/admin" className="hover:text-primary transition-colors">Admin Panel</Link>
                    )}
                </nav>

                <form onSubmit={handleSearch} className="hidden md:flex items-center flex-grow mx-4">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <Button type="submit" className="ml-2">Search</Button>
                </form>

                <div className="flex items-center space-x-4">
                    <Link to="/cart" className="relative hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="relative hidden md:block" ref={dropdownRef}>
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 cursor-pointer">
                                {user.profileImageUrl ? (
                                    <img
                                        src={user.profileImageUrl}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8" />
                                )}
                                <span className="hover:text-primary transition-colors">{user.username}</span>
                                <svg className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Profile</Link>
                                    <Link to="/profile/my-orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>My Orders</Link>
                                    <Link to="/profile/coupons" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Coupons</Link>
                                    <div className="border-t my-1"></div>
                                    <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                         <div className="hidden md:flex items-center space-x-2">
                            <Link to="/login"><Button variant="outline">Login</Button></Link>
                            <Link to="/register"><Button>Register</Button></Link>
                        </div>
                    )}

                    <div className="md:hidden">
                         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                 <div className="md:hidden bg-white border-t">
                    <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
                        <form onSubmit={handleSearch} className="flex items-center py-2">
                            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            <Button type="submit" className="ml-2">Search</Button>
                        </form>
                        {user?.roles?.includes('ADMIN') && (
                            <Link to="/admin" className="hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                        )}

                        {user ? (
                            <>
                                <Link to="/profile" className="hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                                <Link to="/profile/my-orders" className="hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                                <Link to="/profile/coupons" className="hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Coupons</Link>
                                <button onClick={handleLogout} className="text-left hover:text-primary transition-colors py-2">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                <Link to="/register" className="hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;