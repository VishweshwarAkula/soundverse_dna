import React from "react";
import DnaSection from "../../components/DnaSection";
import DnaButton from "../../components/DnaButton";
import DnaSecondaryButton from "../../components/DnaSecondaryButton";
import Link from "next/link";

export default function BuildDnaPage() {
  return (
    <>
      <DnaSection
        className="card-bg"
        title={<span className="primary-font">Verify your creator identity &rarr; <span className="text-blue-400">Unlock your DNA</span></span>}
        description={
          <span className="secondary-font">Simply claim your profile, and we&apos;ll build your DNA automatically. Are you a creator with music already on Spotify, Youtube etc?</span>
        }
      >
        <DnaButton className="secondary-font">Claim your profile</DnaButton>
        <DnaSecondaryButton className="secondary-font">This doesn&apos;t apply to me</DnaSecondaryButton>
      </DnaSection>
      <DnaSection
        className="card-bg"
        title={<span className="primary-font">Build DNA by Uploading Audio Tracks</span>}
        description={
          <span className="secondary-font">
            You can upload your music, and build your Sonic DNA. Please note that by default all DNAs remain private.<br />
            <ul className="list-disc pl-6 mt-2 text-gray-400 text-base">
              <li><b>Build with AI:</b> With this, AI will take care of captions, categorisations, tags.</li>
              <li><b>Build Manually:</b> You&apos;ll have to manually add captions, categorisations and tags.</li>
            </ul>
          </span>
        }
      >
        <Link href="/upload-audio-tracks">
          <DnaButton className="secondary-font">Upload audio</DnaButton>
        </Link>
      </DnaSection>
    </>
  );
} 