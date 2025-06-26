'use client';
import React, { useRef, useState, useEffect } from "react";

interface UploadPictureCardProps {
  onPhotoUploaded?: (file: File | null) => void;
}

const UploadPictureCard: React.FC<UploadPictureCardProps> = ({ onPhotoUploaded }) => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (onPhotoUploaded) onPhotoUploaded(file);
    } else {
      setPhoto(null);
      setPreviewUrl(null);
      if (onPhotoUploaded) onPhotoUploaded(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full md:w-auto flex-1">
      <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 border-[#23242a] flex items-center justify-center bg-[#18191A] mb-4 relative shadow-lg overflow-hidden">
        {hasMounted && previewUrl ? (
          <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover rounded-full" />
        ) : (
          <button type="button" className="absolute inset-0 w-full h-full flex items-center justify-center text-5xl text-[#868687] bg-transparent hover:bg-[#23242a]/40 rounded-full transition-all" onClick={handleButtonClick}>+</button>
        )}
        {hasMounted && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        )}
      </div>
      <button type="button" className="secondary-font px-6 py-3 rounded-full bg-[#23242a] text-white font-medium text-base" onClick={handleButtonClick}>
        {photo ? "Change Picture" : "Upload Picture"}
      </button>
      {photo && <span className="text-xs text-[#868687] mt-2">{photo.name}</span>}
    </div>
  );
};

export default UploadPictureCard; 