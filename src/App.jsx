import React, { useState, useEffect, useCallback, useRef } from "react";
import { perfumes } from "./data/perfumes";
import Background from "./components/Background";
import OversizedText from "./components/OversizedText";
import FloatingParticles from "./components/FloatingParticles";
import HeroProduct from "./components/HeroProduct";
import Navigation from "./components/Navigation";

/**
 * Main App Component:
 * - Manages activeIndex and navigation direction
 * - Debounces rapid clicks/swipes during active transitions
 * - Supports Mouse Parallax + Touch Drag Parallax + Swipe Gestures (Swipe Left / Right)
 * - Enforces dynamic viewport height (100dvh) for seamless mobile Safari / Chrome support
 * - Synchronizes all 5 luxury z-index layers
 */
function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward/next, -1 = backward/prev
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);

  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  const total = perfumes.length;
  const currentPerfume = perfumes[activeIndex];

  // Next slide handler (with transition lock)
  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
    setTimeout(() => setIsTransitioning(false), 950);
  }, [total, isTransitioning]);

  // Prev slide handler (with transition lock)
  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
    setTimeout(() => setIsTransitioning(false), 950);
  }, [total, isTransitioning]);

  // Direct select handler
  const handleSelectIndex = useCallback(
    (index) => {
      if (isTransitioning || index === activeIndex) return;
      setIsTransitioning(true);
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
      setTimeout(() => setIsTransitioning(false), 950);
    },
    [activeIndex, isTransitioning]
  );

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Mousemove Parallax Tracking
  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const normX = (clientX / innerWidth) * 2 - 1;
    const normY = (clientY / innerHeight) * 2 - 1;
    setMousePos({ x: normX, y: normY });
  }, []);

  // Touch Swipe & Touch Parallax Handling
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const { innerWidth, innerHeight } = window;
      const normX = (touch.clientX / innerWidth) * 2 - 1;
      const normY = (touch.clientY / innerHeight) * 2 - 1;
      setMousePos({ x: normX * 0.8, y: normY * 0.8 });
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Minimum swipe distance of 45px and predominantly horizontal
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) && deltaTime < 600) {
        if (deltaX < 0) {
          // Swiped left -> Next fragrance
          handleNext();
        } else {
          // Swiped right -> Previous fragrance
          handlePrev();
        }
      }
    }
  };

  return (
    <main
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-screen h-screen h-[100dvh] overflow-hidden select-none bg-black touch-manipulation"
      style={{ width: "100vw", height: "100dvh" }}
    >
      {/* Layer 1 (z-10): Fullscreen Morphing Background */}
      <Background currentPerfume={currentPerfume} />

      {/* Layer 2 (z-20): Watermark Oversized Typography */}
      <OversizedText currentPerfume={currentPerfume} direction={direction} />

      {/* Layer 3 (z-30): Floating Particles (Parallax: Same direction) */}
      <FloatingParticles currentPerfume={currentPerfume} mousePos={mousePos} />

      {/* Layer 4 (z-40): Hero Product Perfume Bottle (Parallax: Reverse direction) */}
      <HeroProduct currentPerfume={currentPerfume} mousePos={mousePos} />

      {/* Layer 5 (z-50): Top Navbar & Bottom Slider Controls */}
      <Navigation
        perfumes={perfumes}
        activeIndex={activeIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelectIndex={handleSelectIndex}
        currentPerfume={currentPerfume}
      />
    </main>
  );
}

export default App;
