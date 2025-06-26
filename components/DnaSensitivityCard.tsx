import React from "react";

interface DnaSensitivityCardProps {
  disabled?: boolean;
  value: number;
  onChange: (v: number) => void;
  onSetSensitivity?: () => void;
  onSkip?: () => void;
}

const DnaSensitivityCard: React.FC<DnaSensitivityCardProps> = ({ disabled, value, onChange, onSetSensitivity, onSkip }) => (
  <div className="bg-[#0B0B0B] border border-[#212122] rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center w-full min-h-[300px] mb-4 shadow-lg">
    <div className="primary-font text-xl text-white mb-2 text-center">Set the level of sensitivity for the DNA creation</div>
    <div className="secondary-font text-[#868687] mb-8 text-center">
      Less sensitivity will result in less number of DNAs, higher sensitivity will result in many niche DNAs.
    </div>
    {/* Slider */}
    <div className="w-full flex flex-col items-center mb-8">
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        step={1}
        className="w-full accent-[#007D49] h-2 rounded-lg appearance-none bg-[#23242a] focus:outline-none"
        style={{ maxWidth: 400 }}
      />
      <div className="flex justify-between w-full mt-2 text-xs text-[#868687] secondary-font" style={{ maxWidth: 400 }}>
        <div className="flex flex-col items-start">
          <span>Least Sensitive</span>
          <span>(Generic Genre DNAs)</span>
        </div>
        <div className="text-center">Recommended</div>
        <div className="flex flex-col items-end">
          <span>Highly Sensitive</span>
          <span>(Niche Genre DNAs)</span>
        </div>
      </div>
    </div>
    <div className="flex gap-6 mt-4">
      <button
        className="secondary-font px-8 py-3 rounded-full bg-[#007D49] text-white font-medium hover:bg-[#00663a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
        onClick={onSetSensitivity}
      >
        Set Sensitivity
      </button>
      <button className="secondary-font px-8 py-3 rounded-full bg-transparent border border-[#868687] text-[#868687] font-medium hover:bg-[#23242a] transition-colors" onClick={onSkip}>
        Skip
      </button>
    </div>
  </div>
);

export default DnaSensitivityCard; 