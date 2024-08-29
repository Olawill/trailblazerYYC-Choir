"use client";

import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Album } from "./music-constants";
import Script from "next/script";
import { updateMusicTimeAndNumber } from "@/data/playlistData";

export const YoutubePlayer = ({ album }: { album: Album }) => {
  const [hasPlayed, setHasPlayed] = useState(false);

  const [videoDuration, setVideoDuration] = useState(0); // Duration in seconds
  const playerRef = useRef<YT.Player | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasPlayedRef = useRef(hasPlayed); // Ref to track hasPlayed

  // Initialize the player
  const initializePlayer = () => {
    if (window.YT && window.YT.Player) {
      playerRef.current = new YT.Player(`player-${album.videoId}`, {
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    } else {
      console.error("YouTube API is not loaded.");
    }
  };

  useEffect(() => {
    if (
      typeof window.YT === "undefined" ||
      typeof window.YT.Player === "undefined"
    ) {
      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        // intervalRef.current = null;
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

  const onPlayerStateChange = useCallback(
    (event: YT.OnStateChangeEvent) => {
      if (!event.target) {
        console.error("Player event target is missing.");
        return;
      }

      const isPlaying = event.data === YT.PlayerState.PLAYING;
      const isPausedOrEnded =
        event.data === YT.PlayerState.PAUSED ||
        event.data === YT.PlayerState.ENDED;

      if (isPlaying) {
        // const currentTime = event.target.getCurrentTime();

        if (!hasPlayedRef.current) {
          hasPlayedRef.current = true;
          setHasPlayed(true);

          // Insert your first-time tracking code here
          updateMusicTimeAndNumber(album.id as string);
        }
      } else if (isPausedOrEnded) {
        // Stop tracking time
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    },
    [album.id]
  );

  return (
    <>
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
      />
      <iframe
        id={`player-${album.videoId}`}
        key={album.videoId}
        width={"100%"}
        height={"100%"}
        className="absolute top-0 left-0"
        src={`https://www.youtube.com/embed/${album.videoId}?enablejsapi=1`}
        title={album.name}
        // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </>
  );
};
