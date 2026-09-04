import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";

/**
 * Layer 3 (z-30): Floating Particles
 * Small abstract elements randomly placed around the screen.
 * Moves in the SAME direction as the mouse to create 3D parallax depth.
 */
const FloatingParticles = ({ currentPerfume, mousePos }) => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);

  // Generate 24 luxury abstract particles with varied positions, sizes, and depth factors
  const particlesData = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 17 + 7) % 94}%`,
      top: `${(i * 23 + 11) % 92}%`,
      size: (i % 4) * 4 + 4, // 4px to 16px
      depth: ((i % 5) + 1) * 0.35, // 0.35 to 1.75
      blur: (i % 3) * 2, // 0px to 4px
      opacity: 0.25 + (i % 5) * 0.12,
      duration: 3.5 + (i % 4) * 1.5,
      delay: (i % 6) * 0.4,
    }));
  }, []);

  // Mouse Parallax effect: Shift in SAME direction of mouse
  useEffect(() => {
    if (!particlesRef.current.length) return;

    particlesData.forEach((p, idx) => {
      const el = particlesRef.current[idx];
      if (!el) return;

      const shiftX = mousePos.x * p.depth * 35;
      const shiftY = mousePos.y * p.depth * 35;

      gsap.to(el, {
        x: shiftX,
        y: shiftY,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }, [mousePos, particlesData]);

  // Floating ambient drift animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      particlesRef.current.forEach((el, idx) => {
        if (!el) return;
        const p = particlesData[idx];
        gsap.to(el, {
          y: `+=${(idx % 2 === 0 ? 1 : -1) * (15 + (idx % 10))}`,
          x: `+=${(idx % 3 === 0 ? 1 : -1) * 10}`,
          rotation: 360,
          repeat: -1,
          yoyo: true,
          duration: p.duration,
          delay: p.delay,
          ease: "sine.inOut",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [particlesData]);

  // Choose particle colors based on current perfume
  const particleColor = useMemo(() => {
    switch (currentPerfume.name) {
      case "NOIR":
        return "rgba(212, 175, 55, 0.75)"; // Gold dust
      case "URBAN":
        return "rgba(74, 222, 128, 0.7)"; // Emerald dew
      case "WATER":
        return "rgba(56, 189, 248, 0.75)"; // Sapphire spray
      case "CEDAR":
        return "rgba(100, 116, 139, 0.6)"; // Silver/slate essence
      default:
        return "rgba(255, 255, 255, 0.6)";
    }
  }, [currentPerfume.name]);

  return (
    <div
      ref={containerRef}
      id="floating-particles-layer"
      className="absolute inset-0 z-30 pointer-events-none overflow-hidden"
    >
      {particlesData.map((p, idx) => (
        <div
          key={p.id}
          ref={(el) => (particlesRef.current[idx] = el)}
          className="absolute rounded-full transition-colors duration-1000"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: particleColor,
            boxShadow: `0 0 ${p.size * 2.5}px ${particleColor}`,
            filter: `blur(${p.blur}px)`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
