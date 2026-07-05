'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // delegate to middleware which will redirect to role-specific dashboards
    router.push('/dashboard');
  }, [router]);

  return <div>{children}</div>;
}
