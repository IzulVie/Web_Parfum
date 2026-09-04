import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { perfumes } from "../data/perfumes";

/**
 * Layer 4 (z-40): Hero Product Image (The perfume bottle)
 * Pure GSAP Controlled Transitions:
 * - Old bottle drops down completely out of frame.
 * - Image src is swapped directly in onComplete when bottle is 100% invisible off-screen.
 * - New bottle rises up from the bottom with elastic bounce 'back.out(1.2)'.
 * - Zero React state reconciliation lag, 100% synchronous with active variant.
 */
const HeroProduct = ({ currentPerfume, mousePos }) => {
  const bottleWrapperRef = useRef(null);
  const bottleImgRef = useRef(null);
  const shadowRef = useRef(null);
  const activePerfumeRef = useRef(perfumes[0]);
  const isFirstRender = useRef(true);

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
      gsap.fromTo(
        bottleImgRef.current,
        { y: 70, scale: 0.9, opacity: 0 },
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

    if (currentPerfume.id === activePerfumeRef.current.id) return;

    const nextPerfume = currentPerfume;
    activePerfumeRef.current = nextPerfume;

    const tl = gsap.timeline();

    // 1. Drop the OLD bottle down out of frame (still showing previous image!)
    tl.to(bottleImgRef.current, {
      y: 340,
      scale: 0.8,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        // Swap image asset directly on DOM while bottle is completely off-screen
        if (bottleImgRef.current) {
          bottleImgRef.current.src = nextPerfume.image;
          bottleImgRef.current.alt = `VIE ${nextPerfume.name} Luxury Perfume Bottle`;
          bottleImgRef.current.style.filter =
            nextPerfume.theme === "light"
              ? "drop-shadow(0 14px 22px rgba(0,0,0,0.14)) drop-shadow(0 28px 40px rgba(0,0,0,0.06))"
              : "drop-shadow(0 20px 30px rgba(0,0,0,0.5)) drop-shadow(0 40px 60px rgba(0,0,0,0.3))";
        }
        if (shadowRef.current) {
          shadowRef.current.style.background =
            nextPerfume.theme === "light"
              ? "radial-gradient(ellipse at center, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.06) 55%, transparent 75%)"
              : "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 55%, transparent 75%)";
        }
      },
    });

    // Floor shadow contracts during drop
    tl.to(
      shadowRef.current,
      {
        scaleX: 0.35,
        opacity: 0.1,
        duration: 0.32,
        ease: "power2.in",
      },
      0
    );

    // 2. Rise the NEW bottle up from bottom into center with elastic bounce
    tl.fromTo(
      bottleImgRef.current,
      { y: 340, scale: 0.8, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.85,
        ease: "back.out(1.2)",
      }
    );

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

  // Mouse & Touch Parallax effect: Shift in REVERSE direction with 3D tilt
  useEffect(() => {
    if (!bottleWrapperRef.current) return;

    const shiftX = -mousePos.x * 20; // Reverse X
    const shiftY = -mousePos.y * 14; // Reverse Y
    const tiltY = -mousePos.x * 6;   // 3D Y-axis tilt
    const tiltX = mousePos.y * 5;    // 3D X-axis tilt

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
        className="relative flex flex-col items-center justify-center transform-style-3d will-change-transform -translate-y-2 sm:-translate-y-1 md:translate-y-0"
      >
        <img
          ref={bottleImgRef}
          src={perfumes[0].image}
          alt={`VIE ${perfumes[0].name} Luxury Perfume Bottle`}
          className="h-auto w-[46vw] sm:w-[36vw] md:w-[26vw] lg:w-[21vw] max-w-[210px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[380px] max-h-[44vh] sm:max-h-[52vh] md:max-h-[60vh] lg:max-h-[64vh] object-contain cursor-pointer pointer-events-auto transition-all duration-300 select-none"
          style={{
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5)) drop-shadow(0 40px 60px rgba(0,0,0,0.3))",
          }}
        />

        {/* Photorealistic Studio Floor Contact Shadow grounded at the bottle base */}
        <div
          ref={shadowRef}
          className="absolute bottom-[4.5%] sm:bottom-[5.5%] left-1/2 -translate-x-1/2 w-[48%] h-4 sm:h-6 rounded-full pointer-events-none transition-colors duration-700"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 55%, transparent 75%)",
            filter: "blur(5px)",
          }}
        />
      </div>
    </div>
  );
};

export default HeroProduct;
