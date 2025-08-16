// Pahana/pahanaedu-frontend/src/components/auth/AdminRoute.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import Spinner from '../ui/Spinner';

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    return user && user.roles.includes('ROLE_ADMIN') ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;