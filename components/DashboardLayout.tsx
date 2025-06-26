'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useSidebar } from '../context/SidebarContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { collapsed, setCollapsed } = useSidebar();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // On the server, and before the client has mounted, we render a default state
  // to ensure the HTML structure matches. The `collapsed` state will be the default `false`.
  const currentCollapsed = hasMounted ? collapsed : false;
  
  return (
    <div className="min-h-screen bg-black">
      <Sidebar collapsed={currentCollapsed} setCollapsed={setCollapsed} />
      <main className={`relative transition-all duration-500 ease-in-out ${currentCollapsed ? 'sm:ml-[56px]' : 'sm:ml-[232px]'}`}>
        {children}
      </main>
    </div>
  );
} 