import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Layer 2 (z-20): Oversized typography (using the `name` property).
 * Centered, extremely large (21vw), bold, tracking-widest, acting as a watermark.
 * Animation:
 * 1. Old text slides out in direction of slide and fades out.
 * 2. Only after old text is off-screen/invisible, text content swaps to new perfume.
 * 3. New text slides in from opposite direction into center.
 */
const OversizedText = ({ currentPerfume, direction }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const isFirstRender = useRef(true);

  const [displayedText, setDisplayedText] = useState(currentPerfume);

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

    if (currentPerfume.id === displayedText.id) return;

    const slideDistance = 160;
    const exitX = direction > 0 ? -slideDistance : slideDistance;
    const enterX = direction > 0 ? slideDistance : -slideDistance;

    const tl = gsap.timeline();

    // 1. Old text slides out and fades
    tl.to(textRef.current, {
      x: exitX,
      opacity: 0,
      scale: 0.92,
      duration: 0.38,
      ease: "power2.in",
    });

    // Swap text when completely invisible
    tl.add(() => {
      if (textRef.current) {
        textRef.current.textContent = currentPerfume.name;
        textRef.current.style.color = currentPerfume.textHex;
      }
      setDisplayedText(currentPerfume);
      gsap.set(textRef.current, { x: enterX, opacity: 0, scale: 1.05 });
    });

    // 2. New text slides in from opposite direction
    tl.to(textRef.current, {
      x: 0,
      opacity: 0.85,
      scale: 1,
      duration: 0.85,
      ease: "power3.out",
    });

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
        className="font-cinzel text-[21vw] font-black tracking-[0.25em] leading-none uppercase text-center m-0 p-0"
        style={{
          color: displayedText.textHex,
          textShadow: "0 10px 40px rgba(0, 0, 0, 0.25)",
          WebkitTextStroke:
            currentPerfume.theme === "light"
              ? "1px rgba(0,0,0,0.06)"
              : "1px rgba(255,255,255,0.06)",
        }}
      >
        {displayedText.name}
      </h1>
    </div>
  );
};

export default OversizedText;
