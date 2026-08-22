import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Jeepney } from "./components/ui/Jeepney";
import { data } from "./data/data";
import { galleryByMemoryId } from "./data/gallery";
import { Memory } from "./types/Memory";

const imageUrl = (id: string) => `src/assets/${id}`;
export const memories: Memory[] = data.map(([month, title, description, id, note, letter], index) => ({
  id: index + 1, month, title, description, note, letter, image: imageUrl(id),
  gallery: [...galleryByMemoryId[index + 1]],
}));

export default function App() {
  const [target, setTarget] = useState(0);
  const [position, setPosition] = useState(0);
  const [cardPosition, setCardPosition] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const targetRef = useRef(0),
    positionRef = useRef(0),
    cardRef = useRef(0),
    storyRef = useRef<HTMLElement>(null),
    audioRef = useRef<HTMLAudioElement>(null),
    audioContextRef = useRef<AudioContext | null>(null),
    analyserRef = useRef<AnalyserNode | null>(null),
    animationRef = useRef(0),
    barRefs = useRef<HTMLSpanElement[]>([]);
  const lastIndex = memories.length - 1,
    current = Math.round(position),
    memory = memories[current];
  const progress = lastIndex ? position / lastIndex : 0,
    cardProgress = lastIndex ? cardPosition / lastIndex : 0;
  const year = Math.floor(current / 12) + 1,
    previous = memories[current - 1],
    next = memories[current + 1];
  const isLetterStop =
    current > 0 &&
    memory.month.toLowerCase() === "september" &&
    Boolean(memory.letter);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    targetRef.current = target;
  }, [target]);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const goal = targetRef.current;
      const vehicle =
        reducedMotion || Math.abs(goal - positionRef.current) < 0.002
          ? goal
          : positionRef.current + (goal - positionRef.current) * 0.11;
      positionRef.current = vehicle;
      setPosition(vehicle);
      const card =
        reducedMotion || Math.abs(vehicle - cardRef.current) < 0.002
          ? vehicle
          : cardRef.current + (vehicle - cardRef.current) * 0.075;
      cardRef.current = card;
      setCardPosition(card);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);
  useEffect(() => () => cancelAnimationFrame(animationRef.current), []);

  const setupAudio = () => {
    if (analyserRef.current || !audioRef.current) return analyserRef.current;
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 64;
    const source = context.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(context.destination);
    analyserRef.current = analyser;
    audioContextRef.current = context;
    return analyser;
  };
  const drawVisualizer = () => {
    const analyser = analyserRef.current;
    if (!analyser || !audioRef.current || audioRef.current.paused) return;
    const levels = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(levels);
    barRefs.current.forEach((bar, index) => {
      const level = levels[Math.min(levels.length - 1, index * 2)] / 255;
      bar.style.setProperty("--level", String(Math.max(0.12, level)));
    });
    animationRef.current = requestAnimationFrame(drawVisualizer);
  };
  const startAudio = async () => {
    const audio = audioRef.current;
    const analyser = setupAudio();
    if (!audio || !analyser) return;
    try {
      await audioContextRef.current?.resume();
      await audio.play();
      setIsPlaying(true);
      cancelAnimationFrame(animationRef.current);
      drawVisualizer();
    } catch { setIsPlaying(false); }
  };
  const toggleAudio = () => {
    if (audioRef.current?.paused) void startAudio();
    else { audioRef.current?.pause(); setIsPlaying(false); cancelAnimationFrame(animationRef.current); }
  };
  useEffect(() => {
    void startAudio();
    const unlock = () => void startAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => { window.removeEventListener("pointerdown", unlock); window.removeEventListener("keydown", unlock); };
  }, []);

  const changeRange = (event: ChangeEvent<HTMLInputElement>) =>
    setTarget(Number(event.target.value));
  const finishRange = () => {
    setDragging(false);
    setTarget((value) => Math.round(value));
  };
  const moveBy = (amount: number) =>
    setTarget((value) =>
      Math.max(0, Math.min(lastIndex, Math.round(value) + amount)),
    );
  const openLetterArea = () =>
    storyRef.current?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });

  return (
    <main className={`journey ${isLetterStop ? "journey-complete" : ""}`}>
      <div className="stars" />
      <div className="moon" />
      <div className="mountains mountains-back" />
      <div className="mountains mountains-front" />
      <div className="water" />
      <header>
        <div className="eyebrow">
          Our Journey <span>♡</span>
        </div>
        <p>{memories.length} memories of us, a lifetime to go.</p>
      </header>
      <div className="audio-player" aria-label="Background music player">
        <button onClick={toggleAudio} aria-label={isPlaying ? "Pause background music" : "Play background music"}>{isPlaying ? "Ⅱ" : "▶"}</button>
        <div className="visualizer" aria-hidden="true">{Array.from({ length: 16 }, (_, index) => <span key={index} ref={element => { if (element) barRefs.current[index] = element; }} />)}</div>
        <span className="audio-label">{isPlaying ? "Now playing" : "Tap to play"}</span>
        <audio ref={audioRef} loop preload="auto" src={encodeURI("/Reynard Silva  The way I still love you (Eng  Mmsub) lyrics video.mp3")} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
      </div>
      <div className="motto">♡ &nbsp; Every mile, a memory.</div>
      <section className="scene" aria-label="Memory journey scene">
        <div
          className="memory-card"
          key={memory.month + current}
          style={{ left: `${5 + cardProgress * 72}%` }}
        >
          <img
            src={memory.image}
            alt={memory.title}
            onError={(event) =>
              event.currentTarget.classList.add("image-fallback")
            }
          />
          <div className="memory-copy">
            <strong>{memory.month}</strong>
            <span>{memory.title}</span>
            <small>{memory.note}</small>
          </div>
          <i>♥</i>
        </div>
        <div
          className={`jeepney ${dragging ? "driving" : ""}`}
          style={{ left: `${14 + progress * 72}%` }}
        >
          <Jeepney />
        </div>
        <div className="road">
          <span />
          <span />
          <span />
        </div>
      </section>
      <section className="timeline-wrap" aria-label="Journey controls">
        <div className="timeline-heading">
          <span>Journey {year}</span>
          <strong>
            {current + 1} / {memories.length}
          </strong>
        </div>
        <div className="range-status">
          <button
            onClick={() => moveBy(-1)}
            disabled={current === 0}
            aria-label="Previous memory"
          >
            ‹
          </button>
          <div>
            <small>{previous ? previous.month : "Start"}</small>
            <strong>
              {memory.month} · {memory.title}
            </strong>
            <small>{next ? next.month : "End"}</small>
          </div>
          <button
            onClick={() => moveBy(1)}
            disabled={current === lastIndex}
            aria-label="Next memory"
          >
            ›
          </button>
        </div>
        <div className="range-control">
          <div className="range-fill" style={{ width: `${progress * 100}%` }} />
          <div className="range-ticks" aria-hidden="true">
            {memories.map((item, index) => (
              <span
                key={`${item.month}-${index}`}
                className={
                  index === current ? "active" : index < current ? "done" : ""
                }
                style={{
                  left: `${lastIndex ? (index / lastIndex) * 100 : 0}%`,
                }}
              />
            ))}
          </div>
          <input
            type="range"
            min="0"
            max={lastIndex}
            step="0.01"
            value={target}
            onChange={changeRange}
            onPointerDown={() => setDragging(true)}
            onPointerUp={finishRange}
            onTouchEnd={finishRange}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                event.preventDefault();
                moveBy(1);
              }
              if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                event.preventDefault();
                moveBy(-1);
              }
            }}
            aria-label="Travel through memories"
            aria-valuetext={`${memory.month}, ${memory.title}`}
          />
        </div>
        <p className="drag-hint">
          ♡ &nbsp; Drag the pearl to travel through our memories &nbsp; ♡
        </p>
        {isLetterStop && (
          <button className="continue-letter" onClick={openLetterArea}>
            A letter awaits ↓
          </button>
        )}
      </section>
      <section className="story" ref={storyRef}>
        <div className="story-copy">
          <p className="section-label">{memory.month}</p>
          <h1>{memory.title}</h1>
          <p>{memory.description}</p>
        </div>
        <div className="polaroids" aria-label="Memory photo gallery">
          {memory.gallery.map((image, n) => (
            <img
              key={image}
              src={image}
              alt={`${memory.title} memory ${n + 1}`}
            />
          ))}
        </div>
        {isLetterStop && (
          <div className="end-note">
            <p>A new chapter begins.</p>
            <em>There is always more of us ahead.</em>
            <button onClick={() => setLetterOpen(true)}>Open My Letter</button>
          </div>
        )}
      </section>
      {letterOpen && (
        <div
          className="letter-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Personal letter"
        >
          <button
            className="close"
            onClick={() => setLetterOpen(false)}
            aria-label="Close letter"
          >
            ×
          </button>
          <article className="letter">
            <span>♡</span>
            {(memory.letter ?? "").split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph || "\u00a0"}</p>
            ))}
          </article>
        </div>
      )}
      <footer>Thank you for being my today and all of my tomorrows. ♡</footer>
    </main>
  );
}
