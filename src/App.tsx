import { useState, useRef, useEffect, PointerEvent } from "react";
import { Jeepney } from "./components/ui/Jeepney";
import { data } from "./data/data";
import { Memory } from "./types/Memory";

export const memories: Memory[] = data.map(([month, title, description, id, note]) => ({
  month,
  title,
  description,
  note,
  image: `./assets/${id}`,
}));

export default function App() {
   const [target, setTarget] = useState(0), [position, setPosition] = useState(0), [cardPosition, setCardPosition] = useState(0), [dragging, setDragging] = useState(false), [letterOpen, setLetterOpen] = useState(false);
   const lastIndex = memories.length - 1;
   const trackRef = useRef<HTMLDivElement>(null), storyRef = useRef<HTMLElement>(null), targetRef = useRef(0), positionRef = useRef(0), cardRef = useRef(0), current = Math.round(position), memory = memories[current], isLetterStop = current > 0 && memory.month.toLowerCase() === "september", progress = lastIndex ? position / lastIndex : 0, cardProgress = lastIndex ? cardPosition / lastIndex : 0;
   useEffect(() => {
      targetRef.current = target;
   }, [target]);
   useEffect(() => {
      let raf = 0;
      const tick = () => {
         const goal = targetRef.current;
         const next = Math.abs(goal - positionRef.current) < 0.002 ? goal : positionRef.current + (goal - positionRef.current) * 0.11;
         positionRef.current = next;
         setPosition(next);
         const trailing = Math.abs(next - cardRef.current) < 0.002 ? next : cardRef.current + (next - cardRef.current) * 0.075;
         cardRef.current = trailing;
         setCardPosition(trailing);
         raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
   }, []);
   useEffect(() => {
      if (!isLetterStop || target !== current || Math.abs(position - current) > 0.02) return;
      const timer = window.setTimeout(() => storyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 2000);
      return () => window.clearTimeout(timer);
   }, [target, position, current, isLetterStop]);
   const fromPointer = (event: PointerEvent<HTMLDivElement>, snap = false) => {
      const r = trackRef.current?.getBoundingClientRect();
      if (!r) return;
      const n = Math.max(0, Math.min(1, (event.clientX - r.left) / r.width)) * lastIndex;
      setTarget(snap ? Math.round(n) : n);
   };
   const start = (e: PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
      fromPointer(e);
   }, end = (e: PointerEvent<HTMLDivElement>) => {
      setDragging(false);
      fromPointer(e, true);
   };
   return (
      <>
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
               <p>{memories.length - 1} memories of us, a lifetime to go.</p>
            </header>
            <div className="motto">♡ &nbsp; Every mile, a memory.</div>
            <section className="scene" aria-label="Memory journey scene">
               <div
                  className="memory-card"
                  key={memory.month}
                  style={{ left: `${5 + cardProgress * 72}%` }}
               >
                  <img src={memory.image} alt="A cherished memory" />
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
            <section className="timeline-wrap">
               <div
                  className="timeline"
                  ref={trackRef}
                  onPointerDown={start}
                  onPointerMove={(e) => dragging && fromPointer(e)}
                  onPointerUp={end}
                  onPointerCancel={end}
                  role="slider"
                  tabIndex={0}
                  aria-label="Memory journey timeline"
                  aria-valuemin={0}
                  aria-valuemax={lastIndex}
                  aria-valuenow={current}
                  onKeyDown={(e) => {
                     if (e.key === "ArrowRight")
                        setTarget((t) => Math.min(lastIndex, Math.round(t) + 1));
                     if (e.key === "ArrowLeft")
                        setTarget((t) => Math.max(0, Math.round(t) - 1));
                  }}
               >
                  <div className="track-base" />
                  <div className="track-fill" style={{ width: `${progress * 100}%` }} />
                  <div className="thumb" style={{ left: `${progress * 100}%` }} />
                  {memories.map((item, i) => (
                     <button
                        key={item.month}
                        className={`stop ${i === current ? "active" : i < current ? "done" : ""}`}
                        style={{ left: `${lastIndex ? (i / lastIndex) * 100 : 0}%` }}
                        onClick={() => setTarget(i)}
                     >
                        <b />
                        <span>{item.month}</span>
                        <small>{item.title}</small>
                     </button>
                  ))}
               </div>
               <p className="drag-hint">
                  ♡ &nbsp; Drag to travel through our memories &nbsp; ♡
               </p>
            </section>
            <section className="story" ref={storyRef}>
               <div className="story-copy">
                  <p className="section-label">{memory.month}</p>
                  <h1>{memory.title}</h1>
                  <p>{memory.description}</p>
               </div>
               <div className="polaroids">
                  {[0, 1, 2].map((n) => (
                     <img
                        key={n}
                        src={`${memory.image}&sig=${n}`}
                        alt="Memory snapshot" />
                  ))}
               </div>
               {isLetterStop && (
                  <div className="end-note">
                     <p>You made it.</p>
                     <em>But this isn't the end.</em>
                     <button onClick={() => setLetterOpen(true)}>Open My Letter</button>
                  </div>
               )}
            </section>
            {letterOpen && (
               <div className="letter-overlay" role="dialog" aria-modal="true">
                  <button className="close" onClick={() => setLetterOpen(false)}>
                     ×
                  </button>
                  <article className="letter">
                     <span>♡</span>
                     <p>To my favorite person baby ko,</p>
                     <p>
                        Thank you for every laugh, every quiet ride, and every beautiful
                        moment that led us here. You are my today, and all of my
                        tomorrows.
                     </p>
                     <p>
                        With all my love,
                        <br />
                        Always yours
                     </p>
                  </article>
               </div>
            )}
            <footer>Thank you for being my today and all of my tomorrows. ♡</footer>
         </main>
         <aside className="rotate-device" role="status" aria-live="polite">
            <span>↻</span>
            <strong>Turn your phone sideways</strong>
            <p>This journey is best experienced in landscape.</p>
         </aside>
      </>
   );
}

