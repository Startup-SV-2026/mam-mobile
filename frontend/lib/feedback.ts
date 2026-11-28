import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

export type HapticType =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error";

/**
 * Triggers subtle haptic feedback across native (iOS/Android) and web.
 */
export function triggerHaptic(type: HapticType = "light"): void {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
        if (type === "success") {
          navigator.vibrate([15, 60, 25]);
        } else if (type === "warning" || type === "error") {
          navigator.vibrate([30, 80, 40]);
        } else if (type === "medium" || type === "heavy") {
          navigator.vibrate(20);
        } else {
          navigator.vibrate(10);
        }
      }
      return;
    }

    if (type === "selection") {
      void Haptics.selectionAsync();
    } else if (type === "success") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (type === "warning") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else if (type === "error") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (type === "medium") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (type === "heavy") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch {
    // Graceful fallback on devices without vibration support
  }
}

// Lightweight Web Audio API synthesizer for zero-latency acoustic feedback on web
let webAudioCtx: any = null;

export function playSound(type: "tap" | "success" | "reveal" | "flip" = "tap"): void {
  try {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    const AudioCtxClass =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext })?.webkitAudioContext;
    if (!AudioCtxClass) return;

    if (!webAudioCtx) {
      webAudioCtx = new AudioCtxClass();
    }
    if (webAudioCtx.state === "suspended") {
      void webAudioCtx.resume();
    }

    const now = webAudioCtx.currentTime;

    if (type === "success") {
      // Pleasant dual harmonic chime: C6 (1046.5Hz) -> E6 (1318.5Hz)
      const osc1 = webAudioCtx.createOscillator();
      const osc2 = webAudioCtx.createOscillator();
      const gain = webAudioCtx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      osc1.frequency.setValueAtTime(1046.5, now);
      osc1.frequency.exponentialRampToValueAtTime(1318.5, now + 0.12);

      osc2.frequency.setValueAtTime(523.25, now);
      osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(webAudioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } else if (type === "reveal" || type === "flip") {
      // Warm resonant pop: 340Hz -> 580Hz
      const osc = webAudioCtx.createOscillator();
      const gain = webAudioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(webAudioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } else {
      // Subtle tactile click
      const osc = webAudioCtx.createOscillator();
      const gain = webAudioCtx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(webAudioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Autoplay restrictions or unavailable audio device
  }
}
