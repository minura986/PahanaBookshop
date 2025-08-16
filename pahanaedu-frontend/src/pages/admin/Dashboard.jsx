import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/admin';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalBooks: 0, totalCustomers: 0, totalOrders: 0 });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            toast.error('Failed to fetch dashboard stats.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Total Books</h2>
                    <p className="text-3xl font-bold">{stats.totalBooks}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Total Customers</h2>
                    <p className="text-3xl font-bold">{stats.totalCustomers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Total Orders</h2>
                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;