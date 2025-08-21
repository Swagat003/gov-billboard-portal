"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  LogOut, Building2, BarChart3, Settings, Plus, 
  MapPin, Calendar, Eye, Edit, Trash2, IndianRupee,
  Users, Activity, CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

function OwnerDashboard() {
  const { user, logout } = useAuth();
  const [hoardings, setHoardings] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, occupied: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedHoarding, setSelectedHoarding] = useState(null);
  const [formData, setFormData] = useState({
    height: '',
    width: '',
    address: '',
    installation_date: '',
    latitude: '',
    longitude: ''
  });

  const handleLogout = async () => {
    await logout();
  };

  const fetchHoardings = async () => {
    try {
      const response = await fetch('/api/owner/hoardings');
      const data = await response.json();
      
      if (data.success) {
        setHoardings(data.data.hoardings);
        setStats(data.data.stats);
      } else {
        console.error('Failed to fetch hoardings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching hoardings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoarding = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/owner/hoardings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Hoarding added successfully!');
        setShowAddForm(false);
        setFormData({ height: '', width: '', address: '', installation_date: '', latitude: '', longitude: '' });
        fetchHoardings(); // Refresh the list
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding hoarding:', error);
      alert('❌ Server error. Please try again.');
    }
  };

  const handleDeleteHoarding = async (hoardingId) => {
    if (!confirm('Are you sure you want to delete this hoarding?')) {
      return;
    }

    try {
      const response = await fetch(`/api/owner/hoardings/${hoardingId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Hoarding deleted successfully!');
        fetchHoardings(); 
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting hoarding:', error);
      alert('❌ Server error. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const calculateArea = (height, width) => {
    return (height * width).toFixed(2);
  };

  useEffect(() => {
    fetchHoardings();
  }, []);

  if (!user || user.role !== 'OWNER') {
    return <LoadingSpinner message="Unauthorized access. Redirecting..." />;
  }

  if (loading) {
    return <LoadingSpinner message="Loading your hoardings..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-orange-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">
                  Billboard Owner Dashboard
                </h1>
                <p className="text-sm text-gray-600">Government Billboard Portal • Ministry of Urban Development</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right mr-4">
                <p className="text-sm font-medium text-blue-900">Welcome, {user?.name}</p>
                <p className="text-xs text-gray-600">Owner ID: {user?.id?.slice(-8)}</p>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hoardings</CardTitle>
              <Building2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Registered billboards</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{stats.available}</div>
              <p className="text-xs text-muted-foreground">Ready for booking</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupied</CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{stats.occupied}</div>
              <p className="text-xs text-muted-foreground">Currently rented</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">
                {stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Revenue efficiency</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">My Hoardings</h2>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Hoarding
          </Button>
        </div>

        {/* Add Hoarding Form */}
        {showAddForm && (
          <Card className="mb-6 border-2 border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800">Add New Hoarding</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddHoarding} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="height">Height (feet)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width (feet)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    value={formData.width}
                    onChange={(e) => setFormData({...formData, width: e.target.value})}
                    required
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-3">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                    className="mt-1"
                    placeholder="Complete address with landmarks"
                  />
                </div>
                <div>
                  <Label htmlFor="installation_date">Installation Date</Label>
                  <Input
                    id="installation_date"
                    type="date"
                    value={formData.installation_date}
                    onChange={(e) => setFormData({...formData, installation_date: e.target.value})}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="latitude">Latitude (Optional)</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    className="mt-1"
                    placeholder="e.g., 28.6139"
                  />
                  <p className="text-xs text-gray-500 mt-1">GPS coordinates for precise location</p>
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude (Optional)</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    className="mt-1"
                    placeholder="e.g., 77.2090"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use Google Maps to find coordinates</p>
                </div>
                <div className="md:col-span-3 flex gap-3 pt-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Hoarding
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

        {/* Hoardings List */}
        <div className="grid grid-cols-1 gap-6">
          {hoardings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Hoardings Found</h3>
                <p className="text-gray-500 mb-4">Start by adding your first hoarding to the platform.</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Hoarding
                </Button>
              </CardContent>
            </Card>
          ) : (
            hoardings.map((hoarding) => (
              <Card key={hoarding.hoarding_no} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-1">
                        Hoarding #{hoarding.hoarding_no.slice(-8)}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          className={hoarding.isAvailable 
                            ? "bg-green-100 text-green-800 border-green-300" 
                            : "bg-orange-100 text-orange-800 border-orange-300"
                          }
                        >
                          {hoarding.isAvailable ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Available
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Occupied
                            </>
                          )}
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
                        onClick={() => handleDeleteHoarding(hoarding.hoarding_no)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Dimensions</p>
                      <p className="text-lg font-bold text-blue-900">
                        {hoarding.height} × {hoarding.width} ft
                      </p>
                      <p className="text-xs text-gray-500">
                        Area: {calculateArea(hoarding.height, hoarding.width)} sq ft
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Installation Date</p>
                      <p className="text-sm text-gray-800 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(hoarding.installation_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <p className="text-sm text-gray-800">
                        {hoarding.isAvailable ? 'Ready for booking' : 'Currently rented'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Location</p>
                    <p className="text-sm text-gray-800 flex items-start">
                      <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      {hoarding.address}
                    </p>
                    {(hoarding.latitude && hoarding.longitude) && (
                      <p className="text-xs text-gray-600 mt-1 ml-5">
                        Coordinates: {hoarding.latitude}, {hoarding.longitude}
                      </p>
                    )}
                  </div>

                  {/* Current Advertisement */}
                  {hoarding.advertisement && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Current Advertisement</h4>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-blue-900">
                            {hoarding.advertisement.advertisement.title}
                          </h5>
                          <Badge className="bg-blue-100 text-blue-800">
                            Active
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {hoarding.advertisement.advertisement.description}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="font-medium">Advertiser:</p>
                            <p>{hoarding.advertisement.advertisement.advertiser.name}</p>
                          </div>
                          <div>
                            <p className="font-medium">Duration:</p>
                            <p>
                              {formatDate(hoarding.advertisement.startDate)} - {formatDate(hoarding.advertisement.endDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
