# Our Journey

A jeepney travels along a road through 12 months of memories. Drag the
timeline (or tap a stop) to move it — the floating photo above it changes
per month, and reaching August unlocks a letter.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually `http://localhost:5173`).

## Where to customize

- **`src/data/memories.ts`** — the 12 months: title, description, and the
  placeholder accent color for each. This is the only file you need to
  touch to change the content.
- **`src/components/MemoryCard.tsx`** — swap the placeholder `<div>`
  (labeled "photo") for a real `<img src="..." />` once you have photos.
  Drop image files in `public/` and reference them as `/your-photo.jpg`.
- **`src/components/LetterReveal.tsx`** — replace the placeholder letter
  text and sign-off with your own.
- **`tailwind.config.ts`** — the peacock-blue palette lives under
  `theme.extend.colors.peacock`. Adjust the hex values if you want a
  different mood.

## How the movement works

- `Timeline.tsx` tracks a raw drag value (0–11) that follows your pointer
  1:1 — no lag on the handle itself.
- `useSmoothPosition.ts` is a small hook that makes the jeepney *chase*
  that value with a capped speed per frame, so it always trails slightly
  behind instead of teleporting.
- The gap between the raw value and the jeepney's smoothed position
  (`velocity` in `App.tsx`) drives the jeepney's tilt and the string's
  sway — both settle back to neutral once movement stops.
- Releasing the drag snaps the raw value to the nearest month; the
  jeepney's smoothing then eases it into that exact stop.

## Stack

React + TypeScript + Vite + Tailwind CSS. No animation library — all
motion is CSS transitions/keyframes plus one `requestAnimationFrame` loop
in `useSmoothPosition`.
