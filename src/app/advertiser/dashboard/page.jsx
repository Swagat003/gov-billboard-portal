"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  LogOut, Megaphone, BarChart3, Calendar, Search, Plus,
  MapPin, Eye, Edit, Trash2, CheckCircle, XCircle, 
  Clock, Building2, User, Phone, Mail, AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { QRCodeDisplay, QRCodeModal } from "@/components/qr-code-generator";

function AdvertiserDashboard() {
  const { user, logout } = useAuth();
  const [advertisements, setAdvertisements] = useState([]);
  const [availableHoardings, setAvailableHoardings] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, approved: 0, totalHoardings: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [selectedAd, setSelectedAd] = useState(null);
  const [adFormData, setAdFormData] = useState({
    title: '',
    description: '',
    category: '',
    contentUrl: ''
  });
  const [bookingFormData, setBookingFormData] = useState({
    advertisementId: '',
    hoardingId: '',
    startDate: '',
    endDate: ''
  });

  const handleLogout = async () => {
    await logout();
  };

  const fetchAdvertisements = async () => {
    try {
      const response = await fetch('/api/advertiser/advertisements');
      const data = await response.json();
      
      if (data.success) {
        setAdvertisements(data.data.advertisements);
        setStats(data.data.stats);
      } else {
        console.error('Failed to fetch advertisements:', data.error);
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    }
  };

  const fetchAvailableHoardings = async () => {
    try {
      const response = await fetch('/api/advertiser/hoardings');
      const data = await response.json();
      
      if (data.success) {
        setAvailableHoardings(data.data);
      } else {
        console.error('Failed to fetch available hoardings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching available hoardings:', error);
    }
  };

  const handleAddAdvertisement = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/advertiser/advertisements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adFormData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Advertisement created successfully! Awaiting admin approval.');
        setShowAddForm(false);
        setAdFormData({ title: '', description: '', category: '', contentUrl: '' });
        fetchAdvertisements();
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding advertisement:', error);
      alert('❌ Server error. Please try again.');
    }
  };

  const handleBookHoarding = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/advertiser/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingFormData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Hoarding booked successfully!');
        setShowBookingForm(false);
        setBookingFormData({ advertisementId: '', hoardingId: '', startDate: '', endDate: '' });
        fetchAdvertisements();
        fetchAvailableHoardings();
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error booking hoarding:', error);
      alert('❌ Server error. Please try again.');
    }
  };

  const handleViewQRCode = (qrCodeValue, hoardingDetails) => {
    setSelectedQRCode({ 
      value: qrCodeValue, 
      hoarding: hoardingDetails 
    });
    setShowQRModal(true);
  };

  const handleDeleteAdvertisement = async (adId) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) {
      return;
    }

    try {
      const response = await fetch(`/api/advertiser/advertisements/${adId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Advertisement deleted successfully!');
        fetchAdvertisements();
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      alert('❌ Server error. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getStatusBadge = (advertisement) => {
    if (!advertisement.approved) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
        <Clock className="h-3 w-3 mr-1" />
        Pending Approval
      </Badge>;
    }
    
    const hasActiveBooking = advertisement.hoardings.some(h => 
      new Date(h.endDate) > new Date()
    );
    
    if (hasActiveBooking) {
      return <Badge className="bg-green-100 text-green-800 border-green-300">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>;
    }
    
    return <Badge className="bg-blue-100 text-blue-800 border-blue-300">
      <CheckCircle className="h-3 w-3 mr-1" />
      Approved
    </Badge>;
  };

  const categories = [
    'Commercial', 'Government', 'Public Service', 'Entertainment', 
    'Education', 'Healthcare', 'Technology', 'Other'
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAdvertisements(),
        fetchAvailableHoardings()
      ]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  if (!user || user.role !== 'ADVERTISER') {
    return <LoadingSpinner message="Unauthorized access. Redirecting..." />;
  }

  if (loading) {
    return <LoadingSpinner message="Loading your advertisements..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="bg-white shadow-md border-b-4 border-orange-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">
                  Advertiser Dashboard
                </h1>
                <p className="text-sm text-gray-600">Government Billboard Portal • Ministry of Urban Development</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right mr-4">
                <p className="text-sm font-medium text-blue-900">Welcome, {user?.name}</p>
                <p className="text-xs text-gray-600">Advertiser ID: {user?.id?.slice(-8)}</p>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Advertisements</CardTitle>
              <Megaphone className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Created campaigns</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Ads</CardTitle>
              <CheckCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Ready to display</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hoardings</CardTitle>
              <Building2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{stats.totalHoardings}</div>
              <p className="text-xs text-muted-foreground">Booked displays</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">My Advertisements</h2>
          <div className="flex gap-3">
            <Button 
              onClick={() => {
                fetchAvailableHoardings();
                setShowBookingForm(!showBookingForm);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Book Hoarding
            </Button>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Advertisement
            </Button>
          </div>
        </div>

        {showAddForm && (
          <Card className="mb-6 border-2 border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800">Create New Advertisement</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddAdvertisement} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Advertisement Title</Label>
                  <Input
                    id="title"
                    value={adFormData.title}
                    onChange={(e) => setAdFormData({...adFormData, title: e.target.value})}
                    required
                    className="mt-1"
                    placeholder="Enter campaign title"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={adFormData.category}
                    onChange={(e) => setAdFormData({...adFormData, category: e.target.value})}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={adFormData.description}
                    onChange={(e) => setAdFormData({...adFormData, description: e.target.value})}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your advertisement campaign"
                    rows="3"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="contentUrl">Content URL (Optional)</Label>
                  <Input
                    id="contentUrl"
                    type="url"
                    value={adFormData.contentUrl}
                    onChange={(e) => setAdFormData({...adFormData, contentUrl: e.target.value})}
                    className="mt-1"
                    placeholder="https://example.com/ad-content"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3 pt-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Advertisement
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {showBookingForm && (
          <Card className="mb-6 border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800">Book Advertisement on Hoarding</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleBookHoarding} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="advertisementId">Select Advertisement</Label>
                  <select
                    id="advertisementId"
                    value={bookingFormData.advertisementId}
                    onChange={(e) => setBookingFormData({...bookingFormData, advertisementId: e.target.value})}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Advertisement</option>
                    {advertisements.filter(ad => ad.approved).map(ad => (
                      <option key={ad.advertise_no} value={ad.advertise_no}>
                        {ad.title} ({ad.category})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="hoardingId">Select Hoarding</Label>
                  <select
                    id="hoardingId"
                    value={bookingFormData.hoardingId}
                    onChange={(e) => setBookingFormData({...bookingFormData, hoardingId: e.target.value})}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Hoarding</option>
                    {availableHoardings.map(hoarding => (
                      <option key={hoarding.hoarding_no} value={hoarding.hoarding_no}>
                        {hoarding.height}x{hoarding.width}ft - {hoarding.address.substring(0, 50)}...
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={bookingFormData.startDate}
                    onChange={(e) => setBookingFormData({...bookingFormData, startDate: e.target.value})}
                    required
                    className="mt-1"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={bookingFormData.endDate}
                    onChange={(e) => setBookingFormData({...bookingFormData, endDate: e.target.value})}
                    required
                    className="mt-1"
                    min={bookingFormData.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="md:col-span-2 flex gap-3 pt-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Building2 className="h-4 w-4 mr-2" />
                    Book Hoarding
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowBookingForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6">
          {advertisements.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Advertisements Found</h3>
                <p className="text-gray-500 mb-4">Start by creating your first advertisement campaign.</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Advertisement
                </Button>
              </CardContent>
            </Card>
          ) : (
            advertisements.map((ad) => (
              <Card key={ad.advertise_no} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-1">
                        {ad.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(ad)}
                        <Badge variant="outline" className="text-xs">
                          {ad.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteAdvertisement(ad.advertise_no)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700">{ad.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Created</p>
                      <p className="text-sm text-gray-800 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(ad.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Content URL</p>
                      <p className="text-sm text-gray-800">
                        {ad.contentUrl ? (
                          <a href={ad.contentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Content
                          </a>
                        ) : (
                          'Not provided'
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Hoardings</p>
                      <p className="text-sm text-gray-800">
                        {ad.hoardings.length} booked
                      </p>
                    </div>
                  </div>

                  {ad.hoardings.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-600 mb-3">Hoarding Assignments</h4>
                      <div className="space-y-3">
                        {ad.hoardings.map((assignment) => (
                          <div key={assignment.id} className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-blue-900">
                                Hoarding #{assignment.hoarding.hoarding_no.slice(-8)}
                              </h5>
                              <Badge className={
                                new Date(assignment.endDate) > new Date() 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-gray-100 text-gray-800"
                              }>
                                {new Date(assignment.endDate) > new Date() ? 'Active' : 'Expired'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              <div>
                                <p className="font-medium">Dimensions:</p>
                                <p>{assignment.hoarding.height} × {assignment.hoarding.width} ft</p>
                              </div>
                              <div>
                                <p className="font-medium">Duration:</p>
                                <p>{formatDate(assignment.startDate)} - {formatDate(assignment.endDate)}</p>
                              </div>
                              <div>
                                <p className="font-medium">Owner:</p>
                                <p>{assignment.hoarding.owner.name}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <QRCodeDisplay 
                                qrCodeValue={assignment.qrCodeNo}
                                title="QR Code"
                                className="max-w-32"
                                onViewLarge={() => handleViewQRCode(assignment.qrCodeNo, assignment.hoarding)}
                              />
                            </div>
                            <div className="mt-2">
                              <p className="text-xs font-medium">Location:</p>
                              <p className="text-xs text-gray-700 flex items-start">
                                <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                                {assignment.hoarding.address}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {showQRModal && selectedQRCode && (
          <QRCodeModal
            qrCodeValue={selectedQRCode.value}
            title="Hoarding QR Code"
            onClose={() => setShowQRModal(false)}
            hoarding={selectedQRCode.hoarding}
          />
        )}
      </div>
    </div>
  );
}

export default AdvertiserDashboard;
