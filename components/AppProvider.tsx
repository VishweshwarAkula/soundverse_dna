'use client';

import { SidebarProvider } from '../context/SidebarContext';
import { ReactNode } from 'react';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
} 