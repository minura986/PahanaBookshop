import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <aside className="w-64 bg-gray-800 text-white p-4">
                <div className="text-2xl font-bold text-white mb-6">
                    <Link to="/admin">Admin Panel</Link>
                </div>
                <nav>
                    <ul>
                        <li><Link to="/admin" className="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</Link></li>
                        <li><Link to="/admin/books" className="block py-2 px-4 rounded hover:bg-gray-700">Books</Link></li>
                        <li><Link to="/admin/orders" className="block py-2 px-4 rounded hover:bg-gray-700">Orders</Link></li>
                        <li><Link to="/admin/customers" className="block py-2 px-4 rounded hover:bg-gray-700">Customers</Link></li>
                        <li><Link to="/admin/admins" className="block py-2 px-4 rounded hover:bg-gray-700">Admins</Link></li>
                    </ul>
                </nav>
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-md p-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">Welcome, {user?.username}!</h1>
                    </div>
                    <div>
                        <button
                            onClick={handleLogout}
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                        >
                            Logout
                        </button>
                    </div>
                </header>
                <main className="flex-1 p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Admin;