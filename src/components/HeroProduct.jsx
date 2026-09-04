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

  // Preload and pre-decode all assets for instant switching
  useEffect(() => {
    perfumes.forEach((p) => {
      const img = new Image();
      img.src = p.image;
      if (img.decode) {
        img.decode().catch(() => {});
      }
    });
  }, []);

  // Synchronized GSAP transition on active perfume change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.fromTo(
        bottleImgRef.current,
        { y: 50, scale: 0.94, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
        }
      );
      return;
    }

    if (currentPerfume.id === activePerfumeRef.current.id) return;

    const nextPerfume = currentPerfume;
    activePerfumeRef.current = nextPerfume;

    const tl = gsap.timeline();
    const travelDistance = window.innerHeight < 700 ? 75 : 110;

    // 1. Smoothly glide the old bottle down with opacity fade
    tl.to(bottleImgRef.current, {
      y: travelDistance,
      scale: 0.94,
      opacity: 0,
      duration: 0.32,
      ease: "power2.inOut",
      onComplete: () => {
        // Swap image asset directly on DOM while bottle is completely transparent
        if (bottleImgRef.current) {
          bottleImgRef.current.src = nextPerfume.image;
          bottleImgRef.current.alt = `VIE ${nextPerfume.name} Luxury Perfume Bottle`;
        }
        if (shadowRef.current) {
          shadowRef.current.style.background =
            nextPerfume.theme === "light"
              ? "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 55%, transparent 75%)"
              : "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.22) 55%, transparent 75%)";
        }
      },
    });

    // Floor shadow contracts during drop
    tl.to(
      shadowRef.current,
      {
        scaleX: 0.4,
        opacity: 0.15,
        duration: 0.3,
        ease: "power2.inOut",
      },
      0
    );

    // 2. Rise the NEW bottle smoothly into center with luxury deceleration
    tl.fromTo(
      bottleImgRef.current,
      { y: travelDistance, scale: 0.94, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.56,
        ease: "power3.out",
      }
    );

    // Floor shadow expands and grounds the new bottle
    tl.to(
      shadowRef.current,
      {
        scaleX: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.45"
    );

    return () => {
      tl.kill();
    };
  }, [currentPerfume]);

  // Mouse Parallax effect: Shift in REVERSE direction with 3D tilt (Desktop fine pointers only)
  useEffect(() => {
    if (!bottleWrapperRef.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const shiftX = -mousePos.x * 18; // Reverse X
    const shiftY = -mousePos.y * 12; // Reverse Y
    const tiltY = -mousePos.x * 5;   // 3D Y-axis tilt
    const tiltX = mousePos.y * 4;    // 3D X-axis tilt

    gsap.to(bottleWrapperRef.current, {
      x: shiftX,
      y: shiftY,
      rotateY: tiltY,
      rotateX: tiltX,
      transformPerspective: 1000,
      duration: 0.6,
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
        className="relative flex flex-col items-center justify-center transform-style-3d will-change-transform -translate-y-1 sm:translate-y-0"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        <img
          ref={bottleImgRef}
          src={perfumes[0].image}
          alt={`VIE ${perfumes[0].name} Luxury Perfume Bottle`}
          className="h-auto w-[40vw] sm:w-[32vw] md:w-[26vw] lg:w-[21vw] max-w-[170px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[380px] max-h-[36vh] sm:max-h-[46vh] md:max-h-[56vh] lg:max-h-[64vh] object-contain cursor-pointer pointer-events-auto transition-all duration-300 select-none will-change-transform"
          style={{
            filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.28))",
          }}
        />

        {/* Photorealistic Studio Floor Contact Shadow grounded at the bottle base */}
        <div
          ref={shadowRef}
          className="absolute bottom-[4.5%] sm:bottom-[5.5%] left-1/2 -translate-x-1/2 w-[48%] h-4 sm:h-6 rounded-full pointer-events-none transition-colors duration-700"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.22) 55%, transparent 75%)",
            filter: "blur(5px)",
          }}
        />
      </div>
    </div>
  );
};

export default HeroProduct;
