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
  const bottleRefs = useRef([]);
  const shadowRef = useRef(null);
  const prevIndexRef = useRef(0);
  const isFirstRender = useRef(true);

  // Synchronized GSAP transition on active perfume change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      const initialEl = bottleRefs.current[0];
      if (initialEl) {
        gsap.fromTo(
          initialEl,
          { y: 50, scale: 0.94, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
          }
        );
      }
      return;
    }

    const nextIndex = perfumes.findIndex((p) => p.id === currentPerfume.id);
    const prevIndex = prevIndexRef.current;
    if (nextIndex === prevIndex) return;
    prevIndexRef.current = nextIndex;

    const prevEl = bottleRefs.current[prevIndex];
    const nextEl = bottleRefs.current[nextIndex];
    if (!prevEl || !nextEl) return;

    const travelDistance = window.innerHeight < 700 ? 75 : 105;
    const tl = gsap.timeline();

    // Prepare next bottle in GPU compositor before animating
    gsap.set(nextEl, {
      visibility: "visible",
      y: travelDistance,
      scale: 0.94,
      opacity: 0,
      pointerEvents: "auto",
    });
    gsap.set(prevEl, { pointerEvents: "none" });

    // 1. Old bottle smoothly drops down with opacity fade
    tl.to(prevEl, {
      y: travelDistance,
      scale: 0.94,
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(prevEl, { visibility: "hidden" });
      },
    });

    // Floor shadow contracts during drop
    tl.to(
      shadowRef.current,
      {
        scaleX: 0.42,
        opacity: 0.18,
        duration: 0.28,
        ease: "power2.inOut",
      },
      0
    );

    // Update floor shadow color for next theme
    tl.add(() => {
      if (shadowRef.current) {
        shadowRef.current.style.background =
          currentPerfume.theme === "light"
            ? "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 55%, transparent 75%)"
            : "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.22) 55%, transparent 75%)";
      }
    });

    // 2. Rise the NEW bottle up smoothly with pure GPU transform and luxury inertia
    tl.to(nextEl, {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.52,
      ease: "power3.out",
    });

    // Floor shadow expands and grounds the new bottle
    tl.to(
      shadowRef.current,
      {
        scaleX: 1,
        opacity: 1,
        duration: 0.48,
        ease: "power2.out",
      },
      "-=0.42"
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
        {/* Pre-rendered bottles: Zero runtime DOM/src mutations, 100% GPU texture composition */}
        <div className="relative flex items-center justify-center">
          {perfumes.map((perfume, idx) => {
            const isInitial = idx === 0;
            return (
              <img
                key={perfume.id}
                ref={(el) => (bottleRefs.current[idx] = el)}
                src={perfume.image}
                alt={`VIE ${perfume.name} Luxury Perfume Bottle`}
                loading="eager"
                decoding="sync"
                className={`${
                  isInitial ? "relative" : "absolute inset-0"
                } h-auto w-[40vw] sm:w-[32vw] md:w-[26vw] lg:w-[21vw] max-w-[170px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[380px] max-h-[36vh] sm:max-h-[46vh] md:max-h-[56vh] lg:max-h-[64vh] object-contain cursor-pointer pointer-events-auto select-none will-change-transform`}
                style={{
                  opacity: isInitial ? 1 : 0,
                  transform: isInitial ? "translate3d(0, 0, 0)" : "translate3d(0, 80px, 0)",
                  visibility: isInitial ? "visible" : "hidden",
                  pointerEvents: isInitial ? "auto" : "none",
                }}
              />
            );
          })}
        </div>

        {/* Photorealistic Studio Floor Contact Shadow grounded at the bottle base */}
        <div
          ref={shadowRef}
          className="absolute bottom-[4.5%] sm:bottom-[5.5%] left-1/2 -translate-x-1/2 w-[48%] h-4 sm:h-6 rounded-full pointer-events-none transition-colors duration-700"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.22) 55%, transparent 75%)",
            filter: "blur(5px)",
          }}
        />
      </div>
    </div>
  );
};

export default HeroProduct;
