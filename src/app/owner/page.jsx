"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OwnerPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/owner/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to owner dashboard...</p>
      </div>
    </div>
  );
}
