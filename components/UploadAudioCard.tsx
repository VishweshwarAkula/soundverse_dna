'use client';
import React, { useRef, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

interface AudioFile {
  file: File;
  url: string;
  id: string;
  uploadedUrl?: string;
  uploading?: boolean;
  error?: string;
}

interface AudioWaveformProps {
  file: File;
  url: string;
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
  pauseOthers: () => void;
}

interface UploadAudioCardProps {
  onAudioFilesChange?: (files: File[]) => void;
}

const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/x-pn-wav', 'audio/ogg', 'audio/flac', 'audio/aiff', 'audio/x-aiff', 'audio/aifc', 'audio/x-aifc'
];

const AudioWaveform: React.FC<AudioWaveformProps> = ({ file, url, onPlay, onPause, isPlaying, pauseOthers }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    let ws: WaveSurfer | null = null;
    try {
      ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#868687",
        progressColor: "#007D49",
        height: 32,
        barWidth: 2,
        responsive: true,
        interact: true,
        cursorColor: "#007D49",
        backgroundColor: "#18191A",
      });
      ws.load(url);
      ws.setVolume(1);
    } catch (e) {
      setError("Could not initialize audio player. Please try another file.");
      setReady(false);
      return;
    }
    let readyTimeout = setTimeout(() => {
      if (ws && !ws.isReady) {
        setError("Could not load audio file. Please try another file.");
        setReady(false);
      }
    }, 4000); // 4 seconds to load
    ws.on("ready", () => {
      clearTimeout(readyTimeout);
      setDuration(ws!.getDuration());
      setReady(true);
      setError(null);
      ws!.setVolume(volume);
    });
    ws.on("audioprocess", () => setCurrentTime(ws!.getCurrentTime()));
    ws.on("seek", () => setCurrentTime(ws!.getCurrentTime()));
    ws.on("finish", () => onPause());
    ws.on("error", (e) => {
      clearTimeout(readyTimeout);
      if (e && typeof e === 'object' && 'message' in e && (e as any).message?.includes('signal is aborted')) {
        setError("Audio loading was interrupted. Please try again or use a different file.");
      } else {
        setError("Could not load audio file. Please try another file.");
      }
      setReady(false);
    });
    setWavesurfer(ws);
    return () => {
      clearTimeout(readyTimeout);
      ws && ws.destroy();
    };
  }, [url]);

  useEffect(() => {
    if (!wavesurfer) return;
    if (isPlaying && ready) {
      pauseOthers();
      wavesurfer.play();
    } else {
      wavesurfer.pause();
    }
  }, [isPlaying, wavesurfer, pauseOthers, ready]);

  // Update volume on slider change
  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.setVolume(volume);
    }
  }, [volume, wavesurfer]);

  const handlePlayPause = () => {
    if (!wavesurfer || !ready) return;
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleSeek = (value: number) => {
    if (wavesurfer && duration && ready) {
      wavesurfer.seekTo(value / duration);
      setCurrentTime(value);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col gap-1 bg-[#18191A] rounded-lg px-3 py-2">
      <div className="flex items-center gap-3">
        <button
          className={`w-8 h-8 flex items-center justify-center rounded-full ${isPlaying && ready ? 'bg-[#007D49] text-white' : 'bg-[#23242a] text-[#868687]'} transition-colors`}
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={!ready}
        >
          {isPlaying && ready ? (
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><rect x="4" y="4" width="4" height="12"/><rect x="12" y="4" width="4" height="12"/></svg>
          ) : (
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><polygon points="5,3 19,10 5,17"/></svg>
          )}
        </button>
        <span className="text-white text-sm truncate max-w-[180px]">{file.name}</span>
        <span className="text-xs text-[#868687] ml-auto">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div ref={containerRef} className="w-full h-8 bg-[#23242a] rounded" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-32 h-1 accent-[#00B86B]"
          disabled={!ready}
        />
      </div>
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
};

const UploadAudioCard: React.FC<UploadAudioCardProps> = ({ onAudioFilesChange }) => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
    return () => {
      audioFiles.forEach((audio) => URL.revokeObjectURL(audio.url));
    };
  }, [audioFiles]);

  // Drag and drop handlers
  useEffect(() => {
    const dropArea = dropRef.current;
    if (!dropArea) return;
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.files) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    };
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    dropArea.addEventListener("drop", handleDrop);
    dropArea.addEventListener("dragover", handleDragOver);
    return () => {
      dropArea.removeEventListener("drop", handleDrop);
      dropArea.removeEventListener("dragover", handleDragOver);
    };
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  const handleFiles = (files: File[]) => {
    const audioFilesToAdd = files.filter((file) => SUPPORTED_AUDIO_TYPES.includes(file.type));
    setAudioFiles((prev) => {
      const existingIds = new Set(prev.map((a) => a.id));
      const newAudioFiles: AudioFile[] = audioFilesToAdd
        .map((file) => ({
          file,
          url: URL.createObjectURL(file),
          id: file.name + file.size + file.lastModified,
        }))
        .filter((audio) => !existingIds.has(audio.id));
      const allFiles = [...prev, ...newAudioFiles];
      if (onAudioFilesChange) onAudioFilesChange(allFiles.map(a => a.file));
      return allFiles;
    });
  };

  const pauseOthers = (idx: number) => {
    setPlayingIdx(idx);
  };

  return (
    <div
      ref={dropRef}
      className="bg-[#0B0B0B] border border-[#212122] rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center w-full min-h-[300px] mb-4 shadow-lg"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={handleFilesChange}
      />
    <div className="flex flex-col items-center">
      <span className="text-4xl mb-4 text-[#868687]">&#8682;</span>
      <div className="secondary-font text-white text-center mb-4">
        <b>Choose audio file(s) folder(s) or drag it here</b>
        <div className="text-xs text-[#868687] mt-1">
          Supported formats: .mp3, .wav, .aifc, .ogg, .flac
        </div>
      </div>
        <button
          className="secondary-font px-6 py-2 rounded-full bg-[#6C63FF] text-white font-medium mt-2 mb-2 hover:bg-[#5548c8] transition-colors"
          onClick={handleButtonClick}
        >
        Upload audio file(s)
      </button>
    </div>
      {hasMounted && audioFiles.length > 0 && (
        <div className="w-full mt-6">
          <div className="secondary-font text-xs text-[#868687] mb-2">Uploaded files:</div>
          <ul className="w-full flex flex-col gap-4">
            {audioFiles.map((audio, idx) => (
              <li key={audio.id} className="flex flex-col gap-1 bg-[#18191A] rounded-lg px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm truncate max-w-[180px]">{audio.file.name}</span>
                </div>
                <AudioWaveform
                  file={audio.file}
                  url={audio.url}
                  isPlaying={playingIdx === idx}
                  onPlay={() => setPlayingIdx(idx)}
                  onPause={() => setPlayingIdx(null)}
                  pauseOthers={() => pauseOthers(idx)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    <div className="secondary-font text-xs text-[#868687] mt-6 text-center">
      By uploading files, you agree that you have the ownership and authority to upload them.
    </div>
  </div>
);
};

export default UploadAudioCard; 