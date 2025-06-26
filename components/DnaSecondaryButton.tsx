import React from "react";

interface DnaSecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const DnaSecondaryButton: React.FC<DnaSecondaryButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-6 py-3 secondary-font rounded-full font-normal text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default DnaSecondaryButton; 