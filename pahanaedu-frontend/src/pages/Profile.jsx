// Pahana/pahanaedu-frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfileWithPhoto } from '../services/user'; 
import { toast } from 'react-toastify';
import Spinner from '../components/ui/Spinner';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        defaultAddressLine1: '',
        defaultAddressLine2: '',
        defaultCity: '',
        defaultPostalCode: '',
        defaultCountry: '',
        profileImageUrl: '' 
    });
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null); 

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                const profileData = await getUserProfile();
                if (profileData) {
                    setFormData({
                        username: profileData.username || '',
                        firstName: profileData.firstName || '',
                        lastName: profileData.lastName || '',
                        email: profileData.email || '',
                        phoneNumber: profileData.phoneNumber || '',
                        defaultAddressLine1: profileData.defaultAddressLine1 || '',
                        defaultAddressLine2: profileData.defaultAddressLine2 || '',
                        defaultCity: profileData.defaultCity || '',
                        defaultPostalCode: profileData.defaultPostalCode || '',
                        defaultCountry: profileData.defaultCountry || '',
                        profileImageUrl: profileData.profileImageUrl || '' // Set existing image URL
                    });
                }
            } catch (error) {
                toast.error("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadProfileData();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await updateUserProfileWithPhoto(formData, profileImage); 
            setUser(prevState => ({ ...prevState, ...updatedUser }));
            toast.success("Profile updated successfully!");
            setProfileImage(null); // Clear selected file after upload
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile.");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex flex-col items-center">
                        {formData.profileImageUrl ? (
                            <img
                                src={formData.profileImageUrl}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover mb-4"
                            />
                        ) : (
                            <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 mb-4 flex items-center justify-center text-gray-500">
                                No Photo
                            </div>
                        )}
                        <input
                            type="file"
                            id="profilePhoto"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden" 
                        />
                        <label
                            htmlFor="profilePhoto"
                            className="w-full mb-6 cursor-pointer text-center py-2 px-4 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
                        >
                            Upload Photo
                        </label>
                        {formData.profileImageUrl && (
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setFormData(prev => ({ ...prev, profileImageUrl: '' }));
                                    setProfileImage(null); 
                                }}
                            >
                                Remove Photo
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
                        <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                        <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>
                    
                    <h3 className="text-lg font-semibold mt-6 mb-3 border-t pt-4">Contact Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Email (required)" name="email" type="email" value={formData.email} onChange={handleChange} />
                            <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                    </div>

                    <h3 className="text-lg font-semibold mt-6 mb-3 border-t pt-4">Default Shipping Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Address Line 1" name="defaultAddressLine1" value={formData.defaultAddressLine1} onChange={handleChange} />
                            <Input label="Address Line 2" name="defaultAddressLine2" value={formData.defaultAddressLine2} onChange={handleChange} />
                            <Input label="City" name="defaultCity" value={formData.defaultCity} onChange={handleChange} />
                            <Input label="Postal Code" name="defaultPostalCode" value={formData.defaultPostalCode} onChange={handleChange} />
                            <Input label="Country" name="defaultCountry" value={formData.defaultCountry} onChange={handleChange} />
                    </div>
                    
                    <div className="mt-6 text-right">
                            <Button type="submit">Update Profile</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;