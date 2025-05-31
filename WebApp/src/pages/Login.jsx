import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeClosed } from 'lucide-react';
import BgImage from '../assets/designlogin.jpg';

const LoginPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: false,
        password: false,
    });
    const [apiError, setApiError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset errors
        setErrors({ email: false, password: false });
        setApiError('');
        
        // Validate
        if (!formData.email) setErrors(prev => ({ ...prev, email: true }));
        if (!formData.password) setErrors(prev => ({ ...prev, password: true }));
        
        if (!formData.email || !formData.password) return;

        setLoading(true);
        
        try {
            const response = await fetch('http://tallal.info:5500/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    role: 'admin' // Hardcoded for admin login
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store the token and role
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.role);

            // Redirect to dashboard
            navigate('/Admin/dashboard');
        } catch (error) {
            setApiError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        setApiError('');
        
        try {
            const response = await fetch('http://tallal.info:5500/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'guest@admin.com', // Replace with your actual guest credentials
                    password: 'guestpassword',
                    role: 'admin'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Guest login failed');
            }

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.role);
            navigate('/Admin/dashboard');
        } catch (error) {
            setApiError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Side - Login Form */}
            <div className="flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-[#2c2143] mb-2">
                        Admin Login
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Welcome back! Please enter your details
                    </p>

                    {apiError && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">Email is required</p>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                            </button>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">Password is required</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="rounded text-purple-600" />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-[#7f56da] hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-[#7f56da] text-white rounded-lg hover:bg-[#6645b8] transition-colors flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Login'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleGuestLogin}
                            className="w-full py-3 px-4 border-2 border-[#7f56da] text-[#7f56da] rounded-lg hover:bg-[#7f56da] hover:text-white transition-colors"
                            disabled={loading}
                        >
                            Login as Guest
                        </button>

                        <div className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/Adminregister" className="text-[#7f56da] hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side - Background Image */}
            <div className="hidden md:block bg-cover bg-center bg-no-repeat" 
                style={{ 
                    backgroundImage: BgImage,
                    backgroundColor: '#f3f4f6' 
                }}
            />
        </div>
    );
};

export default LoginPage;