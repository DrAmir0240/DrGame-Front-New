declare module "wavesurfer.js" {
  interface WaveSurferOptions {
    container: HTMLElement | string;
    waveColor?: string;
    progressColor?: string;
    barWidth?: number;
    barRadius?: number;
    cursorWidth?: number;
    height?: number;
    url?: string;
    backend?: "WebAudio" | "MediaElement";
    minPxPerSec?: number;
    fillParent?: boolean;
    autoScroll?: boolean;
    autoCenter?: boolean;
    normalize?: boolean;
    partialRender?: boolean;
    dragToSeek?: boolean;
    hideScrollbar?: boolean;
    audioRate?: number;
    interact?: boolean;
  }

  interface WaveSurferEvents {
    ready: [];
    play: [];
    pause: [];
    finish: [];
    timeupdate: [currentTime: number];
    audioprocess: [currentTime: number];
    loading: [percent: number];
    error: [error: string];
  }

  interface WaveSurfer {
    play(): Promise<void>;
    pause(): void;
    playPause(): Promise<void>;
    stop(): void;
    seekTo(progress: number): void;
    setVolume(volume: number): void;
    getVolume(): number;
    setMuted(muted: boolean): void;
    getMuted(): boolean;
    getDuration(): number;
    getCurrentTime(): number;
    setTime(time: number): void;
    destroy(): void;
    on<E extends keyof WaveSurferEvents>(event: E, callback: (...args: WaveSurferEvents[E]) => void): void;
    once<E extends keyof WaveSurferEvents>(event: E, callback: (...args: WaveSurferEvents[E]) => void): void;
    un<E extends keyof WaveSurferEvents>(event: E, callback: (...args: WaveSurferEvents[E]) => void): void;
    unAll(): void;
    load(url: string): void;
    loadBlob(blob: Blob): void;
    exportPCM(length?: number, accuracy?: number, noSelection?: boolean): number[];
    exportImage(format?: string, quality?: number, type?: string): string[];
    getArrayBuffer(): Promise<ArrayBuffer>;
  }

  interface WaveSurferStatic {
    create(options: WaveSurferOptions): WaveSurfer;
  }

  const WaveSurfer: WaveSurferStatic;
  export default WaveSurfer;
}
