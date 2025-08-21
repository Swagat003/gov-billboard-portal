"use client";

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Building2, Lock, Eye, EyeOff, ArrowLeft, Shield, LogIn } from "lucide-react";

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        loginAs: '',
        password: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    loginAs: formData.loginAs,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert("❌ " + data.error);
                return;
            }


            // Trigger auth context to update user state
            window.location.reload(); // Force reload to trigger auth check
        } catch (err) {
            console.error("Login error:", err);
            alert("Server error. Try again later.");
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <header className="bg-white shadow-md border-b-4 border-orange-500">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center">
                                <Image
                                    src="/images/favicon.png"
                                    alt="Government of India"
                                    width={64}
                                    height={64}
                                    className="rounded"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-blue-900">
                                    Government Billboard Portal
                                </h1>
                                <p className="text-sm text-gray-600">Ministry of Urban Development</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Image
                                    src="/images/gov-logo.png"
                                    alt="Government of India"
                                    width={40}
                                    height={40}
                                    className="rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Government of India</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <nav className="bg-blue-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center space-x-6">
                            <Link href="/" className="flex items-center space-x-2 hover:text-orange-300 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Home</span>
                            </Link>
                            <Link href="#" className="hover:text-orange-300 transition-colors">
                                Help
                            </Link>
                            <Link href="#" className="hover:text-orange-300 transition-colors">
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="flex space-x-3">
                            <Link href="/register">
                                <Button variant="outline" className="bg-white text-blue-900 hover:bg-gray-100">
                                    New User? Register Here
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-blue-900 mb-4">Secure Login</h2>
                        <p className="text-gray-600">
                            Access your Government Billboard Portal account with your registered credentials.
                        </p>
                        <div className="flex items-center justify-center mt-4 space-x-2">
                            <Shield className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-600">Government Secured Authentication</span>
                        </div>
                    </div>

                    <Card className="shadow-xl border-t-4 border-t-orange-500 py-0">
                        <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-lg">
                            <CardTitle className="text-center text-xl font-bold flex items-center justify-center space-x-2">
                                <span>User Login</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-blue-900 font-semibold flex items-center space-x-2">
                                        <Mail className="w-4 h-4" />
                                        <span>Email Address <span className="text-red-500">*</span></span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your registered email address"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="loginAs" className="text-blue-900 font-semibold flex items-center space-x-2">
                                        <Building2 className="w-4 h-4" />
                                        <span>Login As <span className="text-red-500">*</span></span>
                                    </Label>
                                    <Select
                                        value={formData.loginAs}
                                        onValueChange={(value) => handleInputChange('loginAs', value)}
                                    >
                                        <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                            <SelectValue placeholder="Select your role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ADMIN">Administrator</SelectItem>
                                            <SelectItem value="OWNER">Billboard Owner</SelectItem>
                                            <SelectItem value="ADVERTISER">Advertiser</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500">
                                        Select the role you registered with to access the appropriate dashboard.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-blue-900 font-semibold flex items-center space-x-2">
                                        <Lock className="w-4 h-4" />
                                        <span>Password <span className="text-red-500">*</span></span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="remember" className="text-sm text-gray-700">
                                            Remember me
                                        </label>
                                    </div>
                                    <Link href="#" className="text-sm text-blue-600 hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                        <LogIn className="w-5 h-5 mr-2" />
                                        Login to Portal
                                    </Button>
                                </div>

                                <div className="text-center pt-4 border-t">
                                    <p className="text-gray-600">
                                        Don't have an account?{" "}
                                        <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                                            Register here
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">Security Guidelines:</p>
                                <ul className="space-y-1 text-xs">
                                    <li>• Never share your login credentials with anyone</li>
                                    <li>• Always logout after completing your session</li>
                                    <li>• Report suspicious activities immediately</li>
                                    <li>• Use a strong password with letters, numbers, and symbols</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Quick Access</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <Link href="/register?role=ADVERTISER" className="text-blue-600 hover:underline text-sm">
                                → Register as Advertiser
                            </Link>
                            <Link href="/register?role=OWNER" className="text-blue-600 hover:underline text-sm">
                                → Register as Billboard Owner
                            </Link>
                            <Link href="#" className="text-blue-600 hover:underline text-sm">
                                → View Available Billboards
                            </Link>
                            <Link href="#" className="text-blue-600 hover:underline text-sm">
                                → Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-blue-900 text-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-blue-200 text-sm">
                        &copy; 2025 Government of India. All rights reserved. | Powered by Digital India Initiative
                    </p>
                    <div className="mt-2 space-x-4 text-xs">
                        <Link href="#" className="text-blue-300 hover:text-white">Privacy Policy</Link>
                        <Link href="#" className="text-blue-300 hover:text-white">Terms of Service</Link>
                        <Link href="#" className="text-blue-300 hover:text-white">Help Center</Link>
                        <Link href="#" className="text-blue-300 hover:text-white">Contact Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LoginPage;
