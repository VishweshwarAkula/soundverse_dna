import React, { useState, useEffect } from "react";

const triangle = (
  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#868687] text-xs">▼</span>
);

const MinimalSelect = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative w-full sm:w-[120px]">
    <select
      {...props}
      className="secondary-font bg-[#23242a] appearance-none rounded-full px-3 py-1 text-white outline-none w-full pr-7 focus:ring-2 focus:ring-[#007D49] transition-all border border-[#23242a]"
    >
      {children}
    </select>
    {triangle}
  </div>
);

interface ProfileCreationFormProps {
  onDone?: (valid: boolean) => void;
  requireAllFields?: boolean;
  requirePhoto?: boolean;
  dnaSensitivity: number;
  audioFiles?: File[];
  photoFile?: File | null;
}

const ProfileCreationForm: React.FC<ProfileCreationFormProps> = ({ onDone, requireAllFields, requirePhoto, dnaSensitivity, audioFiles = [], photoFile = null }) => {
  const [fields, setFields] = useState({
    name: "",
    description: "",
    tags: "",
    price: "9.99",
    license: "Distribution",
    tracks: "Visible",
    partner: "Yes",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [photoUploadStatus, setPhotoUploadStatus] = useState<string | null>(null);
  const [audioUploadStatus, setAudioUploadStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/tags")
      .then(res => res.json())
      .then(data => {
        if (data.success) setAllTags(data.tags);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagSearch(e.target.value);
    setShowTagDropdown(true);
  };

  const handleTagSelect = (tag: string) => {
    const tagsArr = fields.tags ? fields.tags.split(",") : [];
    if (!tagsArr.includes(tag)) {
      const newTags = [...tagsArr, tag].filter(Boolean).join(",");
      setFields({ ...fields, tags: newTags });
    }
    setTagSearch("");
    setShowTagDropdown(false);
  };

  const handleTagRemove = (tag: string) => {
    const tagsArr = fields.tags.split(",").filter(t => t !== tag);
    setFields({ ...fields, tags: tagsArr.join(",") });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requireAllFields) {
      for (const key in fields) {
        if (!fields[key as keyof typeof fields]) {
          setError("All fields are required.");
          onDone && onDone(false);
          return;
        }
      }
    }
    if (requirePhoto && !photoFile) {
      setError("Photo is required.");
      onDone && onDone(false);
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      // 1. Create profile (no files)
      const res = await fetch("http://localhost:8000/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_name: fields.name,
          description: fields.description,
          price: parseFloat(fields.price),
          license: fields.license,
          tracks: fields.tracks,
          become_partner: fields.partner,
          dna_sensitivity: dnaSensitivity,
          tags: fields.tags.split(",").filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!data.success || !data.data || !data.data[0] || !data.data[0].id) {
        setError(data.error || "Failed to save profile.");
        onDone && onDone(false);
        setLoading(false);
        return;
      }
      const profileId = data.data[0].id;
      // 2. Upload photo (if any)
      let photoUrl = null;
      if (photoFile) {
        setPhotoUploadStatus("Uploading photo...");
        const formData = new FormData();
        // Rename photo to {profileId}.png (or keep original extension)
        const ext = photoFile.name.split('.').pop() || 'png';
        const renamedPhoto = new File([photoFile], `${profileId}.${ext}`, { type: photoFile.type });
        formData.append('file', renamedPhoto);
        const photoRes = await fetch(`http://localhost:8000/upload/photo/${profileId}`, {
          method: 'POST',
          body: formData,
        });
        const photoData = await photoRes.json();
        if (photoData.success) {
          photoUrl = photoData.url.publicUrl || photoData.url.public_url || photoData.url;
          setPhotoUploadStatus("Photo uploaded!");
        } else {
          setPhotoUploadStatus("Photo upload failed");
        }
      }
      // 3. Upload audio files (if any)
      let audioUrls: string[] = [];
      if (audioFiles.length > 0) {
        setAudioUploadStatus("Uploading audio files...");
        for (let i = 0; i < audioFiles.length; i++) {
          const file = audioFiles[i];
          const formData = new FormData();
          // Rename audio to {profileId}_{i+1}.ext
          const ext = file.name.split('.').pop() || 'mp3';
          const renamedAudio = new File([file], `${profileId}_${i+1}.${ext}`, { type: file.type });
          formData.append('file', renamedAudio);
          const audioRes = await fetch(`http://localhost:8000/upload/audio/${profileId}`, {
            method: 'POST',
            body: formData,
          });
          const audioData = await audioRes.json();
          if (audioData.success) {
            audioUrls.push(audioData.url.publicUrl || audioData.url.public_url || audioData.url);
          }
        }
        setAudioUploadStatus("Audio upload complete!");
      }
      // 4. Optionally PATCH profile with photoUrl/audioUrls
      // (Uncomment if you want to store these URLs in the profile table)
      await fetch(`http://localhost:8000/profiles/${profileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo_url: photoUrl, audio_urls: audioUrls }),
      });
      setSuccess("Profile and files uploaded!");
      onDone && onDone(true);
    } catch (err) {
      setError("Failed to connect to backend.");
      onDone && onDone(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex-1 flex flex-col gap-4 min-w-[180px]" onSubmit={handleSubmit}>
      {/* Creator Name */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 py-1">
        <label className="primary-font text-white min-w-[120px]">Creator Name</label>
        <input name="name" value={fields.name} onChange={handleChange} type="text" placeholder="Name such as Skrillex, Coldplay" className="secondary-font bg-[#23242a] rounded-full px-3 py-1 text-white placeholder-[#868687] outline-none w-full sm:w-[220px]" />
      </div>
      {/* Description */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 py-1">
        <label className="primary-font text-white min-w-[120px]">Description</label>
        <input name="description" value={fields.description} onChange={handleChange} type="text" placeholder="Upto 300 characters" className="secondary-font bg-[#23242a] rounded-full px-3 py-1 text-white placeholder-[#868687] outline-none w-full sm:w-[220px]" />
      </div>
      {/* Tags */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 py-1 relative">
        <label className="primary-font text-white min-w-[120px]">Tags</label>
        <div className="w-full sm:w-[220px]">
          <div className="flex flex-wrap gap-1 mb-1">
            {fields.tags.split(",").filter(Boolean).map(tag => (
              <span key={tag} className="bg-[#007D49] text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                {tag}
                <button type="button" className="ml-1 text-xs" onClick={() => handleTagRemove(tag)}>&times;</button>
              </span>
            ))}
          </div>
          <input
            name="tags-search"
            value={tagSearch}
            onChange={handleTagInputChange}
            onFocus={() => setShowTagDropdown(true)}
            type="text"
            placeholder="Search or add tag"
            className="secondary-font bg-[#23242a] rounded-full px-3 py-1 text-white placeholder-[#868687] outline-none w-full"
            autoComplete="off"
          />
          {showTagDropdown && (tagSearch.length > 0 || allTags.length > 0) && (
            <div className="absolute z-10 bg-[#23242a] border border-[#007D49] rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
              {allTags
                .filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase()) && !fields.tags.split(",").includes(tag))
                .map(tag => (
                  <div
                    key={tag}
                    className="px-3 py-1 hover:bg-[#007D49] hover:text-white cursor-pointer text-white"
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                  </div>
                ))}
              {tagSearch && !allTags.some(tag => tag.toLowerCase() === tagSearch.toLowerCase()) && (
                <div
                  className="px-3 py-1 hover:bg-[#007D49] hover:text-white cursor-pointer text-white"
                  onClick={() => handleTagSelect(tagSearch)}
                >
                  Add "{tagSearch}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* DNA Visibility */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 py-1">
        <label className="primary-font text-white min-w-[120px]">DNA Visibility</label>
        <MinimalSelect name="visibility" onChange={handleChange}>
          <option>Public</option>
          <option>Private</option>
          <option>Draft</option>
        </MinimalSelect>
        <span className="secondary-font text-xs text-[#868687] mt-1 sm:mt-0">Public (Default), Private, Draft</span>
      </div>
      {/* Price */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 py-1">
        <label className="primary-font text-white min-w-[120px]">Price</label>
        <MinimalSelect name="price" value={fields.price} onChange={handleChange}>
          <option value="9.99">$9.99</option>
          <option value="0">Free</option>
        </MinimalSelect>
      </div>
      {/* License */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 py-1">
        <label className="primary-font text-white min-w-[120px]">License</label>
        <MinimalSelect name="license" value={fields.license} onChange={handleChange}>
          <option>Distribution</option>
          <option>Sync</option>
          <option>Full Ownership</option>
        </MinimalSelect>
        <span className="secondary-font text-xs text-[#868687] mt-1 sm:mt-0">Royalty Free, Sample, Distribution (Default), Sync, Full Ownership</span>
      </div>
      {/* Tracks */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 py-1">
        <label className="primary-font text-white min-w-[120px]">Tracks</label>
        <MinimalSelect name="tracks" value={fields.tracks} onChange={handleChange}>
          <option>Visible</option>
          <option>Invisible</option>
        </MinimalSelect>
        <span className="secondary-font text-xs text-[#868687] mt-1 sm:mt-0">Visible (Default) / Invisible</span>
      </div>
      {/* Become Partner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 py-1">
        <label className="primary-font text-white min-w-[120px]">Become Partner</label>
        <MinimalSelect name="partner" value={fields.partner} onChange={handleChange}>
          <option>Yes</option>
          <option>No</option>
        </MinimalSelect>
        <span className="secondary-font text-xs text-[#868687] mt-1 sm:mt-0">Yes/ No</span>
      </div>
      {/* Photo Upload removed */}
      {/* Audio Upload removed */}
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
      {success && <div className="text-xs text-green-500 mt-1">{success}</div>}
      <button type="submit" className="secondary-font px-6 py-2 rounded-full bg-[#007D49] text-white font-medium hover:bg-[#00663a] transition-colors mt-4 self-center min-w-[120px] text-sm" disabled={loading}>{loading ? "Saving..." : "Done"}</button>
    </form>
  );
};

export default ProfileCreationForm; 