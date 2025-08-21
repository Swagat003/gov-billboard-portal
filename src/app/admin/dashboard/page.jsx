"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Shield, Users, Building2, BarChart3, Settings, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

function AdminDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (!user || user.role !== 'ADMIN') {
    return <LoadingSpinner message="Unauthorized access. Redirecting..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-orange-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">Government Billboard Portal</p>
              </div>
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
      </header>

      {/* Main Content */}
      
    </div>
  );
}

export default AdminDashboard;
