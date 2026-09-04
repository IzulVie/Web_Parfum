import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Layer 4 (z-40): Hero Product Image (The perfume bottle)
 * Sequential Transition:
 * 1. The OLD bottle (displayedPerfume) scales down slightly and drops vertically down out of frame.
 * 2. ONLY after the bottle is completely out of frame, the image swaps to the new perfume.
 * 3. The NEW bottle rises from bottom into center with elastic bounce 'back.out(1.2)'.
 */
const HeroProduct = ({ currentPerfume, mousePos }) => {
  const bottleWrapperRef = useRef(null);
  const bottleImgRef = useRef(null);
  const shadowRef = useRef(null);
  const isFirstRender = useRef(true);

  // displayedPerfume is locked to the OLD perfume until the bottle is off-screen
  const [displayedPerfume, setDisplayedPerfume] = useState(currentPerfume);

  // Preload all assets
  useEffect(() => {
    ["/assets/noir.png", "/assets/urban.png", "/assets/water.png", "/assets/cedar.png"].forEach(
      (src) => {
        const img = new Image();
        img.src = src;
      }
    );
  }, []);

  // Synchronized GSAP transition on active perfume change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Initial entrance: smooth rise with elastic bounce
      gsap.fromTo(
        bottleImgRef.current,
        { y: 80, scale: 0.9, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.85,
          ease: "back.out(1.2)",
        }
      );
      return;
    }

    if (currentPerfume.id === displayedPerfume.id) return;

    const tl = gsap.timeline();

    // 1. Drop the OLD bottle down out of frame (image is STILL the old bottle!)
    tl.to(bottleImgRef.current, {
      y: 340,
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    });

    // Floor shadow contracts during drop
    tl.to(
      shadowRef.current,
      {
        scaleX: 0.35,
        opacity: 0.1,
        duration: 0.35,
        ease: "power2.in",
      },
      0
    );

    // Swap asset when bottle is fully invisible off-screen
    tl.add(() => {
      if (bottleImgRef.current) {
        bottleImgRef.current.src = currentPerfume.image;
        bottleImgRef.current.alt = `VIE ${currentPerfume.name} Luxury Perfume Bottle`;
      }
      setDisplayedPerfume(currentPerfume);
      gsap.set(bottleImgRef.current, { y: 340, scale: 0.8, opacity: 0 });
    });

    // 2. Rise the NEW bottle up from bottom into center with elastic bounce
    tl.to(bottleImgRef.current, {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.85,
      ease: "back.out(1.2)",
    });

    // Floor shadow expands and grounds the new bottle
    tl.to(
      shadowRef.current,
      {
        scaleX: 1,
        opacity: 1,
        duration: 0.65,
        ease: "power2.out",
      },
      "-=0.6"
    );

    return () => {
      tl.kill();
    };
  }, [currentPerfume]);

  // Mouse Parallax effect: Shift in REVERSE direction of mouse with 3D tilt
  useEffect(() => {
    if (!bottleWrapperRef.current) return;

    const shiftX = -mousePos.x * 22; // Reverse X
    const shiftY = -mousePos.y * 16; // Reverse Y
    const tiltY = -mousePos.x * 6.5; // 3D Y-axis tilt
    const tiltX = mousePos.y * 5.5;  // 3D X-axis tilt

    gsap.to(bottleWrapperRef.current, {
      x: shiftX,
      y: shiftY,
      rotateY: tiltY,
      rotateX: tiltX,
      transformPerspective: 1000,
      duration: 0.7,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [mousePos]);

  return (
    <div
      id="hero-product-layer"
      className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={bottleWrapperRef}
        className="relative flex flex-col items-center justify-center transform-style-3d will-change-transform"
      >
        <img
          ref={bottleImgRef}
          src={displayedPerfume.image}
          alt={`VIE ${displayedPerfume.name} Luxury Perfume Bottle`}
          className="h-auto w-[52vw] sm:w-[38vw] md:w-[28vw] lg:w-[22vw] max-w-[380px] max-h-[64vh] object-contain cursor-pointer pointer-events-auto transition-all duration-300 select-none"
          style={{
            filter:
              currentPerfume.theme === "light"
                ? "drop-shadow(0 18px 28px rgba(0,0,0,0.14)) drop-shadow(0 35px 50px rgba(0,0,0,0.06))"
                : "drop-shadow(0 25px 35px rgba(0,0,0,0.5)) drop-shadow(0 45px 65px rgba(0,0,0,0.3))",
          }}
        />

        {/* Photorealistic Studio Floor Contact Shadow grounded at the bottle base */}
        <div
          ref={shadowRef}
          className="absolute bottom-[5.5%] left-1/2 -translate-x-1/2 w-[46%] h-6 rounded-full pointer-events-none transition-colors duration-700"
          style={{
            background:
              currentPerfume.theme === "light"
                ? "radial-gradient(ellipse at center, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.06) 55%, transparent 75%)"
                : "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 55%, transparent 75%)",
            filter: "blur(6px)",
          }}
        />
      </div>
    </div>
  );
};

export default HeroProduct;
