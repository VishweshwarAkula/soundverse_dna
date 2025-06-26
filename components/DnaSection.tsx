import React from "react";

interface DnaSectionProps {
  title: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const DnaSection: React.FC<DnaSectionProps> = ({ title, description, children, className }) => {
  return (
    <section
      className={`bg-black/60 rounded-xl p-8 mb-8 shadow-lg ${className || ""}`.trim()}
      aria-label={typeof title === "string" ? title : undefined}
    >
      <h2 className="text-2xl font-semibold mb-2 text-white">{title}</h2>
      <div className="text-gray-300 mb-6">{description}</div>
      <div className="flex flex-wrap gap-4 items-center">{children}</div>
    </section>
  );
};

export default DnaSection; 