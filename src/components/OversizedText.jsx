import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { perfumes } from "../data/perfumes";

/**
 * Layer 2 (z-20): Oversized typography (using the `name` property).
 * Pure GSAP Controlled Transitions:
 * - Old text slides out and fades.
 * - Text content and color swapped directly in onComplete when text is off-screen.
 * - New text slides in from opposite direction into center.
 * - Zero state reconciliation lag.
 */
const OversizedText = ({ currentPerfume, direction }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const activePerfumeRef = useRef(perfumes[0]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.fromTo(
        textRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 0.85, scale: 1, duration: 1.2, ease: "power3.out" }
      );
      return;
    }

    if (currentPerfume.id === activePerfumeRef.current.id) return;

    const nextPerfume = currentPerfume;
    activePerfumeRef.current = nextPerfume;

    const slideDistance = window.innerWidth < 640 ? 60 : 120;
    const exitX = direction > 0 ? -slideDistance : slideDistance;
    const enterX = direction > 0 ? slideDistance : -slideDistance;

    const tl = gsap.timeline();

    // 1. Old text slides out and fades
    tl.to(textRef.current, {
      x: exitX,
      opacity: 0,
      scale: 0.94,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        if (textRef.current) {
          textRef.current.textContent = nextPerfume.name;
          textRef.current.style.color = nextPerfume.textHex;
          textRef.current.style.webkitTextStroke =
            nextPerfume.theme === "light"
              ? "1px rgba(0,0,0,0.06)"
              : "1px rgba(255,255,255,0.06)";
        }
      },
    });

    // 2. New text slides in from opposite direction
    tl.fromTo(
      textRef.current,
      { x: enterX, opacity: 0, scale: 1.04 },
      {
        x: 0,
        opacity: 0.85,
        scale: 1,
        duration: 0.58,
        ease: "power3.out",
      }
    );

    return () => {
      tl.kill();
    };
  }, [currentPerfume, direction]);

  return (
    <div
      ref={containerRef}
      id="oversized-text-layer"
      className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none overflow-hidden"
    >
      <h1
        ref={textRef}
        className="font-cinzel text-[22vw] sm:text-[22vw] md:text-[21vw] font-black tracking-[0.2em] sm:tracking-[0.25em] leading-none uppercase text-center m-0 p-0 will-change-transform"
        style={{
          color: perfumes[0].textHex,
          textShadow: "0 10px 40px rgba(0, 0, 0, 0.25)",
          WebkitTextStroke: "1px rgba(255,255,255,0.06)",
          transform: "translate3d(0,0,0)",
        }}
      >
        {perfumes[0].name}
      </h1>
    </div>
  );
};

export default OversizedText;
