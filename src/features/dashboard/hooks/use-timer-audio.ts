import { useCallback, type MutableRefObject } from "react";
export function useTimerAudio(audioContextRef: MutableRefObject<AudioContext | null>) {
  const ensureAudioContext = useCallback(async () => {
    if (typeof window === "undefined") return null;
    const AudioCtor =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtor) return null;
    if (!audioContextRef.current) audioContextRef.current = new AudioCtor();
    if (audioContextRef.current.state === "suspended")
      await audioContextRef.current.resume();
    return audioContextRef.current;
  }, [audioContextRef]);
  const playTimerSound = useCallback(
    async (variant: "transition" | "complete") => {
      const audioContext = await ensureAudioContext();
      if (!audioContext) return;
      const notes =
        variant === "complete"
          ? [
              { frequency: 880, duration: 0.11, offset: 0 },
              { frequency: 1046, duration: 0.13, offset: 0.18 },
              { frequency: 1318, duration: 0.18, offset: 0.4 },
            ]
          : [
              { frequency: 880, duration: 0.1, offset: 0 },
              { frequency: 660, duration: 0.12, offset: 0.16 },
            ];
      const startAt = audioContext.currentTime + 0.02;
      notes.forEach((note) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(note.frequency, startAt + note.offset);
        gainNode.gain.setValueAtTime(0.0001, startAt + note.offset);
        gainNode.gain.exponentialRampToValueAtTime(0.18, startAt + note.offset + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(
          0.0001,
          startAt + note.offset + note.duration,
        );
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(startAt + note.offset);
        oscillator.stop(startAt + note.offset + note.duration + 0.02);
      });
    },
    [ensureAudioContext],
  );
  return { ensureAudioContext, playTimerSound };
}
