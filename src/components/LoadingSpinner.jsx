import React from 'react';

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin mx-auto"></div>
          {/* <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin absolute top-2 left-2"></div>
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin absolute top-4 left-4"></div> */}
        </div>
        <p className="mt-6 text-lg text-gray-700 font-medium">{message}</p>
        <p className="mt-2 text-sm text-gray-500">Government Billboard Portal</p>
      </div>
    </div>
  );
}
