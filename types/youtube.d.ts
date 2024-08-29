declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }

  var YT: {
    Player: new (elementId: string, options: YT.PlayerOptions) => YT.Player;
    PlayerState: {
      UNSTARTED: -1;
      ENDED: 0;
      PLAYING: 1;
      PAUSED: 2;
      BUFFERING: 3;
      CUED: 5;
    };
    [key: string]: any;
  };
}

declare namespace YT {
  // interface Player {
  //   getCurrentTime(): number;
  //   getDuration(): number;
  //   // Other methods as needed
  // }

  interface PlayerOptions {
    height?: string;
    width?: string;
    videoId?: string;
    playerVars?: PlayerVars;
    events?: Events;
  }

  interface PlayerVars {
    autoplay?: number;
    cc_load_policy?: number;
    color?: string;
    controls?: number;
    disablekb?: number;
    enablejsapi?: number;
    end?: number;
    fs?: number;
    hl?: string;
    iv_load_policy?: number;
    list?: string;
    listType?: string;
    loop?: number;
    modestbranding?: number;
    origin?: string;
    playlist?: string;
    playsinline?: number;
    rel?: number;
    showinfo?: number;
    start?: number;
    widget_referrer?: string;
  }

  interface Events {
    onReady?: (event: PlayerEvent) => void;
    onStateChange?: (event: OnStateChangeEvent) => void;
    onPlaybackQualityChange?: (event: PlayerEvent) => void;
    onPlaybackRateChange?: (event: PlayerEvent) => void;
    onError?: (event: PlayerEvent) => void;
    onApiChange?: (event: PlayerEvent) => void;
  }

  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent extends PlayerEvent {
    data: number;
  }

  class Player {
    constructor(elementId: string, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    [key: string]: any;
  }
}

export {};
