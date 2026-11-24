import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import type { PodcastEpisode } from "../audio/transcript";
import { narrationProvider, type NarrationProvider } from "../audio/provider";

export function usePodcast(provider: NarrationProvider = narrationProvider) {
  const player = useAudioPlayer(null, { updateInterval: 500 });
  const status = useAudioPlayerStatus(player);
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [playing, setPlaying] = useState(false),
    [loading, setLoading] = useState(false);
  const [rate, setRate] = useState(1),
    [error, setError] = useState("");
  const [part, setPart] = useState(0),
    [partCount, setPartCount] = useState(0);
  const current = useRef<PodcastEpisode | null>(null),
    urls = useRef<string[]>([]);
  const position = useRef(0),
    speed = useRef(1),
    generation = useRef(0);
  const controller = useRef<AbortController | null>(null),
    ready = useRef(false),
    active = useRef(false);
  const finished = useRef(false),
    restart = useRef(false);
  function cancel() {
    generation.current++;
    active.current = false;
    controller.current?.abort();
    controller.current = null;
    player.pause();
    setLoading(false);
    setPlaying(false);
    return generation.current;
  }
  useEffect(
    () => () => {
      generation.current++;
      controller.current?.abort();
    },
    [],
  );
  useEffect(() => {
    const s = AppState.addEventListener("change", (state) => {
      if (state !== "active") cancel();
    });
    return () => s.remove();
  }, [player]);
  function openPart(at: number) {
    position.current = at;
    setPart(at);
    restart.current = false;
    player.replace({ uri: urls.current[at] });
    player.setPlaybackRate(speed.current);
    player.play();
  }
  useEffect(() => {
    if (!ready.current) return;
    setPlaying(status.playing);
    if (status.playbackState === "error") {
      ready.current = false;
      active.current = false;
      setLoading(false);
      setError("Không phát được âm thanh. Hãy thử lại.");
    }
    if (!status.didJustFinish) finished.current = false;
    if (status.didJustFinish && !finished.current && active.current) {
      finished.current = true;
      if (position.current + 1 < urls.current.length)
        openPart(position.current + 1);
      else {
        active.current = false;
        restart.current = true;
        setPlaying(false);
      }
    }
  }, [status.playing, status.playbackState, status.didJustFinish]);
  async function load(e: PodcastEpisode) {
    const token = cancel();
    ready.current = false;
    urls.current = [];
    player.replace(null);
    current.current = e;
    setEpisode(e);
    setPart(0);
    setPartCount(0);
    setError("");
    setLoading(true);
    const c = new AbortController();
    controller.current = c;
    const timer = setTimeout(() => c.abort(), 180000);
    try {
      const asset = await provider.create(e, c.signal);
      if (token !== generation.current) return;
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: false,
      });
      if (token !== generation.current) return;
      urls.current = asset.urls;
      setPartCount(asset.urls.length);
      ready.current = true;
      active.current = true;
      openPart(0);
    } catch (err) {
      if (token === generation.current) {
        ready.current = false;
        active.current = false;
        setError(
          c.signal.aborted
            ? "Chuẩn bị bài giảng quá lâu. Hãy thử lại."
            : err instanceof Error
              ? err.message
              : "Chưa tạo được giọng đọc.",
        );
      }
    } finally {
      clearTimeout(timer);
      if (token === generation.current) {
        controller.current = null;
        setLoading(false);
      }
    }
  }
  async function resume() {
    if (!current.current) return;
    if (!ready.current) {
      await load(current.current);
      return;
    }
    const token = cancel();
    setError("");
    active.current = true;
    try {
      if (restart.current) openPart(0);
      else if (token === generation.current) player.play();
    } catch {
      active.current = false;
      setError("Không phát được âm thanh. Hãy thử lại.");
    }
  }
  async function pause() {
    cancel();
  }
  async function stop() {
    cancel();
    ready.current = false;
    current.current = null;
    urls.current = [];
    setEpisode(null);
    setError("");
    setPartCount(0);
    player.replace(null);
  }
  async function changeRate(value: number) {
    speed.current = value;
    setRate(value);
    if (ready.current) player.setPlaybackRate(value);
  }
  async function jump(delta: number) {
    if (!ready.current || !status.isLoaded) return;
    try {
      await player.seekTo(
        Math.max(0, Math.min(status.duration, status.currentTime + delta * 15)),
      );
    } catch {
      setError("Không chuyển được vị trí nghe. Hãy thử lại.");
    }
  }
  return {
    episode,
    playing,
    loading,
    rate,
    error,
    status,
    part,
    partCount,
    load,
    pause,
    resume,
    changeRate,
    jump,
    stop,
  };
}
export type PodcastController = ReturnType<typeof usePodcast>;
