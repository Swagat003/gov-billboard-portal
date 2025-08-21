"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, MapPin, Shield, TrendingUp, Clock } from "lucide-react";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-orange-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16  rounded-full flex items-center justify-center">
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

      {/* Navigation Bar */}
      <nav className="bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex space-x-6">
              <Link href="/" className="hover:text-orange-300 transition-colors">
                Home
              </Link>
              <Link href="#about" className="hover:text-orange-300 transition-colors">
                About
              </Link>
              <Link href="#services" className="hover:text-orange-300 transition-colors">
                Services
              </Link>
              <Link href="#contact" className="hover:text-orange-300 transition-colors">
                Contact
              </Link>
            </div>
            <div className="flex space-x-3">
              <Link href="/login">
                <Button variant="outline" className="bg-white text-blue-900 hover:bg-gray-100">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Digital Billboard Management System
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Streamlining billboard advertising through transparent, efficient, and technology-driven solutions
            for a modern India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=ADVERTISER">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                Register as Advertiser
              </Button>
            </Link>
            <Link href="/register?role=OWNER">
              <Button size="lg" variant="outline" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3">
                Register as Owner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">500+</div>
              <div className="text-gray-600">Registered Billboards</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">200+</div>
              <div className="text-gray-600">Active Advertisers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-900 mb-4">About the Portal</h3>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              The Government Billboard Portal is a revolutionary digital platform designed to modernize
              and streamline billboard advertising across India. This initiative is part of the Digital India
              mission, aimed at creating transparency, efficiency, and accessibility in outdoor advertising.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Transparency</CardTitle>
                <CardDescription>
                  Complete transparency in billboard allocation, pricing, and booking processes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-t-4 border-t-orange-500">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-blue-900">Efficiency</CardTitle>
                <CardDescription>
                  Streamlined processes reducing paperwork and time for all stakeholders
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-t-4 border-t-green-500">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-blue-900">Accessibility</CardTitle>
                <CardDescription>
                  Equal opportunities for all advertisers, from small businesses to large corporations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-900 mb-4">Our Services</h3>
            <p className="text-lg text-gray-700">
              Comprehensive solutions for billboard management and advertising
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <span>For Advertisers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Browse available billboard locations</li>
                  <li>• Real-time availability and pricing</li>
                  <li>• Online booking and payment</li>
                  <li>• Campaign management tools</li>
                  <li>• Performance analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Building2 className="w-6 h-6 text-orange-600" />
                  <span>For Billboard Owners</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Register and manage billboard inventory</li>
                  <li>• Set pricing and availability</li>
                  <li>• Track bookings and revenue</li>
                  <li>• Maintenance scheduling</li>
                  <li>• Compliance management</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-900 mb-4">Key Features</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">24/7 Availability</h4>
              <p className="text-gray-600 text-sm">Access the portal anytime, anywhere</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Secure Platform</h4>
              <p className="text-gray-600 text-sm">Government-grade security standards</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Real-time Updates</h4>
              <p className="text-gray-600 text-sm">Live availability and pricing information</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Support Team</h4>
              <p className="text-gray-600 text-sm">Dedicated customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Government Billboard Portal</h4>
              <p className="text-blue-200 text-sm">
                Empowering transparent and efficient billboard advertising across India
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li><Link href="#" className="hover:text-white">Home</Link></li>
                <li><Link href="#about" className="hover:text-white">About</Link></li>
                <li><Link href="#services" className="hover:text-white">Services</Link></li>
                <li><Link href="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li><Link href="/advertiser" className="hover:text-white">Advertiser Portal</Link></li>
                <li><Link href="/owner" className="hover:text-white">Owner Portal</Link></li>
                <li><Link href="/admin" className="hover:text-white">Admin Panel</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <div className="text-blue-200 text-sm space-y-2">
                <p>Ministry of Urban Development</p>
                <p>New Delhi, India</p>
                <p>Email: support@billboard.gov.in</p>
                <p>Phone: 1800-XXX-XXXX</p>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200 text-sm">
            <p>&copy; 2025 Government of India. All rights reserved. | Powered by Digital India Initiative</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
