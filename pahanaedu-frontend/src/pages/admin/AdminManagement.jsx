import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../../services/admin';
import AddAdminForm from '../../components/admin/AddAdminForm';
import { toast } from 'react-toastify';
import Spinner from '../../components/ui/Spinner';

const AdminManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            // Filter for users with the ROLE_ADMIN
            const adminUsers = data.filter(user => user.roles.includes('ROLE_ADMIN'));
            setUsers(adminUsers);
        } catch (error) {
            toast.error('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                toast.success('User deleted successfully!');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user.');
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Management</h1>
                <button
                    onClick={() => setIsAddAdminOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                    Add Admin
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">Username</th>
                            <th className="text-left p-4">Email</th>
                            <th className="text-left p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b">
                                <td className="p-4">{user.username}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    <button onClick={() => alert('Edit feature coming soon!')} className="text-green-500 hover:underline mr-4">Edit</button>
                                    <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isAddAdminOpen && (
                <AddAdminForm
                    onClose={() => setIsAddAdminOpen(false)}
                    onAdminAdded={fetchUsers}
                />
            )}
        </div>
    );
};

export default AdminManagement;