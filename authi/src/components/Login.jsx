import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import api from '../api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
            <div className="max-w-md w-full space-y-8 p-10 bg-[#1e293b] rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-xl">
                <div>
                    <div className="flex justify-center">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <LogIn className="h-10 w-10 text-blue-400" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Please enter your details to sign in
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="flex items-center gap-2 p-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl animate-shake">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-[#0f172a] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-[#0f172a] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>

                    <p className="text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                            Register now
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
