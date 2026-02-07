'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionValueEvent } from 'framer-motion';
import styles from './Events.module.css';


export default function Events() {
  // Custom Long Press Hook
  const useLongPress = (
    onLongPress: () => void,
    onPressEnd: () => void,
    ms = 300,
    tolerance = 10
  ) => {
    const timeout = useRef<NodeJS.Timeout | undefined>(undefined);
    const startPos = useRef<{ x: number; y: number } | null>(null);

    const start = (e: React.TouchEvent | React.MouseEvent) => {
      if (e.type === 'touchstart') {
        const touch = (e as React.TouchEvent).touches[0];
        startPos.current = { x: touch.clientX, y: touch.clientY };
      } else {
        const mouse = (e as React.MouseEvent);
        startPos.current = { x: mouse.clientX, y: mouse.clientY };
      }

      timeout.current = setTimeout(() => {
        onLongPress();
      }, ms);
    };

    const move = (e: React.TouchEvent | React.MouseEvent) => {
      if (!startPos.current || !timeout.current) return;

      let x, y;
      if (e.type === 'touchmove') {
        const touch = (e as React.TouchEvent).touches[0];
        x = touch.clientX;
        y = touch.clientY;
      } else {
        const mouse = (e as React.MouseEvent);
        x = mouse.clientX;
        y = mouse.clientY;
      }

      const dist = Math.sqrt(
        Math.pow(x - startPos.current.x, 2) + Math.pow(y - startPos.current.y, 2)
      );

      if (dist > tolerance) {
        clearTimeout(timeout.current);
        timeout.current = undefined;
        startPos.current = null;
        onPressEnd();
      }
    };

    const end = () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      onPressEnd();
      startPos.current = null;
    };

    return {
      onMouseDown: start,
      onMouseMove: move,
      onMouseUp: end,
      onMouseLeave: end,
      onTouchStart: start,
      onTouchMove: move,
      onTouchEnd: end,
    };
  };

  const containerRef = useRef<HTMLDivElement>(null);
  
  // 1. SCROLL SETUP
  // 1. SCROLL SETUP
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 1', 'end end']
  });

  // Responsive dimensions state
  const [startDimensions, setStartDimensions] = useState({ w: '60px', h: '40px' });
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false); // New low-end detection
  
  // PERFORMANCE FIX: Replace State with MotionValues
  // Define active ranges for logic gating
  // Card 1: 0.08 -> 0.25 (Stay) -> 0.42 (Exit end)
  // Card 2: 0.42 -> 0.52 (Stay) -> 0.67 (Exit end)
  // Card 3: 0.55 -> 1.0 (Stay)
  
  const isCard1Active = useTransform(scrollYProgress, v => (v > 0.05 && v < 0.45) ? 1 : 0);
  const isCard2Active = useTransform(scrollYProgress, v => (v > 0.60 && v < 0.80) ? 1 : 0);
  const isCard3Active = useTransform(scrollYProgress, v => v > 0.95 ? 1 : 0);

  // Derived cursors (MotionValue strings) directly bound to style
  const cursor1 = useTransform(isCard1Active, active => active === 1 ? 'none' : 'auto');
  const cursor2 = useTransform(isCard2Active, active => active === 1 ? 'none' : 'auto');
  const cursor3 = useTransform(isCard3Active, active => active === 1 ? 'none' : 'auto');
  
  // Track press state for manual animation control (replaces whileTap)
  const [isPressed1, setIsPressed1] = useState(false);
  const [isPressed2, setIsPressed2] = useState(false);
  const [isPressed3, setIsPressed3] = useState(false);

  const lottieRef = useRef<any>(null); // Kept for reference or removal
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const lottieRef2 = useRef<any>(null);
  const lottieRef3 = useRef<any>(null);

  useEffect(() => {
    const currentLottie = lottieRef.current;
    if (currentLottie) {
      const onComplete = () => {
        window.location.href = "/events";
      };
      // Check if addEventListener is available (it might be a web component or wrapper)
      if (typeof currentLottie.addEventListener === 'function') {
        currentLottie.addEventListener('complete', onComplete);
      }
      return () => {
        if (typeof currentLottie.removeEventListener === 'function') {
            currentLottie.removeEventListener('complete', onComplete);
        }
      };
    }
  }, [isMobile]);

  useEffect(() => {
    const currentLottie2 = lottieRef2.current;
    if (currentLottie2) {
      const onComplete = () => {
        window.location.href = "/events";
      };
      if (typeof currentLottie2.addEventListener === 'function') {
        currentLottie2.addEventListener('complete', onComplete);
      }
      return () => {
         if (typeof currentLottie2.removeEventListener === 'function') {
            currentLottie2.removeEventListener('complete', onComplete);
         }
      };
    }
  }, [isMobile]);

  useEffect(() => {
    const currentLottie3 = lottieRef3.current;
    if (currentLottie3) {
      const onComplete = () => {
        window.location.href = "/events";
      };
      if (typeof currentLottie3.addEventListener === 'function') {
        currentLottie3.addEventListener('complete', onComplete);
      }
      return () => {
         if (typeof currentLottie3.removeEventListener === 'function') {
            currentLottie3.removeEventListener('complete', onComplete);
         }
      };
    }
  }, [isMobile]);


  useEffect(() => {
    const updateDimensions = () => {
      // Detect Low-End Device (Concurrency <= 4 or Data Saver)
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const saveData = (navigator as any).connection?.saveData === true;
      if (hardwareConcurrency <= 4 || saveData) {
        setIsLowEnd(true);
      }

      if (window.innerWidth > 768) {
        // Desktop: Thinner and Taller
        setStartDimensions({ w: '20px', h: '60px' });
        setIsMobile(false);
      } else {
        // Mobile: Original wide specific
        setStartDimensions({ w: '60px', h: '40px' });
        setIsMobile(true);
      }
    };

    // Initial call
    updateDimensions();

    // import('dotlottie-player'); // Removed dynamic import

    window.addEventListener('resize', updateDimensions);
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // PERFORMANCE: Clamp DPR on mobile to reduce GPU load
  useEffect(() => {
    if (typeof window !== 'undefined' && isMobile) {
      const originalDpr = window.devicePixelRatio;
      if (originalDpr > 2) {
        // Force lower res rendering on high density mobile screens
        const style = document.createElement('style');
        style.innerHTML = `
          canvas, img, video { image-rendering: auto; }
        `;
        document.head.appendChild(style);
      }
    }
  }, [isMobile]);

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

  // PERFORMANCE: Disable Tilt on Fast Scroll (Delta Check - Lightweight)
  // Replaced useVelocity with simple delta check to save overhead
  const lastScroll = useRef(0);
  const enableTilt = useTransform(scrollYProgress, v => {
    const delta = Math.abs(v - lastScroll.current);
    lastScroll.current = v;
    return delta < 0.002 ? 1 : 0; // Threshold for "fast" scroll
  });

  // PERFORMANCE: Hard Freeze Inactive Cards
  // Derived flags: Active AND (Not Low End OR Card Active checking only)
  // Actually, for tilt/parallax to be frozen, we just need to know if we should calculate it.
  
  // Logic: 
  // 1. If isLowEnd -> Disable Tilt completely.
  // 2. If !isCardActive -> Force Tilt to 0 (freeze).
  // 3. If Fast Scroll -> Force Tilt to 0.
  
  // Simplification: Use single-argument useTransform for 1->1 mapping
  const enableTiltDerived = useTransform(enableTilt, enabled => (!isLowEnd && enabled === 1) ? 1 : 0);

  // Per-Card Enabled Flags for Transforms
  // Cast to any to avoid generic invariance issues (MotionValue<0|1> vs MotionValue<number>)
  const card1Enabled = useTransform([isCard1Active, enableTiltDerived] as any, ([active, tilt]: number[]) => (active && tilt) ? 1 : 0);
  const card2Enabled = useTransform([isCard2Active, enableTiltDerived] as any, ([active, tilt]: number[]) => (active && tilt) ? 1 : 0);
  const card3Enabled = useTransform([isCard3Active, enableTiltDerived] as any, ([active, tilt]: number[]) => (active && tilt) ? 1 : 0);

  // --- ANIMATION MAPPING (3 CARDS) ---
  // Total Scroll Range: 0 to 1
  
  // SHARED TILT LOGIC (Re-used for simplicity across active cards)
  // Tilt strength fades out during transitions to avoid jarring jumps
  // We keep it active mostly when cards are stationary.
  
  // CARD 1: FASHION
  // Enter: 0 -> 0.05
  // Stay: 0.05 -> 0.45
  // Exit: 0.45 -> 0.60
  // GATE: Park at 100vh if > 0.7
  const rawY1 = useTransform(scrollYProgress, [0, 0.05, 0.45, 0.60], ['100vh', '0vh', '0vh', '-100vh']);
  const y1 = useTransform(scrollYProgress, v => v < 0.7 ? rawY1.get() : '-100vh'); // Park offscreen top if passed

  const scrollRotateY = useTransform(scrollYProgress, [0.02, 0.05], [90, 0]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.04], [0, 1]);
  
  const width1 = useTransform(scrollYProgress, [0.05, 0.25], [startDimensions.w, '100dvw']);
  const height1 = useTransform(scrollYProgress, [0.05, 0.25], [startDimensions.h, '100dvh']);
  const borderRadius1 = useTransform(scrollYProgress, [0.05, 0.25], ['6px', '0px']);
  
  const fgTranslateY = useTransform(scrollYProgress, [0.05, 0.25], ['200%', '0%']);
  const fgTranslateX = useTransform(smoothMouseX, [0, 1], ['20px', '-20px']);

  const mgTranslateX2 = useTransform(smoothMouseX, [0, 1], ['25px', '-25px']);
  
  // Card 3 MG Parallax
  const mgTranslateX3 = useTransform(smoothMouseX, [0, 1], ['20px', '-20px']);
  // Card 3 FG Parallax (Subtle)
  const fgTranslateX3 = useTransform(smoothMouseX, [0, 1], ['5px', '-5px']);

  const scale1 = useTransform(scrollYProgress, [0.45, 0.60], [1, 0.8]);
  const exitRotateX1 = useTransform(scrollYProgress, [0.45, 0.60], [0, 10]);


  // CARD 2: DECADANCE
  // Enter: 0.45 -> 0.60 (Sync with C1 Exit)
  // Stay: 0.60 -> 0.80
  // Exit: 0.80 -> 0.90
  // GATE: Park at 100vh if < 0.3 or > 0.95
  const rawY2 = useTransform(scrollYProgress, [0.45, 0.60, 0.80, 0.90], ['100vh', '0vh', '0vh', '-100vh']);
  const y2 = useTransform(scrollYProgress, v => (v > 0.3 && v < 0.95) ? rawY2.get() : '100vh');

  const scale2 = useTransform(scrollYProgress, [0.45, 0.60, 0.80, 0.90], [0.5, 1, 1, 0.8]); // Enter Scale -> Stay -> Exit Scale
  const borderRadius2 = useTransform(scrollYProgress, [0.45, 0.60], ['20px', '0px']);
  
  const enterRotateX2 = useTransform(scrollYProgress, [0.45, 0.60], [-10, 0]);
  const exitRotateX2 = useTransform(scrollYProgress, [0.80, 0.90], [0, 10]);
  
  // Combine rotations for Card 2
  const rotateX2 = useTransform([enterRotateX2, exitRotateX2], ([enter, exit]: number[]) => enter + exit);


  // CARD 3: DRIFTX
  // Enter: 0.80 -> 0.95 (Overlap)
  // Stay: 0.95 -> 1.0
  // GATE: Park at 100vh if < 0.7
  const rawY3 = useTransform(scrollYProgress, [0.80, 0.95], ['100vh', '0vh']);
  const y3 = useTransform(
    [scrollYProgress, isCard3Active] as any,
    ([v, active]: any[]) => active || v > 0.7 ? rawY3.get() : '100vh'
  );

  const rawScale3 = useTransform(scrollYProgress, [0.80, 0.95], [0.5, 1]);
  const scale3 = useTransform(
     [scrollYProgress, isCard3Active] as any,
     ([v, active]: any[]) => active || v > 0.7 ? rawScale3.get() : 0.5
  );

  const borderRadius3 = useTransform(scrollYProgress, [0.80, 0.95], ['20px', '0px']);
  const rawEnterRotateX3 = useTransform(scrollYProgress, [0.80, 0.95], [-10, 0]);
  const enterRotateX3 = useTransform(
     [scrollYProgress, isCard3Active] as any,
     ([v, active]: any[]) => active || v > 0.7 ? rawEnterRotateX3.get() : -10
  );

  // TILT CALCULATION
  // Reduced global tilt (was +/- 5, now +/- 2)
  const baseTiltRotateY = useTransform(smoothMouseX, [0, 1], [-2, 2]); 
  const baseTiltRotateX = useTransform(smoothMouseY, [0, 1], [2, -2]);
  
  // REDUCED TILT FOR CARD 3 (Minute effect)
  const baseTiltRotateY3 = useTransform(smoothMouseX, [0, 1], [0, 1]); 
  // Disable X-axis tilt (up/down) for Card 3 as requested
  const baseTiltRotateX3 = useTransform(smoothMouseY, [0, 1], [0, 0]);
  
  // Damping: Reduce tilt during transitions (approximate centers of transitions)
  // [0.05, 0.45, 0.60, 0.80, 0.90]
  const tiltStrength = useTransform(scrollYProgress, [0.05, 0.45, 0.60, 0.80, 0.90], [1, 0, 1, 0, 1]);
  
  const tiltRotateY = useTransform(
    [baseTiltRotateY, tiltStrength, enableTilt] as any, 
    ([rot, strength, enabled]: any[]) => enabled ? rot * strength : 0
  );
  const tiltRotateX = useTransform(
    [baseTiltRotateX, tiltStrength, card1Enabled] as any, 
    ([rot, strength, enabled]: any[]) => enabled ? rot * strength : 0
  );

  const tiltRotateY2 = useTransform( 
    [baseTiltRotateY, tiltStrength, card2Enabled] as any, 
    ([rot, strength, enabled]: any[]) => enabled ? rot * strength : 0
  );

  const tiltRotateY3 = useTransform(
    [baseTiltRotateY3, tiltStrength, enableTilt] as any, 
    ([rot, strength, enabled]: any[]) => enabled ? rot * strength : 0
  );
  const tiltRotateX3 = useTransform(
    [baseTiltRotateX3, tiltStrength, enableTilt] as any, 
    ([rot, strength, enabled]: any[]) => enabled ? rot * strength : 0
  );

  // Final Rotations
  const finalRotateY1 = useTransform([scrollRotateY, tiltRotateY], ([s, t]: number[]) => s + t);
  const finalRotateX1 = useTransform([tiltRotateX, exitRotateX1], ([t, e]: number[]) => t + e);
  
  const finalRotateY2 = tiltRotateY2; // Card 2 specific tilt
  const finalRotateX2 = useTransform([tiltRotateX, rotateX2], ([t, r]: number[]) => t + r);
  
  const finalRotateY3 = tiltRotateY3;
  const finalRotateX3 = useTransform([tiltRotateX3, enterRotateX3], ([t, e]: number[]) => t + e);

  // Parallax Transitions (Image moves 1/4 speed relative to Card Movement)
  // Card moves 100vh -> 0. Image should move -25vh -> 0 (Relative shift UP 25vh? No relative shift DOWN)
  // Actually, we established: Transition UP (0->0.2) => Image Relative DOWN (-75vh -> 0).
  // Transition DOWN (Exit) => Image Relative UP (0 -> 75vh).
  
  // Card 1 Exit Parallax (0.45 -> 0.60)
  const parallaxY1_Exit = useTransform(scrollYProgress, [0.45, 0.60], ['0vh', '75vh']);
  
  // Card 2 Parallax (Enter 0.45->0.60, Exit 0.80->0.90)
  const parallaxY2 = useTransform(scrollYProgress, [0.45, 0.60, 0.80, 0.90], ['-75vh', '0vh', '0vh', '75vh']);
  
  // Card 3 Parallax (Enter 0.80->0.95)
  const parallaxY3 = useTransform(scrollYProgress, [0.80, 0.95], ['-75vh', '0vh']);

  // Card 1 FG Composite: Popup (0.05->0.25) + Parallax Exit (0.45->0.60)
  // Original fgTranslateY: [0.08, 0.2] -> ['200%', '0%']
  // We need to map to: 0.05->200%, 0.25->0%, 0.45->0%, 0.60->75vh
  const fgParaY1 = useTransform(scrollYProgress, [0.05, 0.25, 0.45, 0.60], ['200%', '0%', '0%', '75vh']);

  // Red Vignette Transition Opacity
  // Card 1 Exit (0.45 -> 0.60)
  const transitionOpacity1 = useTransform(scrollYProgress, [0.45, 0.52, 0.60], [0, 1, 0]);
  
  // Card 2 Enter (0.45 -> 0.60) & Exit (0.80 -> 0.90)
  const transitionOpacity2 = useTransform(scrollYProgress, [0.45, 0.52, 0.60, 0.80, 0.85, 0.90], [0, 1, 0, 0, 1, 0]);

  // Card 3 Enter (0.80 -> 0.95)
  const transitionOpacity3 = useTransform(scrollYProgress, [0.80, 0.87, 0.95], [0, 1, 0]);

  // INTERACTION VARIANTS (Click & Hold)
  const overlayVariants = {
    rest: { opacity: 0 },
    pressed: { opacity: 1, transition: { duration: 0.2 } }
  };

  const disabledVariants = {
    rest: { opacity: 0 },
    pressed: { opacity: 0 }
  };

  const textVariants = {
    rest: { opacity: 0, y: 10 },
    pressed: { 
      opacity: 1, 
      y: 0, 
      transition: { delay: 0.2, duration: 0.3 } // Text fades in AFTER overlay appears
    }
  };

  const cardTitleVariants = {
    rest: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    pressed: { opacity: 0, y: 10, transition: { duration: 0.2 } }
  };

  // Cursor movements (Defined at top level to avoid hook errors)
  const cursorX = useTransform(smoothMouseX, [0, 1], ['0%', '100%']);
  const cursorY = useTransform(smoothMouseY, [0, 1], ['0%', '100%']);
  
  const cursorOpacity = useTransform(
      // Cast to any to avoid complex tuple type inference issues with Framer Motion hooks
      [isCard1Active, isCard2Active, isCard3Active] as any,
      ([a, b, c]: boolean[]) => (a || b || c) ? 1 : 0
  );

  // Card 1 MG Parallax & Scaling
  // Small (0-0.25) -> Expanded (0.25+) ... now starts at 0.08
  const mgBgSize = useTransform(scrollYProgress, [0.05, 0.25], ['100%', isMobile ? '150%' : '40%']);
  const mgBgPos = useTransform(scrollYProgress, [0.05, 0.25], ['center 90%', 'center 100%']);
  
  // Card 1 MG Parallax (X-axis)
  // "Slightly maybe .2" - interpreted as a subtle shift, e.g., 20px range
  const mgTranslateX1 = useTransform(smoothMouseX, [0, 1], ['20px', '-20px']);

  // Interaction Handlers using Custom Hook
  // UPDATED: Logic Fix - Play/Pause directly instead of relying on mount/unmount
  const bindCard1 = useLongPress(
    () => { // Start
      if (isCard1Active.get() && videoRef1.current) {
        setIsPressed1(true);
        videoRef1.current.play().catch(e => console.error("Playback failed", e));
      }
    },
    () => { // End/Cancel
      setIsPressed1(false);
      if (videoRef1.current) {
        videoRef1.current.pause();
        videoRef1.current.currentTime = 0; // Reset to start
      }
    }
  );

  const bindCard2 = useLongPress(
    () => {
      if (isCard2Active.get() && videoRef2.current) {
        setIsPressed2(true);
        videoRef2.current.play().catch(e => console.error("Playback failed", e));
      }
    },
    () => {
      setIsPressed2(false);
      if (videoRef2.current) {
        videoRef2.current.pause();
        videoRef2.current.currentTime = 0;
      }
    }
  );

  const bindCard3 = useLongPress(
    () => {
      if (isCard3Active.get() && videoRef3.current) {
        setIsPressed3(true);
        videoRef3.current.play().catch(e => console.error("Playback failed", e));
      }
    },
    () => {
      setIsPressed3(false);
      if (videoRef3.current) {
        videoRef3.current.pause();
        videoRef3.current.currentTime = 0;
      }
    }
  );

  // SINGLE DECODER STRATEGY: Keep videos mounted, just pause/reset
  // Sync Card 1 Video Logic
  useMotionValueEvent(isCard1Active, "change", (latest) => {
    if (latest === 0 && videoRef1.current) {
      videoRef1.current.pause();
      videoRef1.current.currentTime = 0;
    }
    // No 'else' needed - src is always present, so browser handles readiness
  });

  // Sync Card 2 Video Logic
  useMotionValueEvent(isCard2Active, "change", (latest) => {
    if (latest === 0 && videoRef2.current) {
      videoRef2.current.pause();
      videoRef2.current.currentTime = 0;
    }
  });

  // Sync Card 3 Video Logic
  useMotionValueEvent(isCard3Active, "change", (latest) => {
    if (latest === 0 && videoRef3.current) {
      videoRef3.current.pause();
      videoRef3.current.currentTime = 0;
    }
  });

  // Derived Overlay Opacity (MotionValues)
  const overlayOpacity1 = useTransform(isCard1Active, active => active ? 1 : 0);
  const overlayOpacity2 = useTransform(isCard2Active, active => active ? 1 : 0);
  const overlayOpacity3 = useTransform(isCard3Active, active => active ? 1 : 0);

  return (
    <div id="events" className={styles.container} ref={containerRef} onMouseMove={handleMouseMove}>
      <div className={styles.stickyWrapper}>

        <div className={styles.sectionTitle}>EVENTS</div>
        
        {/* CARD 1 - EXISTING */}
        <motion.div 
          className={styles.card}
          initial="rest"

          animate={isPressed1 ? "pressed" : "rest"}
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
            cursor: cursor1, 
          }}
          {...bindCard1}
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
                  backgroundImage: 'url("/images/FASHOIN/mg.png")',
                  y: parallaxY1_Exit,
                  x: mgTranslateX1,
                  backgroundSize: mgBgSize,
                  backgroundPosition: mgBgPos
              }} 
            />

            

            {/* RED VIGNETTE OVERLAY */}
            <motion.div 
              className={styles.transitionOverlay}
              style={{ opacity: transitionOpacity1 }}
            />

            {/* TITLE: Avante Garde */}
            <motion.div
              className={styles.cardTitle}
              variants={cardTitleVariants}
            >
              Avant Garde
            </motion.div>

            {/* OVERLAY & LOTTIE (Appears on Hold) - Conditional Rendering */}
            {/* OVERLAY & LOTTIE (Appears on Hold) - Persistent Rendering with CSS Toggle */}
              <motion.div 
                className={styles.cardOverlay} 
                animate={isPressed1 ? "pressed" : "rest"}
                variants={overlayVariants}
                style={{ 
                  pointerEvents: 'none',
                  clipPath: 'inset(0px 0px 0px 0px)', // Clip bottom 116px
                  background: 'transparent',
                   // Only show if active
                   opacity: overlayOpacity1 
                }} 
              >
                  {/* PRUNED & PRIMED - Always Rendered */}
                   <video
                     ref={videoRef1}
                     className={styles.videoPlayer}
                     src={isMobile ? "/animations/AvanteGrandeMobile.mp4" : "/animations/avantegarde.webm"}
                     muted
                     playsInline
                     preload="auto"
                     /* THIS LINE PREVENTS THE DOWNLOAD MENU */
                     onContextMenu={(e) => e.preventDefault()}
                     onEnded={() => window.location.href = "https://forms.gle/Coa4JuLtkRSimF9dA"}
                     style={{ 
                        // Instead of unmounting, we just hide it
                        opacity: isPressed1 ? 1 : 0,
                        transition: 'opacity 0.15s ease-out',
                        // Performance boost:
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)', 
                     }}
                   />
              </motion.div>

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
             cursor: cursor2,
          }}
          initial="rest"
          animate={isPressed2 ? "pressed" : "rest"}
          {...bindCard2}
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

             {/* TITLE: Deca Dance */}
             <motion.div
               className={styles.cardTitle}
               variants={cardTitleVariants}
             >
               Deca Dance
             </motion.div>

             {/* OVERLAY & LOTTIE FOR CARD 2 */}
             {/* OVERLAY & LOTTIE FOR CARD 2 - Persistent Rendering */}
              <motion.div 
                className={styles.cardOverlay} 
                animate={isPressed2 ? "pressed" : "rest"}
                variants={overlayVariants}
                style={{ 
                  pointerEvents: 'none',
                  clipPath: 'inset(0px 0px 0px 0px)',
                  background: 'transparent',
                  opacity: overlayOpacity2
                }} 
              >
                 {/* PRUNED & PRIMED - Always Rendered */}
                   <video
                     ref={videoRef2}
                     className={styles.videoPlayer}
                     src={isMobile ? "/animations/DecaDanceMobile.mp4" : "/animations/DecaDance.webm"}
                     muted
                     playsInline
                     preload="auto"
                     /* THIS LINE PREVENTS THE DOWNLOAD MENU */
                     onContextMenu={(e) => e.preventDefault()}
                     onEnded={() => window.location.href = "https://forms.gle/rjp241cqihhbvL7w9"}
                     style={{ 
                        opacity: isPressed2 ? 1 : 0,
                        transition: 'opacity 0.15s ease-out',
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)', 
                     }}
                   />
              </motion.div>
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
             cursor: cursor3,
          }}
          initial="rest"
          animate={isPressed3 ? "pressed" : "rest"}
          {...bindCard3}
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

             {/* TITLE: More Events */}
             <motion.div
               className={styles.cardTitle}
               variants={cardTitleVariants}
             >
               More Events
             </motion.div>

             {/* OVERLAY & LOTTIE FOR CARD 3 */}
             {/* OVERLAY & LOTTIE FOR CARD 3 - Persistent Rendering */}
              <motion.div 
                className={styles.cardOverlay} 
                animate={isPressed3 ? "pressed" : "rest"}
                variants={overlayVariants}
                style={{ 
                  pointerEvents: 'none',
                  clipPath: 'inset(0px 0px 0px 0px)',
                  background: 'transparent',
                  opacity: overlayOpacity3
                }} 
              >
                  {/* PRUNED & PRIMED - Always Rendered */}
                    <video
                      ref={videoRef3}
                      className={styles.videoPlayer}
                      src={isMobile ? "/animations/MoreEventsMobile.mp4" : "/animations/More Events.webm"}
                      muted
                      playsInline
                      preload="auto"
                      /* THIS LINE PREVENTS THE DOWNLOAD MENU */
                      onContextMenu={(e) => e.preventDefault()}
                      onEnded={() => window.location.href = "./events"}
                      style={{ 
                        opacity: isPressed3 ? 1 : 0,
                        transition: 'opacity 0.15s ease-out',
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)', 
                      }}
                    />
              </motion.div>
        </motion.div>

        {/* CUSTOM CURSOR (Only when Card 1 or Card 2 is full screen) */}
        {/* We use specific motion divs for cursors or just one that checks all? 
            Since we removed React State, we can't conditionally render. 
            We render it always, but control Opacity via MotionValue */}
        
        <motion.div 
            className={styles.customCursor}
            style={{
              left: cursorX,
              top: cursorY,
              // Show if ANY card is active and pressed? 
              // Actually we want "TAP AND HOLD" hint when active.
              // Logic: Opacity = 1 if (isCard1Active OR isCard2Active OR isCard3Active)
              opacity: cursorOpacity,
              // Also ensure it doesn't block clicks when invisible
              pointerEvents: 'none'
            }}
          >
            TAP AND HOLD
          </motion.div>

      </div>

      <div className={styles.nextContent}>
      
      </div>
    </div>
  );
}
