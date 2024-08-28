"use client";

import { Album } from "./cc";
import Script from "next/script";

export const YoutubePlayer = ({ album }: { album: Album }) => {
  return (
    <>
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
      />
      <iframe
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
