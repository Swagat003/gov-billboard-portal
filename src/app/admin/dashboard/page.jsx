"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  LogOut,
  Shield,
  Users,
  Building2,
  BarChart3,
  Settings,
  AlertCircle,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Filter,
  Search,
  Download,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Image as ImageIcon,
  ExternalLink,
  ZoomIn,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import adminApiService from "@/services/adminApi";

// Image component with fallback handling
function ImageWithFallback({ src, alt, className, ...props }) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc('/images/no-image-placeholder.svg');
    }
  };

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    actionTaken: 0
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch reports and statistics from API
  const fetchReports = async () => {
    try {
      setError(null);
      const response = await adminApiService.getReports({
        status: filterStatus,
        search: searchTerm,
        page: 1,
        limit: 50
      });

      if (response.success) {
        setReports(response.data.reports);
        setStats(response.data.stats);
      } else {
        setError('Failed to fetch reports');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchReports();
  }, []);

  // Refresh data when filters change
  useEffect(() => {
    if (!loading) {
      setRefreshing(true);
      fetchReports();
    }
  }, [filterStatus, searchTerm]);

  const handleLogout = async () => {
    await logout();
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      console.log('Updating report:', { reportId, newStatus });
      
      const response = await adminApiService.updateReport(reportId, {
        status: newStatus
      });

      console.log('Update response:', response);

      if (response.success) {
        // Update local state
        setReports(prev => prev.map(report =>
          report.id === reportId
            ? { ...report, status: newStatus }
            : report
        ));

        // Recalculate stats
        const updatedReports = reports.map(report =>
          report.id === reportId
            ? { ...report, status: newStatus }
            : report
        );

        const totalReports = updatedReports.length;
        const pending = updatedReports.filter(r => r.status === 'PENDING').length;
        const reviewed = updatedReports.filter(r => r.status === 'REVIEWED').length;
        const actionTaken = updatedReports.filter(r => r.status === 'ACTION_TAKEN').length;

        setStats({
          total: totalReports,
          pending,
          reviewed,
          actionTaken
        });
        
        setError(null); // Clear any previous errors
      } else {
        setError('Failed to update report status: ' + (response.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating report:', err);
      setError('Failed to update report status: ' + err.message);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock },
      'REVIEWED': { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Eye },
      'ACTION_TAKEN': { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle }
    };

    const config = statusConfig[status] || statusConfig['PENDING'];
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSearch = searchTerm === '' ||
      (report.reportId && report.reportId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.type && report.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.location && report.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.reporterPhone && report.reporterPhone.includes(searchTerm));

    return matchesStatus && matchesSearch;
  });


  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
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
                  Administrator Dashboard
                </h1>
                <p className="text-sm text-gray-600">Government Billboard Portal • Ministry of Urban Development</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Welcome, {user?.name || 'Administrator'}</p>
                <p className="text-xs text-gray-500">Administrator</p>
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
      <main className="container mx-auto px-4 py-6 space-y-6">
        {error && (
          <Card className="border-l-4 border-l-red-500 bg-red-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Error:</span>
                <span>{error}</span>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  className="ml-auto text-red-600 border-red-300 hover:bg-red-100"
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Total Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">All complaints received</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Reviewed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.reviewed}</div>
              <p className="text-xs text-gray-500 mt-1">Under investigation</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Action Taken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.actionTaken}</div>
              <p className="text-xs text-gray-500 mt-1">Resolved</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Reports & Complaints Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by Report ID, Type, Description, Phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REVIEWED">Reviewed</SelectItem>
                  <SelectItem value="ACTION_TAKEN">Action Taken</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Report Details
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reporter Info
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status & Priority
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Officer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-blue-600">#{report.reportId}</span>
                              <Badge variant="outline" className="text-xs">
                                {report.category}
                              </Badge>
                            </div>
                            <p className="font-medium text-gray-900">{report.type}</p>
                            <p className="text-sm text-gray-600 max-w-xs truncate">
                              {report.description}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" />
                              {report.location}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              {report.dateReported}
                            </div>
                            {report.qrCodeNo && report.qrCodeNo !== 'N/A' && (
                              <div className="text-xs text-blue-600">
                                QR: {report.qrCodeNo}
                              </div>
                            )}
                            {report.evidence && report.evidence.length > 0 && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="relative w-8 h-8 bg-gray-100 rounded border overflow-hidden">
                                  <ImageWithFallback
                                    src={report.evidence[0]}
                                    alt="Evidence"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span className="text-xs text-gray-500">
                                  {report.evidence.length} evidence file{report.evidence.length > 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              {report.reporterPhone}
                            </div>
                            <p className="text-xs text-gray-500">Anonymous Reporter</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            {getStatusBadge(report.status)}
                            <div className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(report.priority)}`}>
                              {report.priority} Priority
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-gray-900">{report.assignedOfficer}</p>
                          <p className="text-xs text-gray-500">Field Officer</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            <Select
                              value={report.status}
                              onValueChange={(value) => handleStatusChange(report.id, value)}
                            >
                              <SelectTrigger className="w-36 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                                <SelectItem value="ACTION_TAKEN">Action Taken</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs"
                              onClick={() => setSelectedReport(report)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredReports.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No reports found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedReport && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{
                backgroundColor: 'rgb(0 0 0 / 55%)'
            }}
          >
            <div className="bg-white max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Report Details - #{selectedReport.reportId}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Report Type</label>
                    <p className="text-gray-900">{selectedReport.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <p className="text-gray-900">{selectedReport.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <div className={`inline-block text-xs px-2 py-1 rounded-full ${getPriorityColor(selectedReport.priority)}`}>
                      {selectedReport.priority} Priority
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedReport.status)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedReport.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {selectedReport.location}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Reporter Information</label>
                    <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedReport.reporterPhone}
                      </p>
                      <p className="text-xs text-gray-500">Anonymous for privacy</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Assigned Officer</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{selectedReport.assignedOfficer}</p>
                      <p className="text-sm text-gray-600">Field Officer</p>
                    </div>
                  </div>
                </div>

                {selectedReport.qrCodeNo && selectedReport.qrCodeNo !== 'N/A' && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">QR Code</label>
                    <p className="text-blue-600 text-sm font-mono">{selectedReport.qrCodeNo}</p>
                  </div>
                )}

                {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Evidence Attachments</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {selectedReport.evidence.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <ImageWithFallback
                              src={imageUrl}
                              alt={`Evidence ${index + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setSelectedImage(imageUrl)}
                              >
                                <ZoomIn className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate" title={imageUrl}>
                            Evidence {index + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => setSelectedReport(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Select
                    value={selectedReport.status}
                    onValueChange={(value) => {
                      handleStatusChange(selectedReport.id, value);
                      setSelectedReport(prev => ({ ...prev, status: value }));
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="REVIEWED">Reviewed</SelectItem>
                      <SelectItem value="ACTION_TAKEN">Action Taken</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl max-h-[90vh] relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300"
              >
                <X className="h-8 w-8" />
              </button>
              <div className="relative">
                <ImageWithFallback
                  src={selectedImage}
                  alt="Evidence"
                  width={800}
                  height={600}
                  className="max-w-full max-h-[80vh] object-contain rounded"
                />
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}

export default AdminDashboard;
