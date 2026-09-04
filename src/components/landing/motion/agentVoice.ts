/** Chrome-safe agent voice playback via speechSynthesis. */

export type AgentVoiceHandle = {
  stop: () => void;
};

type SpeakOpts = {
  text: string;
  onStart?: () => void;
  onEnd?: () => void;
};

let resumeTimer: number | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

function clearResumeTimer() {
  if (resumeTimer != null) {
    window.clearInterval(resumeTimer);
    resumeTimer = null;
  }
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find(
      (v) =>
        /en(-|_)?(US|GB|IN)?/i.test(v.lang) &&
        /samantha|karen|moira|zira|google us english|microsoft aria|female/i.test(v.name),
    ) ||
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
    voices[0] ||
    null
  );
}

/** Warm the voices list early (Chrome loads async). */
export function preloadAgentVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    window.speechSynthesis.getVoices();
  }, { once: true });
}

export function stopAgentVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  clearResumeTimer();
  activeUtterance = null;
  window.speechSynthesis.cancel();
}

/**
 * Speak immediately inside a user gesture.
 * Includes Chrome keepalive (pause/resume) so audio doesn't die silently.
 */
export function speakAgentVoice({ text, onStart, onEnd }: SpeakOpts): AgentVoiceHandle {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return { stop: () => {} };
  }

  const synth = window.speechSynthesis;
  clearResumeTimer();
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  activeUtterance = utterance;
  utterance.rate = 1.02;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voice = pickVoice();
  if (voice) utterance.voice = voice;

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearResumeTimer();
    if (activeUtterance === utterance) activeUtterance = null;
    onEnd?.();
  };

  utterance.onstart = () => onStart?.();
  utterance.onend = () => finish();
  utterance.onerror = (e) => {
    // Intentional stop / replace — not a real failure
    if (e.error === "interrupted" || e.error === "canceled") {
      finish();
      return;
    }
    finish();
  };

  // Speak synchronously while we still have the user gesture
  synth.speak(utterance);

  // Chrome often parks utterances paused / dies after ~15s without a nudge
  const resumeIfStuck = () => {
    if (finished || activeUtterance !== utterance) return;
    try {
      if (synth.paused) synth.resume();
    } catch {
      /* ignore */
    }
  };
  const keepalive = () => {
    if (finished || activeUtterance !== utterance) return;
    if (!synth.speaking) return;
    try {
      synth.pause();
      synth.resume();
    } catch {
      /* ignore */
    }
  };

  window.setTimeout(resumeIfStuck, 20);
  window.setTimeout(resumeIfStuck, 150);
  resumeTimer = window.setInterval(keepalive, 9000);

  // If voices weren't ready, re-assign once and nudge
  if (!voice) {
    const onVoices = () => {
      if (finished || activeUtterance !== utterance) return;
      const v = pickVoice();
      if (v) utterance.voice = v;
      resumeIfStuck();
    };
    synth.addEventListener("voiceschanged", onVoices, { once: true });
  }

  return {
    stop: () => {
      finished = true;
      clearResumeTimer();
      if (activeUtterance === utterance) activeUtterance = null;
      synth.cancel();
      onEnd?.();
    },
  };
}
