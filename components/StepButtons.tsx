import React from "react";

interface StepButtonsProps {
  steps: string[];
  activeStep: number;
  onStepClick: (idx: number) => void;
}

const StepButtons: React.FC<StepButtonsProps> = ({ steps, activeStep, onStepClick }) => (
  <div className="w-full overflow-x-auto">
    <div className="flex gap-2 py-1 px-1 min-w-max justify-center">
      {steps.map((step, idx) => (
        <button
          key={step}
          className={`secondary-font text-xs font-medium transition-colors px-3 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[#007D49] focus:ring-offset-2 focus:ring-offset-black whitespace-nowrap
            ${activeStep === idx
              ? "bg-[#007D49] text-white shadow-md"
              : "bg-[#18191A] text-[#868687] hover:bg-[#23242a] hover:text-white"}
          `}
          tabIndex={0}
          type="button"
          onClick={() => onStepClick(idx)}
        >
          {step}
        </button>
      ))}
    </div>
  </div>
);

export default StepButtons; 