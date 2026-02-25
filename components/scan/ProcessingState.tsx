"use client";

import { useState, useEffect } from "react";

const LINES = [
  "Reading your shelf…",
  "Tracing thematic through-lines…",
  "Mapping cross-media affinities…",
  "Identifying tonal signatures…",
  "Surfacing hidden connections…",
  "Assembling your profile…",
];

const LINE_HEIGHT = 48; // px — matches the rendered line height
const TICK_INTERVAL = 2200; // ms between advances
const TRANSITION_DURATION = 600; // ms for the slide

export function ProcessingState() {
  // Index of the line currently in the center (featured) position
  const [centerIndex, setCenterIndex] = useState(0);
  // Whether the upward slide transition is active
  const [sliding, setSliding] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setSliding(true);
      setTimeout(() => {
        setCenterIndex((prev) => (prev + 1) % LINES.length);
        setSliding(false);
      }, TRANSITION_DURATION);
    }, TICK_INTERVAL);

    return () => clearInterval(id);
  }, []);

  const n = LINES.length;

  // The 4 lines rendered at any time (bottom-to-top order by slot position):
  // slot 3 (off-screen below, incoming): centerIndex + 2
  // slot 2 (bottom, dim):                centerIndex + 1
  // slot 1 (center, normal):             centerIndex
  // slot 0 (top, dim):                   centerIndex - 1
  const slots = [
    { line: LINES[(centerIndex - 1 + n) % n], slotIndex: 0 }, // top
    { line: LINES[centerIndex],               slotIndex: 1 }, // center
    { line: LINES[(centerIndex + 1) % n],     slotIndex: 2 }, // bottom
    { line: LINES[(centerIndex + 2) % n],     slotIndex: 3 }, // incoming (off-screen below)
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      {/* Clip window — shows exactly 3 line slots */}
      <div
        className="relative overflow-hidden"
        style={{ height: LINE_HEIGHT * 3, width: "100%", maxWidth: "24rem" }}
      >
        {slots.map(({ line, slotIndex }) => {
          const translateY = sliding
            ? (slotIndex - 1) * LINE_HEIGHT - LINE_HEIGHT
            : (slotIndex - 1) * LINE_HEIGHT;

          // When not sliding: center (slot 1) is full opacity, all others dim.
          // When sliding: slot 2 brightens (it's entering center), slot 1 dims
          // (it's leaving center), others stay dim. After the snap reset,
          // the new slot 1 will already be at full opacity — no visible jump.
          const opacity = sliding
            ? slotIndex === 2 ? 1 : 0.3
            : slotIndex === 1 ? 1 : 0.3;

          return (
            <div
              key={line}
              className="absolute inset-x-0 flex items-center justify-center text-center"
              style={{
                height: LINE_HEIGHT,
                top: LINE_HEIGHT, // anchor to center row baseline
                transform: `translateY(${translateY}px)`,
                transition: sliding
                  ? `transform ${TRANSITION_DURATION}ms ease-in-out, opacity ${TRANSITION_DURATION}ms ease-in-out`
                  : "none",
                opacity,
              }}
            >
              <p className="font-body text-charcoal text-lg leading-none">
                {line}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
