'use client';
import React, { useState, useEffect } from "react";
import TopBanner from "../../components/TopBanner";
import ProfileCreationForm from "../../components/ProfileCreationForm";
import UploadAudioCard from "../../components/UploadAudioCard";
import DnaSensitivityCard from "../../components/DnaSensitivityCard";
import UploadPictureCard from "../../components/UploadPictureCard";
import DashboardLayout from "../../components/DashboardLayout";
import { useSidebar } from "../../context/SidebarContext";
import StepButtons from "../../components/StepButtons";

const steps = [
  "Step 1: Upload Audio",
  "Step 2: DNA Sensitivity",
  "Step 3: Profile Creation",
];

export default function UploadAudioTracksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const { collapsed } = useSidebar();
  const [audioUploaded, setAudioUploaded] = useState(false);
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [step3Completed, setStep3Completed] = useState(false);
  const [showStep4, setShowStep4] = useState(false);
  const [dnaSensitivity, setDnaSensitivity] = useState(5);

  // Track which step is in view
  useEffect(() => {
    const handleScroll = () => {
      const banner = document.querySelector('[data-topbanner]');
      let bannerHeight = 180;
      if (banner) {
        const style = window.getComputedStyle(banner);
        bannerHeight = parseInt(style.height) || 180;
      }
      let found = 0;
      for (let i = 1; i <= 4; i++) {
        const el = document.getElementById(`step-${i}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top - bannerHeight <= 40 && rect.bottom - bannerHeight > 40) {
            found = i - 1;
            break;
          }
        }
      }
      setActiveStep(found);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cardMaxWidth = collapsed ? "max-w-5xl" : "max-w-4xl";

  // Scroll helper
  const scrollToStep = (step: number) => {
    const el = document.getElementById(`step-${step}`);
    if (el) {
      const banner = document.querySelector('[data-topbanner]');
      let bannerHeight = 180;
      if (banner) {
        const style = window.getComputedStyle(banner);
        bannerHeight = parseInt(style.height) || 180;
      }
      const y = el.getBoundingClientRect().top + window.scrollY - bannerHeight - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Step 1: UploadAudioCard callback
  const handleAudioFilesChange = (files: File[]) => {
    setAudioFiles(files);
    setAudioUploaded(files.length > 0);
  };

  // Step 2: DNA Sensitivity (no change)

  // Step 3: ProfileCreationForm callback
  const handleStep3Done = (valid: boolean) => {
    if (valid) {
      setStep3Completed(true);
      setShowStep4(true);
      setTimeout(() => scrollToStep(4), 100); // scroll after render
    }
  };

  // Step 1: UploadPictureCard callback
  const handlePhotoUploaded = (file: File | null) => {
    setPhotoFile(file);
  };

  return (
    <DashboardLayout>
      {/* Sticky TopBanner */}
      <div className="sticky top-0 z-30 w-full bg-black/80 backdrop-blur-md">
        <TopBanner
          title="Build DNA by Uploading Audio Tracks"
          subtitle={
            <>
              Upload your audio tracks to build your DNA on Soundverse.{' '}
              <a href="#" className="underline text-[#FFFFFF]">Learn more</a>
            </>
          }
        >
          <StepButtons
            steps={steps}
            activeStep={activeStep}
            onStepClick={(idx) => scrollToStep(idx + 1)}
          />
        </TopBanner>
      </div>
      {/* Step 1 */}
      <div id="step-1" className={`w-full ${cardMaxWidth} mx-auto mb-10 px-4 sm:px-8 pt-8`}>
        <div className="mb-2 text-[#868687] secondary-font">Step 1</div>
        <div className="primary-font text-2xl text-white mb-6">Upload Audio</div>
        <UploadAudioCard onAudioFilesChange={handleAudioFilesChange} />
      </div>
      {/* Step 2 */}
      <div id="step-2" className={`w-full ${cardMaxWidth} mx-auto mb-10 px-4 sm:px-8`}>
        <div className="mb-2 text-[#868687] secondary-font">Step 2</div>
        <div className="primary-font text-2xl text-white mb-6">DNA Sensitivity</div>
        <DnaSensitivityCard
          disabled={!audioUploaded}
          value={dnaSensitivity}
          onChange={setDnaSensitivity}
          onSetSensitivity={() => {
            if (audioUploaded) scrollToStep(3);
          }}
        />
      </div>
      {/* Step 3 */}
      <div id="step-3" className={`w-full ${cardMaxWidth} mx-auto mb-10 px-4 sm:px-8`}>
        <div className="mb-2 text-[#868687] secondary-font">Step 3</div>
        <div className="primary-font text-2xl text-white mb-8 py-2">Profile Creation</div>
        <div className="bg-[#0B0B0B] border border-[#212122] rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-center w-full min-h-[220px] mb-4 shadow-lg overflow-x-auto gap-4">
          <ProfileCreationForm
            onDone={handleStep3Done}
            requireAllFields
            dnaSensitivity={dnaSensitivity}
            audioFiles={audioFiles}
            photoFile={photoFile}
          />
          <UploadPictureCard onPhotoUploaded={handlePhotoUploaded} />
        </div>
      </div>
      {/* Step 4 */}
      {showStep4 && (
        <div id="step-4" className={`w-full ${cardMaxWidth} mx-auto mb-10 px-4 sm:px-8`}>
          <div className="mb-2 text-[#868687] secondary-font">Step 4</div>
          <div className="primary-font text-2xl text-white mb-6">Tagging and Categorization</div>
          <div className="flex flex-col items-center justify-center min-h-[350px]">
            <div className="relative flex flex-col items-center justify-center w-full" style={{ minHeight: 320 }}>
              {/* Fully Rotating Green Arc */}
              <svg width="300" height="300" viewBox="0 0 300 300" className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-spin-slow">
                <circle
                  cx="150"
                  cy="150"
                  r="120"
                  stroke="#00B86B"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="565"
                  strokeDashoffset="0"
                />
              </svg>
              <style>{`
                @keyframes spin-slow {
                  100% { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                  animation: spin-slow 2s linear infinite;
                }
              `}</style>
              <div className="primary-font text-white text-4xl font-bold text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 leading-tight w-[260px]">
                WE&apos;RE<br />BUILDING<br />YOUR <span className="font-extrabold">DNA</span>
              </div>
            </div>
            <div className="secondary-font text-xs text-[#868687] mt-8 text-center max-w-lg">
              YOUR DNA WILL BE READY IN A FEW MINUTES. WE&apos;LL INFORM YOU ONCE IT&apos;S READY. YOU CAN USE THE STUDIO MEANWHILE
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 