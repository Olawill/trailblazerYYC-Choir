"use client";

import {
  FastForward,
  Pause,
  Play,
  Rewind,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Howl } from "howler";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

interface MusicPlayerProps {
  title: string;
  sound: Howl;
}

export const MusicPlayer = forwardRef(
  ({ title, sound }: MusicPlayerProps, ref) => {
    const [playing, setPlaying] = useState(false);
    const [soundId, setSoundId] = useState<number | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [seekTime, setSeekTime] = useState<number>(0);
    const [volume, setVolume] = useState<number>(0);
    const [prevVolume, setPrevVolume] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [isVolumeDragging, setIsVolumeDragging] = useState(false);

    useImperativeHandle(ref, () => ({
      stop: () => {
        if (playing) {
          if (soundId) {
            sound.stop(soundId);
          } else {
            sound.stop();
          }
          setPlaying(false);
        }
      },
    }));

    useEffect(() => {
      sound.once("load", () => {
        setDuration(sound.duration());
        setVolume(sound.volume());
      });

      sound.on("end", () => setPlaying(false));
    }, [sound]);

    useEffect(() => {
      let interval: ReturnType<typeof setInterval> | undefined;
      if (playing && !isDragging) {
        interval = setInterval(() => {
          const current = sound.seek(); // Get the current seek time
          setSeekTime(current); // Update the seek time state
        }, 500); // Update every second
      } else if (!playing && interval) {
        clearInterval(interval); // Clear the interval when not playing
      }

      return () => {
        if (!(seekTime < duration)) clearInterval(interval);
      }; // Cleanup on unmount or when `playing` changes
    }, [playing, isDragging]);

    const formatDuration = (d: number) => {
      const sec = Math.floor(d % 60);
      const modSec = sec < 10 ? `0${sec}` : `${sec}`;
      return `${Math.floor(d / 60)}:${modSec}`;
    };

    const handlePlay = () => {
      if (!playing) {
        if (soundId) {
          sound.play(soundId); // Resume playing if the sound was paused
        } else {
          const testId = sound.play(); // Play for the first time
          setSoundId(testId);
          // setDuration(sound.duration());
        }
      } else {
        if (soundId) {
          sound.pause(soundId); // Pause the sound
          // sound.stop();
        }
      }
      setPlaying(!playing); // Toggle playing state
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = Number(e.target.value);
      setSeekTime(newTime);
      sound.seek(newTime);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = Number(e.target.value);
      setVolume(newVolume);
      sound.volume(newVolume);
    };

    const handleDragStart = () => {
      setIsDragging(true);
    };

    const handleVolumeDragStart = () => {
      setIsVolumeDragging(true);
    };

    const handleVolumeDragEnd: React.MouseEventHandler<HTMLInputElement> = (
      e
    ) => {
      const newVolume = Number(e.currentTarget.value);
      sound.volume(newVolume);
      setVolume(newVolume);
      setIsVolumeDragging(false);
    };

    const handleDragEnd: React.MouseEventHandler<HTMLInputElement> = (e) => {
      const newTime = Number(e.currentTarget.value);
      sound.seek(newTime);
      setSeekTime(newTime);
      setIsDragging(false);
    };

    const handleForwardReverse = (type: "forward" | "reverse") => {
      const newTime = type === "forward" ? seekTime + 10 : seekTime - 10;

      sound.seek(newTime);
      setSeekTime(newTime);
      setIsDragging(false);
    };
    return (
      <div className="bg-black text-white rounded-lg p-4 w-full h-full flex flex-col items-center gap-4 justify-center ">
        <h1 className="italic font-bold text-lg md:text-5xl text-center">
          {title}
        </h1>

        <div className="w-full flex justify-center items-center">
          <span className="font-bold italic w-6 md:text-3xl mr-4 md:mr-12">
            {formatDuration(seekTime)}
          </span>
          <h3 className="w-2 font-bold md:text-3xl">/</h3>
          <span className="font-bold italic w-6 md:text-3xl">
            {formatDuration(duration)}
          </span>
        </div>

        <div className="relative w-full">
          <input
            type="range"
            min={0}
            max={Math.floor(duration)}
            value={Math.floor(seekTime)}
            onChange={handleSliderChange}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            className="w-full appearance-none bg-slate-500 h-px rounded-full cursor-pointer focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleForwardReverse("reverse")}
            className="py-2 px-2 rounded-md"
          >
            <Rewind className="h-4 w-4 md:h-8 md:w-8" />
          </button>

          <button onClick={handlePlay} className="py-2 px-2 rounded-md">
            {playing ? (
              <Pause className="h-8 w-8 md:h-16 md:w-16" />
            ) : (
              <Play className="h-8 w-8 md:h-16 md:w-16" />
            )}
          </button>

          <button
            onClick={() => handleForwardReverse("forward")}
            className="py-2 px-2 rounded-md"
          >
            <FastForward className="h-4 w-4 md:h-8 md:w-8" />
          </button>
        </div>

        <div className="relative w-full md:w-1/3 flex items-center gap-2">
          {volume === 0 && (
            <VolumeX
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                setVolume(prevVolume); // Restore previous volume
                sound.volume(prevVolume);
              }}
            />
          )}
          {volume > 0 && volume <= 0.5 && (
            <Volume
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                setPrevVolume(volume);
                setVolume(0);
                sound.volume(0);
              }}
            />
          )}
          {volume > 0.5 && volume < 1 && (
            <Volume1
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                setPrevVolume(volume);
                setVolume(0);
                sound.volume(0);
              }}
            />
          )}
          {volume === 1 && (
            <Volume2
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                setPrevVolume(volume);
                setVolume(0);
                sound.volume(0);
              }}
            />
          )}
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={handleVolumeChange}
            onMouseDown={handleVolumeDragStart}
            onMouseUp={handleVolumeDragEnd}
            className="w-full appearance-none bg-slate-500 h-px rounded-full cursor-pointer focus:outline-none"
          />
        </div>
      </div>
    );
  }
);

// Set the display name for the component
MusicPlayer.displayName = "MusicPlayer";
