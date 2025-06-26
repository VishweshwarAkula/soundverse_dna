"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import { FiMenu, FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import DropdownMenu, { MenuItem } from './DropdownMenu';

interface TopBannerProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  glowColor?: string;
  children?: React.ReactNode;
}

const TopBanner: React.FC<TopBannerProps> = ({ title, subtitle, glowColor = "#66ABFF", children }) => {
  const [atTop, setAtTop] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const { setMobileOpen } = useSidebar();

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => {
      setAtTop(window.scrollY < 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Only use scroll state after mount to avoid hydration mismatch
  const effectiveAtTop = hasMounted ? atTop : true;

  const dropdownItems: MenuItem[] = [
    { label: 'Profile', href: '/profile', icon: <FiUser /> },
    { label: 'Settings', href: '/settings', icon: <FiSettings /> },
    { label: 'Log out', onClick: () => alert('Logging out...'), icon: <FiLogOut /> }
  ];

  const heightClass = effectiveAtTop ? "h-[220px] py-6 pr-6" : "h-[120px] py-4 pr-5";
  const avatarClass = effectiveAtTop ? "top-6 right-6" : "top-4 right-5";
  const contentPaddingClass = effectiveAtTop ? "pb-12" : "pb-0";

  return (
    <div
      data-topbanner
      className={`w-full bg-gradient-radial from-[#23242a] to-black relative flex items-center transition-all duration-300 ${heightClass}`}
    >
      {/* Hamburger Menu for Mobile */}
      <button
        className="sm:hidden absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 text-gray-300"
        onClick={() => setMobileOpen(true)}
      >
        <FiMenu size={24} />
      </button>

      {/* User avatar always at top right */}
      <div
        className={`absolute z-50 transition-all duration-300 ${avatarClass}`}
      >
        <DropdownMenu
          items={dropdownItems}
          trigger={
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User avatar"
              className="w-10 h-10 sm:w-10 sm:h-10 rounded-full border-2 border-gray-700 object-cover shadow-lg cursor-pointer"
            />
          }
        />
      </div>
      <div className={`max-w-4xl w-full sm:pl-[99px] pl-4 flex flex-col items-center sm:items-start text-center sm:text-left ${contentPaddingClass}`}>
        <header className="relative w-full">
          {/* Glow Effect */}
          <div
            className="absolute top-1/2 left-1/2 sm:-left-16 sm:left-auto -translate-x-1/2 sm:translate-x-0 -translate-y-1/2 w-[300px] sm:w-[500px] h-20 sm:h-32 rounded-full blur-3xl -z-10"
            style={{ backgroundColor: glowColor, opacity: 0.3 }}
          ></div>
          <h1 className="primary-font text-2xl sm:text-4xl text-white mb-2 relative z-10">{title}</h1>
          <p className={`secondary-font text-sm sm:text-base text-[#868687] relative z-10 transition-opacity duration-300 ${effectiveAtTop ? 'opacity-100' : 'opacity-0'}`}>{subtitle}</p>
        </header>
      </div>
      {children && (
        <div className="absolute left-0 bottom-0 w-full z-20">{children}</div>
      )}
    </div>
  );
};

export default TopBanner; 