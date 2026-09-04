import React, { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Layer 1 (z-10): Background div spanning full screen.
 * Morphs background color smoothly to the active perfume's bgHex.
 */
const Background = ({ currentPerfume }) => {
  const bgRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    if (!bgRef.current) return;

    // Morph the main background color smoothly
    gsap.to(bgRef.current, {
      backgroundColor: currentPerfume.bgHex,
      duration: 1.2,
      ease: "power2.inOut",
    });

    // Subtly adapt the radial ambient spotlight
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: currentPerfume.theme === "light" ? 0.4 : 0.6,
        duration: 1.2,
        ease: "power2.inOut",
      });
    }
  }, [currentPerfume]);

  return (
    <div
      ref={bgRef}
      id="bg-layer"
      className="absolute inset-0 w-full h-full z-10 overflow-hidden transition-colors pointer-events-none"
      style={{ backgroundColor: currentPerfume.bgHex }}
    >
      {/* Ambient radial glow for depth and luxury atmosphere */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 48%, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0.75) 100%)`,
        }}
      />

      {/* Subtle luxury vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 160px rgba(0, 0, 0, 0.4)",
        }}
      />
    </div>
  );
};

export default Background;
