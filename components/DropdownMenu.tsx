'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';

export interface MenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactElement;
  hasArrow?: boolean;
}

interface DropdownMenuProps {
  items: MenuItem[];
  trigger: React.ReactElement;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {React.cloneElement(trigger, { onClick: handleTriggerClick })}

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-56 origin-top-right bg-[#1C1E1F] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          style={{ animation: 'popIn 0.2s' }}
        >
          <div className="py-1">
            {items.map((item, index) => {
              const content = (
                <a
                  className="flex justify-between items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    {item.icon && <span className="mr-3">{item.icon}</span>}
                    {item.label}
                  </div>
                  {item.hasArrow && <FiChevronRight size={16} />}
                </a>
              );

              return item.href ? (
                <Link href={item.href} key={index} passHref legacyBehavior>
                  {content}
                </Link>
              ) : (
                <div key={index} role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && item.onClick?.()} >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu; 