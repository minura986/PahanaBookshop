import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const { login, error } = useAuth();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(credentials);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            <Input
                label="Username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
            />
            <Input
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                required
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Button type="submit" className="w-full">
                Login
            </Button>
        </form>
    );
};

export default LoginForm;