import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import PasswordStrengthBar from 'react-password-strength-bar';

const RegisterForm = () => {
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '07', // Default value
        password: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        country: 'Sri Lanka', // Default value
        profilePicture: null
    });
    const [preview, setPreview] = useState(null);
    const { register, error } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phoneNumber') {
            // Allow only numbers and ensure it starts with "07"
            if (value.startsWith('07') && /^\d*$/.test(value)) {
                setUserData({ ...userData, [name]: value });
            }
        } else {
            setUserData({ ...userData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserData({ ...userData, profilePicture: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.phoneNumber.length !== 10) {
            alert('Phone number must be 10 digits long.');
            return;
        }
        await register(userData);
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            {step === 1 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">User Information</h3>
                    <Input label="Username" name="username" value={userData.username} onChange={handleChange} required />
                    <Input label="First Name" name="firstName" value={userData.firstName} onChange={handleChange} required />
                    <Input label="Last Name" name="lastName" value={userData.lastName} onChange={handleChange} required />
                    <Input label="Email" name="email" type="email" value={userData.email} onChange={handleChange} required />
                    <Input 
                        label="Phone Number" 
                        name="phoneNumber" 
                        value={userData.phoneNumber} 
                        onChange={handleChange}
                        maxLength="10" 
                        pattern="07[0-9]{8}"
                        title="Phone number must be 10 digits and start with 07"
                    />
                    <Input 
                        label="Password" 
                        name="password" 
                        type="password" 
                        value={userData.password} 
                        onChange={handleChange} 
                        required 
                    />
                    <PasswordStrengthBar password={userData.password} />
                    <Button onClick={nextStep} className="w-full mt-4">Next</Button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Address Details</h3>
                    <Input label="Address Line 1" name="addressLine1" value={userData.addressLine1} onChange={handleChange} required />
                    <Input label="Address Line 2 (Optional)" name="addressLine2" value={userData.addressLine2} onChange={handleChange} />
                    <Input label="City" name="city" value={userData.city} onChange={handleChange} required />
                    <Input label="Postal Code" name="postalCode" value={userData.postalCode} onChange={handleChange} required />
                    <Input label="Country" name="country" value={userData.country} onChange={handleChange} required />
                    <div className="flex justify-between mt-4">
                        <Button onClick={prevStep} variant="outline">Previous</Button>
                        <Button onClick={nextStep}>Next</Button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
                    <Input type="file" onChange={handleFileChange} accept="image/*" />
                    {preview && <img src={preview} alt="Profile Preview" className="w-32 h-32 rounded-full mx-auto mt-4" />}
                    <div className="flex justify-between mt-4">
                        <Button onClick={prevStep} variant="outline">Previous</Button>
                        <Button type="submit">Register</Button>
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
    );
};

export default RegisterForm;