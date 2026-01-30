'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionValueEvent } from 'framer-motion';
import styles from './Events.module.css';
import 'dotlottie-player';

export default function Events() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 1. SCROLL SETUP
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Responsive dimensions state
  const [startDimensions, setStartDimensions] = useState({ w: '60px', h: '40px' });
  
  // Interaction State (Only allow click-hold when card is roughly full screen)
  const [showOverlay, setShowOverlay] = useState(false);
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Card 1 now expands 0.2->0.3, stays 0.3->0.35, exits 0.35->...
    // Show overlay during the stationary full-screen phase.
    if (latest > 0.29 && latest < 0.35) {
      setShowOverlay(true);
    } else {
      setShowOverlay(false);
    }
  });

  const lottieRef = useRef<any>(null);

  useEffect(() => {
    const currentLottie = lottieRef.current;
    if (currentLottie) {
      const onComplete = () => {
        window.location.href = "https://www.google.com";
      };
      // dotlottie-player emits 'complete' event
      currentLottie.addEventListener('complete', onComplete);
      return () => {
        currentLottie.removeEventListener('complete', onComplete);
      };
    }
  }, [showOverlay]); // Re-bind when overlay (and thus player) appears


  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth > 768) {
        // Desktop: Thinner and Taller
        setStartDimensions({ w: '20px', h: '60px' });
      } else {
        // Mobile: Original wide specific
        setStartDimensions({ w: '60px', h: '40px' });
      }
    };

    // Initial call
    updateDimensions();

    import('dotlottie-player'); // Dynamic import for client-side only

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 2. MOUSE & TILT SETUP (Moved up to be available for transforms)
  const mouseX = useMotionValue(0.5); // 0..1 (Center)
  const mouseY = useMotionValue(0.85); // 0..1 (Bottom Center default)

  // Smooth the mouse values
  const springConfig = { damping: 20, stiffness: 300 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth);
    mouseY.set(clientY / innerHeight);
  };

  // --- ANIMATION MAPPING (3 CARDS) ---
  // Total Scroll Range: 0 to 1
  
  // SHARED TILT LOGIC (Re-used for simplicity across active cards)
  // Tilt strength fades out during transitions to avoid jarring jumps
  // We keep it active mostly when cards are stationary.
  
  // CARD 1: FASHION
  // Enter: 0 -> 0.2
  // Exit: 0.35 -> 0.55
  const y1 = useTransform(scrollYProgress, [0, 0.2, 0.35, 0.55], ['100vh', '0vh', '0vh', '-100vh']);
  const scrollRotateY = useTransform(scrollYProgress, [0, 0.2], [90, 0]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  
  const width1 = useTransform(scrollYProgress, [0.2, 0.3], [startDimensions.w, '100dvw']);
  const height1 = useTransform(scrollYProgress, [0.2, 0.3], [startDimensions.h, '100dvh']);
  const borderRadius1 = useTransform(scrollYProgress, [0.2, 0.3], ['6px', '0px']);
  
  const fgTranslateY = useTransform(scrollYProgress, [0.2, 0.3], ['200%', '0%']);
  const fgTranslateX = useTransform(smoothMouseX, [0, 1], ['20px', '-20px']);

  const mgTranslateX2 = useTransform(smoothMouseX, [0, 1], ['25px', '-25px']);
  
  // Card 3 MG Parallax
  const mgTranslateX3 = useTransform(smoothMouseX, [0, 1], ['20px', '-20px']);
  // Card 3 FG Parallax (Subtle)
  const fgTranslateX3 = useTransform(smoothMouseX, [0, 1], ['5px', '-5px']);

  const scale1 = useTransform(scrollYProgress, [0.35, 0.55], [1, 0.8]);
  const exitRotateX1 = useTransform(scrollYProgress, [0.35, 0.55], [0, 10]);


  // CARD 2: DECADANCE
  // Enter: 0.35 -> 0.55 (Sync with C1 Exit)
  // Exit: 0.65 -> 0.85 
  const y2 = useTransform(scrollYProgress, [0.35, 0.55, 0.65, 0.85], ['100vh', '0vh', '0vh', '-100vh']);
  const scale2 = useTransform(scrollYProgress, [0.35, 0.55, 0.65, 0.85], [0.5, 1, 1, 0.8]); // Enter Scale -> Stay -> Exit Scale
  const borderRadius2 = useTransform(scrollYProgress, [0.35, 0.55], ['20px', '0px']);
  
  const enterRotateX2 = useTransform(scrollYProgress, [0.35, 0.55], [-10, 0]);
  const exitRotateX2 = useTransform(scrollYProgress, [0.65, 0.85], [0, 10]);
  
  // Combine rotations for Card 2
  const rotateX2 = useTransform([enterRotateX2, exitRotateX2], ([enter, exit]: number[]) => enter + exit);


  // CARD 3: DRIFTX
  // Enter: 0.65 -> 0.85 (Sync with C2 Exit)
  // Stay: 0.85 -> 1.0
  const y3 = useTransform(scrollYProgress, [0.65, 0.85], ['100vh', '0vh']);
  const scale3 = useTransform(scrollYProgress, [0.65, 0.85], [0.5, 1]);
  const borderRadius3 = useTransform(scrollYProgress, [0.65, 0.85], ['20px', '0px']);
  const enterRotateX3 = useTransform(scrollYProgress, [0.65, 0.85], [-10, 0]);

  // TILT CALCULATION
  // Reduced global tilt (was +/- 5, now +/- 2)
  const baseTiltRotateY = useTransform(smoothMouseX, [0, 1], [-2, 2]); 
  const baseTiltRotateX = useTransform(smoothMouseY, [0, 1], [2, -2]);
  
  // REDUCED TILT FOR CARD 3 (Minute effect)
  const baseTiltRotateY3 = useTransform(smoothMouseX, [0, 1], [0, 1]); 
  // Disable X-axis tilt (up/down) for Card 3 as requested
  const baseTiltRotateX3 = useTransform(smoothMouseY, [0, 1], [0, 0]);
  
  // Damping: Reduce tilt during transitions (approximate centers of transitions)
  const tiltStrength = useTransform(scrollYProgress, [0.2, 0.35, 0.55, 0.65, 0.85], [1, 0, 1, 0, 1]);
  
  const tiltRotateY = useTransform([baseTiltRotateY, tiltStrength], ([rot, strength]: number[]) => rot * strength);
  const tiltRotateX = useTransform([baseTiltRotateX, tiltStrength], ([rot, strength]: number[]) => rot * strength);

  const tiltRotateY3 = useTransform([baseTiltRotateY3, tiltStrength], ([rot, strength]: number[]) => rot * strength);
  const tiltRotateX3 = useTransform([baseTiltRotateX3, tiltStrength], ([rot, strength]: number[]) => rot * strength);

  // Final Rotations
  const finalRotateY1 = useTransform([scrollRotateY, tiltRotateY], ([s, t]: number[]) => s + t);
  const finalRotateX1 = useTransform([tiltRotateX, exitRotateX1], ([t, e]: number[]) => t + e);
  
  const finalRotateY2 = tiltRotateY; // No scroll rotate for C2
  const finalRotateX2 = useTransform([tiltRotateX, rotateX2], ([t, r]: number[]) => t + r);
  
  const finalRotateY3 = tiltRotateY3;
  const finalRotateX3 = useTransform([tiltRotateX3, enterRotateX3], ([t, e]: number[]) => t + e);

  // Parallax Transitions (Image moves 1/4 speed relative to Card Movement)
  // Card moves 100vh -> 0. Image should move -25vh -> 0 (Relative shift UP 25vh? No relative shift DOWN)
  // Actually, we established: Transition UP (0->0.2) => Image Relative DOWN (-75vh -> 0).
  // Transition DOWN (Exit) => Image Relative UP (0 -> 75vh).
  
  // Card 1 Exit Parallax (0.35 -> 0.55)
  const parallaxY1_Exit = useTransform(scrollYProgress, [0.35, 0.55], ['0vh', '75vh']);
  
  // Card 2 Parallax (Enter 0.35->0.55, Exit 0.65->0.85)
  const parallaxY2 = useTransform(scrollYProgress, [0.35, 0.55, 0.65, 0.85], ['-75vh', '0vh', '0vh', '75vh']);
  
  // Card 3 Parallax (Enter 0.65->0.85)
  const parallaxY3 = useTransform(scrollYProgress, [0.65, 0.85], ['-75vh', '0vh']);

  // Card 1 FG Composite: Popup (0.2->0.3) + Parallax Exit (0.35->0.55)
  // Original fgTranslateY: [0.2, 0.3] -> ['200%', '0%']
  // We need to map to: 0.2->200%, 0.3->0%, 0.35->0vh, 0.55->75vh
  const fgParaY1 = useTransform(scrollYProgress, [0.2, 0.3, 0.35, 0.55], ['200%', '0%', '0vh', '75vh']);

  // Red Vignette Transition Opacity
  // Card 1 Exit (0.35 -> 0.55)
  const transitionOpacity1 = useTransform(scrollYProgress, [0.35, 0.45, 0.55], [0, 1, 0]);
  
  // Card 2 Enter (0.35 -> 0.55) & Exit (0.65 -> 0.85)
  const transitionOpacity2 = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65, 0.75, 0.85], [0, 1, 0, 0, 1, 0]);

  // Card 3 Enter (0.65 -> 0.85)
  const transitionOpacity3 = useTransform(scrollYProgress, [0.65, 0.75, 0.85], [0, 1, 0]);

  // INTERACTION VARIANTS (Click & Hold)
  const overlayVariants = {
    rest: { opacity: 0 },
    pressed: { opacity: 1, transition: { duration: 0.2 } }
  };

  const textVariants = {
    rest: { opacity: 0, y: 10 },
    pressed: { 
      opacity: 1, 
      y: 0, 
      transition: { delay: 0.2, duration: 0.3 } // Text fades in AFTER overlay appears
    }
  };

  // Cursor movements (Defined at top level to avoid hook errors)
  const cursorX = useTransform(smoothMouseX, [0, 1], ['0%', '100%']);
  const cursorY = useTransform(smoothMouseY, [0, 1], ['0%', '100%']);

  return (
    <div className={styles.container} ref={containerRef} onMouseMove={handleMouseMove}>
      <div className={styles.stickyWrapper}>
        
        {/* CARD 1 - EXISTING */}
        <motion.div 
          className={styles.card}
          initial="rest"
          whileTap="pressed" // Triggers variants in children
          whileHover="hover" // Optional: we could add hover effects too
          style={{
            y: y1,
            scale: scale1,
            rotateY: finalRotateY1,
            rotateX: finalRotateX1,
            width: width1,
            height: height1,
            borderRadius: borderRadius1,
            opacity: opacity1,
            zIndex: 10,
            cursor: showOverlay ? 'none' : 'auto', // Hide default cursor when active
          }}
          onTapStart={() => {
            if (lottieRef.current) {
              lottieRef.current.play();
            }
          }}
          onTap={() => {
            if (lottieRef.current) {
              lottieRef.current.stop();
            }
          }}
          onTapCancel={() => {
            if (lottieRef.current) {
              lottieRef.current.stop();
            }
          }}
        >
            {/* BACKGROUND IMAGE - AUTO CROPPED BY PARENT DIMENSIONS */}
            {/* Using a simple div with background-size: cover handles the "crop then reveal" logic perfectly 
                as the parent aspect ratio changes from portrait (card) to landscape (screen). */}
            <motion.div 
              className={styles.layerBg}
              style={{ 
                  backgroundImage: 'url("/images/FASHOIN/bg.png")',
                  y: parallaxY1_Exit
              }} 
            />

            {/* CONTENT */}
            {/* MIDDLE GROUND (mg2) - Always visible, layered on top of BG */}
            <motion.div 
              className={styles.layerMg}
              style={{ 
                  backgroundImage: 'url("/images/FASHOIN/mg2.png")',
                  y: parallaxY1_Exit
              }} 
            />

            {/* FOREGROUND (fg) - Slides up */}
            <motion.div 
              className={styles.layerFg}
              style={{ 
                  backgroundImage: 'url("/images/FASHOIN/fg.png")',
                  y: fgParaY1, // Uses composite transform
                  x: fgTranslateX
              }} 
            />

            {/* RED VIGNETTE OVERLAY */}
            <motion.div 
              className={styles.transitionOverlay}
              style={{ opacity: transitionOpacity1 }}
            />

            {/* OVERLAY & LOTTIE (Appears on Hold) - Conditional Rendering */}
            {showOverlay && (
              <motion.div 
                className={styles.cardOverlay} 
                variants={overlayVariants}
                style={{ 
                  pointerEvents: 'none',
                  clipPath: 'inset(0px 0px 116px 0px)', // Clip bottom 116px
                  background: 'transparent',
                }} 
              >
                 {/* @ts-ignore */}
                 <dotlottie-player
                    ref={lottieRef}
                    src="/animations/test.lottie"
                    background="transparent"
                    speed="1"
                    style={{ width: '100%', height: '100%' }}
                    objectFit="cover"
                    loop={false}
                  ></dotlottie-player>
              </motion.div>
            )}

        </motion.div>

        {/* CARD 2 - DECADANCE */}
        <motion.div 
          className={styles.card}
          style={{
             y: y2,
             scale: scale2,
             rotateX: finalRotateX2,
             rotateY: finalRotateY2,
             width: '100dvw',
             height: '100dvh',
             borderRadius: borderRadius2,
             zIndex: 20, 
             position: 'absolute',
          }}
        >
             <motion.div 
               className={styles.layerBg}
               style={{ 
                   backgroundImage: 'url("/images/Dance/bg.png")',
                   y: parallaxY2
               }} 
             />
             <motion.div 
               className={styles.layerBMg}
               style={{ 
                   backgroundImage: 'url("/images/Dance/mg.png")',
                   x: mgTranslateX2,
                   y: parallaxY2
               }} 
             />
             <motion.div 
               className={styles.layerFg}
               style={{ 
                   backgroundImage: 'url("/images/Dance/fg.png")',
                   y: parallaxY2
               }} 
             />
             <motion.div 
               className={styles.transitionOverlay}
               style={{ opacity: transitionOpacity2 }}
             />
        </motion.div>

        {/* CARD 3 - DRIFTX */}
        <motion.div 
          className={styles.card}
          style={{
             y: y3,
             scale: scale3,
             rotateX: finalRotateX3,
             rotateY: finalRotateY3,
             width: '100dvw',
             height: '100dvh',
             borderRadius: borderRadius3,
             zIndex: 30,
             position: 'absolute',
          }}
        >
             <motion.div 
               className={styles.layerBg}
               style={{ 
                   backgroundImage: 'url("/images/Drift/bg.png")',
                   y: parallaxY3
               }} 
             />
             <motion.div 
               className={styles.layerDMg}
               style={{ 
                   backgroundImage: 'url("/images/Drift/mg.png")',
                   x: mgTranslateX3,
                   y: parallaxY3
               }} 
             />
             <motion.div 
               className={styles.layerDFg}
               style={{ 
                   backgroundImage: 'url("/images/Drift/fg.png")',
                   x: fgTranslateX3,
                   y: parallaxY3
               }} 
             />
             <motion.div 
               className={styles.transitionOverlay}
               style={{ opacity: transitionOpacity3 }}
             />
        </motion.div>

        {/* CUSTOM CURSOR (Only when Card 1 is full screen) */}
        {showOverlay && (
          <motion.div 
            className={styles.customCursor}
            style={{
              left: cursorX,
              top: cursorY,
            }}
          >
            TAP AND HOLD
          </motion.div>
        )}

      </div>

      <div className={styles.nextContent}>
      
      </div>
    </div>
  );
}
