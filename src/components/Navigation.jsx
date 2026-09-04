import React from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";

/**
 * Layer 5 (z-50): UI/Navigation & Luxury Editorial Content
 * Highly responsive across Mobile, Tablet, Laptop, and Desktop.
 * - Mobile & Tablet Portrait (< 1024px):
 *   - Top: Header + Brand title & Olfactory notes (completely above the bottle)
 *   - Center: Unobstructed view of the 3D perfume bottle
 *   - Bottom: Price & Acquire CTA + Slider navigation (at thumb level)
 * - Laptop & Desktop (>= 1024px):
 *   - Classic Haute Parfumerie flanking layout with left notes and right pricing
 */
const Navigation = ({
  perfumes,
  activeIndex,
  onPrev,
  onNext,
  onSelectIndex,
  currentPerfume,
}) => {
  const isLight = currentPerfume.theme === "light";

  // Contrast text color tokens
  const textColor = isLight ? "text-neutral-900" : "text-white";
  const textMuted = isLight ? "text-neutral-600" : "text-neutral-400";
  const borderCol = isLight ? "border-neutral-900/20" : "border-white/20";
  const bgGlass = isLight
    ? "bg-white/40 hover:bg-white/70 backdrop-blur-md"
    : "bg-black/30 hover:bg-white/10 backdrop-blur-md";

  return (
    <div
      id="ui-navigation-layer"
      className={`absolute inset-0 z-50 pointer-events-none flex flex-col justify-between p-3.5 sm:p-6 lg:p-10 transition-colors duration-700 ${textColor}`}
    >
      {/* 1. TOP SECTION (Header + Mobile Product Title) */}
      <div className="w-full flex flex-col space-y-2 sm:space-y-3 pointer-events-auto">
        {/* Brand Navbar */}
        <header className="flex items-center justify-between w-full">
          {/* Brand Logo */}
          <div className="flex flex-col cursor-pointer group">
            <span className="font-cinzel text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-[0.28em] sm:tracking-[0.35em] leading-none transition-transform group-hover:scale-105">
              VIE
            </span>
            <span className="text-[7.5px] sm:text-[9px] tracking-[0.25em] sm:tracking-[0.3em] uppercase opacity-70 mt-0.5 font-sans">
              Haute Parfumerie
            </span>
          </div>

          {/* Desktop Center Nav Links (Visible only on lg+) */}
          <nav className="hidden lg:flex items-center space-x-9 text-xs tracking-[0.25em] uppercase font-medium">
            {["Collection", "Fragrances", "La Maison", "Atelier"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`relative py-1 transition-opacity duration-300 hover:opacity-100 ${textMuted} hover:${textColor} after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-current hover:after:w-full after:transition-all after:duration-300`}
                onClick={(e) => e.preventDefault()}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right Utility Buttons */}
          <div className="flex items-center space-x-2.5 sm:space-x-5">
            <div className="hidden sm:flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase font-semibold px-3 py-1.5 rounded-full border border-current/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Editions 2026</span>
            </div>

            <button
              id="nav-bag-btn"
              aria-label="Shopping Bag"
              className={`relative p-2 sm:p-2.5 rounded-full border ${borderCol} ${bgGlass} transition-all duration-300 hover:scale-105 active:scale-95`}
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-500 text-black text-[8px] sm:text-[9px] font-bold flex items-center justify-center">
                1
              </span>
            </button>
          </div>
        </header>

        {/* Mobile & Tablet Portrait Title (< lg): Compact header card above bottle */}
        <div className="lg:hidden flex flex-col space-y-1 pt-0.5 w-full">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase opacity-60">
              N° 0{currentPerfume.id}
            </span>
            <span className="w-3 h-[1px] bg-current opacity-40"></span>
            <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-semibold text-amber-500">
              {currentPerfume.subtitle}
            </span>
          </div>

          <h2 className="font-cinzel text-lg sm:text-2xl font-bold tracking-wide leading-tight">
            {currentPerfume.fullName}
          </h2>

          {/* Scent notes in a single clean horizontal scroll row */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
            {currentPerfume.notes.map((note) => (
              <span
                key={note}
                className={`text-[8.5px] sm:text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${borderCol} ${bgGlass}`}
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. DESKTOP FLANKING EDITORIAL SECTION (lg+) */}
      <div className="hidden lg:flex items-end justify-between w-full pointer-events-none pb-8">
        {/* Left Side: Perfume Identity & Olfactory Notes */}
        <div className="pointer-events-auto max-w-sm space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono tracking-widest uppercase opacity-60">
              N° 0{currentPerfume.id}
            </span>
            <span className="w-8 h-[1px] bg-current opacity-40"></span>
            <span className="text-xs tracking-[0.25em] uppercase font-semibold text-amber-500">
              {currentPerfume.subtitle}
            </span>
          </div>

          <h2 className="font-cinzel text-3xl xl:text-4xl font-bold tracking-wider leading-tight">
            {currentPerfume.fullName}
          </h2>

          <p className={`text-sm leading-relaxed ${textMuted} font-light`}>
            {currentPerfume.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentPerfume.notes.map((note) => (
              <span
                key={note}
                className={`text-[10px] tracking-wider px-2.5 py-1 rounded-full border ${borderCol} ${bgGlass}`}
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Price, Volume & Order Action */}
        <div className="pointer-events-auto flex flex-col items-end space-y-3 text-right">
          <span className="text-[11px] font-mono tracking-[0.2em] opacity-70">
            {currentPerfume.volume}
          </span>
          <div className="font-cinzel text-4xl font-semibold tracking-wider">
            {currentPerfume.price}
          </div>
          <button
            id="acquire-fragrance-btn"
            className={`mt-2 px-6 py-3 rounded-full text-xs font-semibold tracking-[0.25em] uppercase border transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2 ${
              isLight
                ? "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800"
                : "bg-white text-neutral-900 border-white hover:bg-neutral-100"
            }`}
          >
            <span>Acquire Fragrance</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. BOTTOM SECTION: Mobile CTA + Slider Controls */}
      <div className="w-full flex flex-col space-y-2 sm:space-y-3 pointer-events-auto">
        {/* Mobile & Tablet Portrait Price & CTA Bar (< lg) */}
        <div className="lg:hidden flex items-center justify-between gap-3 pt-0.5">
          <div>
            <span className="text-[8.5px] font-mono tracking-widest opacity-60 block leading-none mb-0.5">
              {currentPerfume.volume}
            </span>
            <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider leading-none">
              {currentPerfume.price}
            </span>
          </div>

          <button
            id="mobile-acquire-btn"
            className={`py-2 px-4.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase border transition-all duration-300 active:scale-95 flex items-center space-x-1.5 shrink-0 ${
              isLight
                ? "bg-neutral-900 text-white border-neutral-900 active:bg-neutral-800"
                : "bg-white text-neutral-900 border-white active:bg-neutral-100"
            }`}
          >
            <span>Acquire</span>
            <Sparkles className="w-3 h-3" />
          </button>
        </div>

        {/* Bottom Slider Bar (Shared across all devices) */}
        <footer className="flex items-center justify-between gap-2 sm:gap-4 w-full border-t border-current/15 pt-2 sm:pt-4">
          {/* Variant Selectors (Pills) */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 overflow-x-auto no-scrollbar py-0.5">
            {perfumes.map((perfume, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={perfume.id}
                  id={`variant-btn-${perfume.name.toLowerCase()}`}
                  onClick={() => onSelectIndex(idx)}
                  className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[9.5px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium transition-all duration-300 border shrink-0 ${
                    isActive
                      ? isLight
                        ? "bg-neutral-900 text-white border-neutral-900 scale-105 font-bold"
                        : "bg-white text-black border-white scale-105 font-bold"
                      : `${borderCol} ${bgGlass} ${textMuted} hover:opacity-100`
                  }`}
                >
                  {perfume.name}
                </button>
              );
            })}
          </div>

          {/* Active Index Counter & Navigation Arrows */}
          <div className="flex items-center space-x-2 sm:space-x-5 shrink-0">
            <div className="text-[10px] sm:text-xs font-mono tracking-widest">
              <span className="font-bold text-xs sm:text-sm">0{activeIndex + 1}</span>
              <span className="opacity-40 mx-1 sm:mx-1.5">/</span>
              <span className="opacity-50">0{perfumes.length}</span>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2.5">
              <button
                id="slider-prev-btn"
                onClick={onPrev}
                aria-label="Previous Fragrance"
                className={`p-2 sm:p-3 rounded-full border ${borderCol} ${bgGlass} transition-all duration-300 hover:scale-110 active:scale-90 group`}
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <button
                id="slider-next-btn"
                onClick={onNext}
                aria-label="Next Fragrance"
                className={`p-2 sm:p-3 rounded-full border ${borderCol} ${bgGlass} transition-all duration-300 hover:scale-110 active:scale-90 group`}
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Navigation;
