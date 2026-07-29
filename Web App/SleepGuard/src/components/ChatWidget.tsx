import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; text: string };

const WELCOME =
  "Hi, I'm your SleepGuard assistant. Ask me about your sleep numbers, connecting Fitbit, or setting up caregiver alerts.";

const QA: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["ahi", "apnea-hypopnea", "breathing pause"],
    answer:
      "AHI stands for Apnea-Hypopnea Index — it's how many times per hour your breathing pauses. Under 5 is normal, 5-15 is mild, 15-30 is moderate, and above 30 is severe. You can see last night's AHI at the top of the Sleep tab.",
  },
  {
    keywords: ["spo2", "oxygen", "blood oxygen"],
    answer:
      "SpO2 is your blood oxygen level. Healthy sleepers usually stay above 95%. The Sleep tab shows your overnight chart, and any dip below 90% is highlighted in red.",
  },
  {
    keywords: ["fitbit", "connect device", "pair"],
    answer:
      "To connect your Fitbit, go to the Settings tab and tap Connect next to Fitbit. Once connected, your heart rate, oxygen, breathing, and sleep stages sync automatically overnight.",
  },
  {
    keywords: ["caregiver", "caretaker", "emergency", "family"],
    answer:
      "In Settings, under Caregiver, you can add a name and phone number, choose how often they get text updates, and turn on Emergency call so they're contacted automatically during a severe event.",
  },
  {
    keywords: ["severity", "severe", "moderate", "mild"],
    answer:
      "Severity is based on your AHI: none (under 5), mild (5-15), moderate (15-30), or severe (above 30). You'll see a colored banner on the Sleep and Treatment tabs showing last night's level.",
  },
  {
    keywords: ["doctor", "specialist", "call", "clinic"],
    answer:
      "The Treatment tab has a 'Talk to a Specialist' section — tap any doctor's card to call them directly from your phone.",
  },
  {
    keywords: ["start", "monitor", "tonight", "begin"],
    answer:
      "On the Sleep tab, tap the green 'Start Tonight's Monitoring' button before bed. Tap it again anytime to stop.",
  },
  {
    keywords: ["what is sleep apnea", "sleep apnea", "apnea"],
    answer:
      "Sleep apnea is when breathing repeatedly stops and starts during sleep, often because the airway becomes blocked. It's common in older adults and can affect heart health, energy, and memory if untreated.",
  },
  {
    keywords: ["hello", "hi", "hey"],
    answer: "Hello! I can help explain your sleep numbers or show you how to use the app. What would you like to know?",
  },
];

function getBotReply(input: string): string {
  const text = input.toLowerCase();
  for (const entry of QA) {
    if (entry.keywords.some((k) => text.includes(k))) {
      return entry.answer;
    }
  }
  return "I'm not sure about that one. Try asking about your AHI score, oxygen levels, connecting Fitbit, caregiver alerts, or how to start monitoring.";
}

// Minimal shape for the Web Speech API, which isn't in default TS lib types.
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition(): SpeechRecognitionLike | null {
  const Ctor =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Ctor) return null;
  return new Ctor();
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: WELCOME }]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const voiceSupported = typeof window !== "undefined" &&
    Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const speak = (text: string) => {
    if (!speakEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = getBotReply(trimmed);
    setMessages((prev) => [...prev, { role: "user", text: trimmed }, { role: "assistant", text: reply }]);
    setInput("");
    speak(reply);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = getSpeechRecognition();
    if (!recognition) return;
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      if (transcript) sendMessage(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <>
      {/* Floating action button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open sleep assistant chat"
          className="absolute bottom-24 right-4 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-apneaGreen text-white shadow-lg"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
            <path
              d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z"
              fill="white"
            />
          </svg>
        </button>
      )}

      {/* Chat popup */}
      {isOpen && (
        <div
          className="absolute bottom-24 right-4 z-40 flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5"
          style={{ width: 320, height: 420 }}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <p className="text-base font-semibold text-slate-900">Sleep Assistant</p>
              <p className="text-sm text-slate-500">Ask about your sleep or the app</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSpeakEnabled((v) => !v)}
                aria-pressed={speakEnabled}
                aria-label={speakEnabled ? "Mute spoken responses" : "Enable spoken responses"}
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm ${
                  speakEnabled ? "bg-apneaGreen/10 text-apneaGreen" : "bg-slate-100 text-slate-400"
                }`}
              >
                {speakEnabled ? "🔊" : "🔇"}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3">
            <div className="flex flex-col gap-2.5">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug ${
                    m.role === "assistant"
                      ? "self-start bg-slate-100 text-slate-900"
                      : "self-end bg-apneaGreen text-white"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              <div ref={listEndRef} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-t border-slate-200 px-3 py-2.5">
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleListening}
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
                aria-pressed={isListening}
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm ${
                  isListening ? "bg-apneaRed text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                🎤
              </button>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage(input);
              }}
              placeholder="Type a question…"
              className="min-h-[40px] flex-1 rounded-xl border border-slate-300 px-3 text-sm text-slate-900 focus:border-apneaGreen focus:outline-none"
            />
            <button
              type="button"
              onClick={() => sendMessage(input)}
              aria-label="Send message"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-apneaGreen text-white"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
