// Pahana/pahanaedu-frontend/src/pages/ProfileLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const ProfileLayout = () => {
    const activeLinkClass = 'border-primary text-primary';
    const inactiveLinkClass = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <NavLink
                            to="/profile"
                            end
                            className={({ isActive }) =>
                                `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${isActive ? activeLinkClass : inactiveLinkClass}`
                            }
                        >
                            Profile Information
                        </NavLink>
                        <NavLink
                            to="/profile/my-orders"
                            className={({ isActive }) =>
                                `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${isActive ? activeLinkClass : inactiveLinkClass}`
                            }
                        >
                            My Orders
                        </NavLink>
                        <NavLink
                            to="/profile/my-reviews"
                            className={({ isActive }) =>
                                `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${isActive ? activeLinkClass : inactiveLinkClass}`
                            }
                        >
                            My Reviews
                        </NavLink>
                        <NavLink
                            to="/profile/coupons"
                            className={({ isActive }) =>
                                `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${isActive ? activeLinkClass : inactiveLinkClass}`
                            }
                        >
                            My Coupons
                        </NavLink>
                    </nav>
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export default ProfileLayout;