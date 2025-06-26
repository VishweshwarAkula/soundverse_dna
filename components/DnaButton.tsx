import React from "react";

interface DnaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const DnaButton: React.FC<DnaButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-6 py-3 rounded-full font-semibold text-white bg-[#007D49] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#007D49] transition-colors ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default DnaButton; 