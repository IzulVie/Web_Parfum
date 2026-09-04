Act as an Expert React.js Developer and GSAP Animation Specialist. 
I need you to build a highly interactive, 3D parallax hero slider for a luxury perfume brand named "VIE". There is no backend required. The entire state will be managed locally in React.

TECH STACK:
- React.js (Functional Components, Hooks)
- Tailwind CSS (for layout and styling)
- GSAP (GreenSock) for all animations and page transitions
- Lucide React (for icons, if needed)

PROJECT OVERVIEW:
The website is a single-page interactive showcase featuring 4 perfume variants. The core interaction is a slider where clicking "Next" or "Prev" triggers a synchronized GSAP timeline.

DATA STRUCTURE (Mock Data):
Create an array of objects for the 4 perfumes with the following properties:
1. Noir: { id: 1, name: "NOIR", bgHex: "#1a1a1a", textHex: "#333333", image: "/assets/noir.png" }
2. Urban: { id: 2, name: "URBAN", bgHex: "#0a2e15", textHex: "#144a24", image: "/assets/urban.png" }
3. Cool Water: { id: 3, name: "WATER", bgHex: "#0c3b6d", textHex: "#155393", image: "/assets/water.png" }
4. Cedarwood: { id: 4, name: "CEDAR", bgHex: "#e6e6e6", textHex: "#cccccc", image: "/assets/cedar.png" }

Z-INDEX & LAYOUT ARCHITECTURE (Critical):
The layout must be exactly 100vh and 100vw, overflow hidden. Stack elements using absolute positioning:
- Layer 1 (z-10): Background div that spans full screen.
- Layer 2 (z-20): Oversized typography (using the `name` property). Centered, extremely large (e.g., 20vw), bold, tracking-widest, acting as a watermark.
- Layer 3 (z-30): Floating Particles (small abstract divs/images placed randomly around the screen).
- Layer 4 (z-40): Hero Product Image (The perfume bottle). Centered. Apply a CSS drop-shadow (filter: drop-shadow(0 20px 30px rgba(0,0,0,0.5))) to simulate depth since the PNGs are solid.
- Layer 5 (z-50): UI/Nav. A top navbar (Logo "VIE", Menu links) and bottom slider controls (Prev/Next buttons).

ANIMATION LOGIC (GSAP Requirements):
When the active slide changes, trigger a GSAP timeline:
1. Background Color: Morph the background color smoothly to the new active item's `bgHex`.
2. Oversized Text: The old text slides out to the left/right and fades out. The new text slides in from the opposite direction.
3. Hero Bottle: The current bottle scales down slightly and drops vertically out of the frame. The new bottle rises from the bottom into the center and scales up to normal size with an elastic/bounce ease (e.g., "back.out(1.2)").
4. Parallax Mousemove (Bonus): Add a mousemove event listener to the main container. When the user moves the cursor, slightly shift the Hero Bottle (reverse direction of mouse) and Floating Particles (same direction of mouse) to create a 3D parallax depth effect.

COMPONENT STRUCTURE:
Please break the code down into clean, modular React components:
- <App /> (Main state holder for `activeIndex`)
- <Background />
- <OversizedText />
- <HeroProduct />
- <FloatingParticles />
- <Navigation />

Please provide the complete, functional React code. Start with the main App component and include all necessary child components.