"use client";

import { useEffect, useRef, useState } from "react";
import { Album } from "./music-constants";
import Script from "next/script";
import { updateMusicTimeAndNumber } from "@/data/playlistData";
import { ScaleLoader } from "react-spinners";

export const YoutubePlayer = ({ album }: { album: Album }) => {
  const [hasPlayed, setHasPlayed] = useState(false);

  const [elapsedTime, setElapsedTime] = useState(0); // Time in seconds
  const [videoDuration, setVideoDuration] = useState(0); // Duration in seconds
  const playerRef = useRef<YT.Player | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onYouTubeIframeAPIReady = () => {
      playerRef.current = new YT.Player(`player-${album.videoId}`, {
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    if (
      typeof window.YT === "undefined" ||
      typeof window.YT.Player === "undefined"
    ) {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    } else {
      onYouTubeIframeAPIReady();
    }

    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [album.videoId]);

  const onPlayerReady = (event: YT.PlayerEvent) => {
    const duration = event.target.getDuration();
    setVideoDuration(duration);
    // console.log(
    //   `Total video duration: ${Math.floor(
    //     duration / 60
    //   )} minutes and ${Math.floor(duration % 60)} seconds`
    // );
    console.log("Player ready!");
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === YT.PlayerState.PLAYING && !hasPlayed) {
      const currentTime = event.target.getCurrentTime();

      // Check if the video is playing from the start (or near the start)
      if (currentTime < 1) {
        setHasPlayed(true);

        // Insert your first-time tracking code here
        updateMusicTimeAndNumber(album.id as string);
      }

      // Start tracking time if not already tracking
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            setElapsedTime(currentTime);
            // console.log(
            //   `Elapsed time: ${Math.floor(
            //     currentTime / 60
            //   )} minutes and ${Math.floor(currentTime % 60)} seconds`
            // );
          }
        }, 30000); // Update every 30 second
      }
    } else if (
      event.data === YT.PlayerState.PAUSED ||
      event.data === YT.PlayerState.ENDED
    ) {
      // Stop tracking time
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  // console.log(YT.PlayerState);

  return (
    <>
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
      />
      <iframe
        id={`player-${album.videoId}`}
        width={"100%"}
        height={"100%"}
        className="absolute top-0 left-0"
        src={`https://www.youtube.com/embed/${album.videoId}?enablejsapi=1`}
        title={album.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </>
  );
};
