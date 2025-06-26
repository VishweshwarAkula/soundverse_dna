'use client'
import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiPlus, FiHome, FiSearch, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { GiDna1 } from "react-icons/gi";
import { useSidebar } from "../context/SidebarContext";
import Tooltip from './Tooltip';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { icon: FiPlus, label: "Add", href: "#" },
  { icon: FiHome, label: "Home", href: "#" },
  { icon: FiSearch, label: "Search", href: "#" },
  { icon: GiDna1, label: "DNA", href: "/build-dna", isDna: true },
];

const SidebarContent = () => {
  const pathname = usePathname();
  return (
    <nav className="flex-grow p-2 flex flex-col gap-y-1.5">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors ${isActive ? 'bg-[#1C1E1F] rounded-xl' : ''}`}
          >
            {React.createElement(item.icon, { size: 22 })}
            <span className={`${item.isDna ? "primary-font" : ""} ml-4 font-medium whitespace-nowrap`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { mobileOpen, setMobileOpen } = useSidebar();
  const sidebarWidth = collapsed ? 56 : 232;

  return (
    <>
      {/* --- Mobile Sidebar (Glassmorphic Overlay) --- */}
      <div className="sm:hidden">
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setMobileOpen(false)}
        ></div>
        
        {/* Sidebar Panel */}
        <aside 
          className={`fixed top-0 left-0 z-50 w-58 h-full bg-black/80 border-r border-gray-800 flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between p-4 h-20">
            <img src="https://www.soundverse.ai/assets/navLogo.svg" alt="Soundverse Logo" className="h-14 w-auto"/>
            <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-300">
              <FiX size={24} />
            </button>
          </div>
          <SidebarContent />
        </aside>
      </div>

      {/* --- Desktop Sidebar --- */}
      <div className="hidden sm:block">
        <button
          className="fixed top-8 z-50 p-2 rounded-lg bg-[#23242a] border border-[#212122] text-gray-300 hover:text-white hover:bg-gray-700 transition-[left] duration-500 ease-in-out shadow"
          style={{ left: sidebarWidth + 16 }}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
        <aside
          className={`h-screen bg-black flex flex-col fixed left-0 top-0 z-40 border-r border-gray-800 transition-all duration-500 ease-in-out ${collapsed ? "w-14" : "w-58"}`}
        >
          <div className={`flex flex-col items-center ${collapsed ? 'pt-4' : 'p-4'} h-20 ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {collapsed ? (
              <img src="/logoSquare.webp" alt="Logo" className="h-8 w-8 mb-3"/>
            ) : (
              <img src="https://www.soundverse.ai/assets/navLogo.svg" alt="Soundverse Logo" className="h-14 w-auto transition-all duration-300 ease-out scale-100 animate-pop" style={{ animation: 'popIn 0.3s' }}/>
            )}
          </div>
          {/* Re-using the nav items but adapting for collapsed state */}
           <nav className="flex-grow p-2 flex flex-col gap-y-1.5">
              {navItems.map((item) => {
                const isActive = usePathname() === item.href;
                const linkContent = (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors w-full ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-[#1C1E1F] rounded-xl' : ''}`}
                  >
                    {collapsed
                      ? item.isDna
                        ? <span className="primary-font text-sm">DNA</span>
                        : React.createElement(item.icon, { size: 28 })
                      : React.createElement(item.icon, { size: 22 })}
                    {!collapsed && (
                      <span className={`${item.isDna ? "primary-font" : ""} ml-4 font-medium whitespace-nowrap`}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                );

                return collapsed ? (
                  <Tooltip text={item.label} position="right" key={item.label}>
                    {linkContent}
                  </Tooltip>
                ) : (
                  linkContent
                );
              })}
            </nav>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
