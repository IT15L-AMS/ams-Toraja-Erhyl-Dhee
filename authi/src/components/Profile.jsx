import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Shield, Mail, Calendar } from 'lucide-react';
import api from '../api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/auth/profile');
                setUser(response.data.user);
            } catch (err) {
                console.error('Failed to fetch profile', err);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
                <div className="text-blue-400 animate-pulse text-lg font-medium">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-all font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Info Card */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="p-8 bg-[#1e293b] rounded-2xl border border-gray-700/50 shadow-xl">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                                    <User className="w-12 h-12 text-blue-400" />
                                </div>
                                <h2 className="text-xl font-bold">{user?.full_name}</h2>
                                <p className="text-blue-400 text-sm font-medium mt-1">{user?.role_name}</p>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3 text-gray-400 text-sm">
                                    <Mail className="w-4 h-4" />
                                    <span>{user?.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400 text-sm">
                                    <Shield className="w-4 h-4" />
                                    <span>Role: {user?.role_name}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Welcome Card */}
                    <div className="md:col-span-2">
                        <div className="p-8 bg-[#1e293b] rounded-2xl border border-gray-700/50 shadow-xl h-full">
                            <h3 className="text-2xl font-bold mb-4">Welcome back, {user?.full_name.split(' ')[0]}!</h3>
                            <p className="text-gray-400 leading-relaxed mb-8">
                                You are currently logged in as a <span className="text-white font-medium">{user?.role_name}</span>.
                                Your access to the Academic Management System is restricted based on this role.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-[#0f172a] rounded-xl border border-gray-700/50">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                                    <p className="text-green-400 font-medium flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                        Active
                                    </p>
                                </div>
                                <div className="p-4 bg-[#0f172a] rounded-xl border border-gray-700/50">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">System Version</p>
                                    <p className="font-medium text-gray-300">v1.0.0 Alpha</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
