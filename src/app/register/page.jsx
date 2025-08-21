"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, User, Mail, Phone, CreditCard, Lock, Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";

function RegisterForm() {
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        registeringAs: '',
        phone: '',
        govIdType: '',
        govIdNo: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const role = searchParams.get('role');
        if (role && (role === 'OWNER' || role === 'ADVERTISER')) {
            setFormData(prev => ({
                ...prev,
                registeringAs: role
            }));
        }
    }, [searchParams]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log("Form submission started");
        console.log("Form data being sent:", formData);
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'registeringAs', 'phone', 'govIdType', 'govIdNo', 'password'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            alert(`❌ Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            alert("❌ Passwords do not match");
            return;
        }
        
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            console.log("Response status:", res.status);
            const data = await res.json();
            console.log("Response data:", data);
            
            if (res.ok) {
                alert("✅ Registered successfully!");
                console.log("User:", data.user);
                // Optionally redirect to login page
                // window.location.href = "/login";
            } else {
                alert("❌ " + data.error);
                console.error("Registration failed:", data);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("❌ Network error occurred");
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
                                Guidelines
                            </Link>
                        </div>
                        <div className="flex space-x-3">
                            <Link href="/login">
                                <Button variant="outline" className="bg-white text-blue-900 hover:bg-gray-100">
                                    Already have an account? Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-blue-900 mb-4">
                            {formData.registeringAs === 'ADVERTISER' ? 'Advertiser Registration' :
                                formData.registeringAs === 'OWNER' ? 'Billboard Owner Registration' :
                                    'User Registration'}
                        </h2>
                        <p className="text-gray-600">
                            {formData.registeringAs === 'ADVERTISER' ?
                                'Register as an Advertiser to browse and book billboard spaces across India.' :
                                formData.registeringAs === 'OWNER' ?
                                    'Register as a Billboard Owner to list and manage your billboard inventory.' :
                                    'Register to access the Government Billboard Portal. Please provide accurate information for verification.'
                            }
                        </p>
                        <div className="flex items-center justify-center mt-4 space-x-2">
                            <Shield className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-600">Secured by Government Authentication</span>
                        </div>
                    </div>

                    <Card className="shadow-xl border-t-4 border-t-orange-500 py-0">
                        <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-lg">
                            <CardTitle className="text-center text-xl font-bold">
                                Registration Form
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-blue-900 font-semibold flex items-center space-x-2">
                                        <User className="w-4 h-4" />
                                        <span>Full Name <span className="text-red-500">*</span></span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name as per government ID"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-blue-900 font-semibold flex items-center space-x-2">
                                        <Mail className="w-4 h-4" />
                                        <span>Email Address <span className="text-red-500">*</span></span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="registeringAs" className="text-blue-900 font-semibold flex items-center space-x-2">
                                        <Building2 className="w-4 h-4" />
                                        <span>Registering As <span className="text-red-500">*</span></span>
                                    </Label>
                                    {/* Debug info */}
                                    {process.env.NODE_ENV === 'development' && (
                                        <p className="text-xs text-gray-500">
                                            Current value: {formData.registeringAs || 'None'}
                                        </p>
                                    )}
                                    <Select
                                        key={formData.registeringAs}
                                        value={formData.registeringAs}
                                        onValueChange={(value) => {
                                            console.log('Selecting role:', value);
                                            handleInputChange('registeringAs', value);
                                        }}
                                    >
                                        <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                            <SelectValue placeholder="Select your role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="OWNER">Billboard Owner</SelectItem>
                                            <SelectItem value="ADVERTISER">Advertiser</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500">
                                        Choose "Billboard Owner" if you own billboard space, or "Advertiser" if you want to book billboard space.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-blue-900 font-semibold flex items-center space-x-2">
                                        <Phone className="w-4 h-4" />
                                        <span>Mobile Number <span className="text-red-500">*</span></span>
                                    </Label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 border-2 border-r-0 border-gray-300 bg-gray-50 text-gray-600 text-sm rounded-l-md">
                                            +91
                                        </span>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="Enter 10-digit mobile number"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="border-2 border-l-0 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-l-none"
                                            pattern="[0-9]{10}"
                                            maxLength="10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="govIdType" className="text-blue-900 font-semibold flex items-center space-x-2">
                                        <CreditCard className="w-4 h-4" />
                                        <span>Government ID Type <span className="text-red-500">*</span></span>
                                    </Label>
                                    <Select
                                        value={formData.govIdType}
                                        onValueChange={(value) => handleInputChange('govIdType', value)}
                                    >
                                        <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                            <SelectValue placeholder="Select ID type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AADHAR">Aadhaar Card</SelectItem>
                                            <SelectItem value="PAN">PAN Card</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="govIdNo" className="text-blue-900 font-semibold flex items-center space-x-2">
                                        <CreditCard className="w-4 h-4" />
                                        <span>Government ID Number <span className="text-red-500">*</span></span>
                                    </Label>
                                    <Input
                                        id="govIdNo"
                                        type="text"
                                        placeholder={formData.govIdType === 'AADHAR' ? 'Enter 12-digit Aadhaar number' : formData.govIdType === 'PAN' ? 'Enter 10-character PAN number' : 'Select ID type first'}
                                        value={formData.govIdNo}
                                        onChange={(e) => handleInputChange('govIdNo', e.target.value)}
                                        className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        pattern={formData.govIdType === 'AADHAR' ? '[0-9]{12}' : formData.govIdType === 'PAN' ? '[A-Z]{5}[0-9]{4}[A-Z]{1}' : ''}
                                        maxLength={formData.govIdType === 'AADHAR' ? '12' : formData.govIdType === 'PAN' ? '10' : ''}
                                        required
                                    />
                                    <p className="text-xs text-gray-500">
                                        {formData.govIdType === 'AADHAR' && 'Format: XXXX XXXX XXXX (12 digits)'}
                                        {formData.govIdType === 'PAN' && 'Format: ABCDE1234F (5 letters + 4 digits + 1 letter)'}
                                        {!formData.govIdType && 'Please select an ID type first'}
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
                                            placeholder="Enter a strong password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                                            minLength="8"
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
                                    <p className="text-xs text-gray-500">
                                        Password must be at least 8 characters long and contain letters, numbers, and special characters.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-blue-900 font-semibold flex items-center space-x-2">
                                        <Lock className="w-4 h-4" />
                                        <span>Confirm Password <span className="text-red-500">*</span></span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Re-enter your password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                            className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                        <p className="text-xs text-red-500">Passwords do not match</p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start space-x-2">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            required
                                        />
                                        <label htmlFor="terms" className="text-sm text-gray-700">
                                            I agree to the{" "}
                                            <Link href="#" className="text-blue-600 hover:underline">
                                                Terms and Conditions
                                            </Link>{" "}
                                            and{" "}
                                            <Link href="#" className="text-blue-600 hover:underline">
                                                Privacy Policy
                                            </Link>{" "}
                                            of the Government Billboard Portal.
                                        </label>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                        <input
                                            type="checkbox"
                                            id="verification"
                                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            required
                                        />
                                        <label htmlFor="verification" className="text-sm text-gray-700">
                                            I confirm that all the information provided is accurate and I understand that providing false information may result in legal action.
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                        Register Account
                                    </Button>
                                </div>

                                <div className="text-center pt-4 border-t">
                                    <p className="text-gray-600">
                                        Already have an account?{" "}
                                        <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                                            Login here
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
                                <p className="font-semibold mb-1">Security Notice:</p>
                                <ul className="space-y-1 text-xs">
                                    <li>• Your information is encrypted and stored securely</li>
                                    <li>• Government ID verification is required for all registrations</li>
                                    <li>• Account activation may take 24-48 hours for verification</li>
                                    <li>• For technical support, contact: support@billboard.gov.in</li>
                                </ul>
                            </div>
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
                        <Link href="#" className="text-blue-300 hover:text-white">Help</Link>
                        <Link href="#" className="text-blue-300 hover:text-white">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-blue-900 font-semibold">Loading Registration Form...</p>
                </div>
            </div>
        }>
            <RegisterForm />
        </Suspense>
    );
}

export default RegisterPage;
