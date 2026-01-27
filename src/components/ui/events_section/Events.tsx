'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './Events.module.css';

export default function Events() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 1. SCROLL SETUP
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // --- ANIMATION MAPPING ---

  // PHASE 1: ENTER (0% -> 35%)
  // Slide up from bottom
  const y = useTransform(scrollYProgress, [0, 0.35], ['100vh', '0vh']);
  
  // Rotate from 90deg (Y-axis this time) to 0deg (facing user). 
  // 90deg Y means edge-on.
  const rotateY = useTransform(scrollYProgress, [0, 0.35], [90, 0]);
  
  // Opacity fade in for smoothness
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // PHASE 2: EXPAND (40% -> 80%)
  // Grow from card size to full viewport size
  const width = useTransform(scrollYProgress, [0.4, 0.8], ['60px', '100dvw']);
  const height = useTransform(scrollYProgress, [0.4, 0.8], ['40px', '100dvh']);
  
  // Remove border radius as it fills screen
  const borderRadius = useTransform(scrollYProgress, [0.4, 0.8], ['6px', '0px']);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.stickyWrapper}>
        
        {/* THE CARD */}
        <motion.div 
          className={styles.card}
          style={{
            y,
            rotateY,
            width,
            height,
            borderRadius,
            opacity
          }}
        >
            {/* BACKGROUND IMAGE - AUTO CROPPED BY PARENT DIMENSIONS */}
            {/* Using a simple div with background-size: cover handles the "crop then reveal" logic perfectly 
                as the parent aspect ratio changes from portrait (card) to landscape (screen). */}
            <div 
              className={styles.layerBg}
              style={{ 
                  backgroundImage: 'url("/images/FASHOIN/bg.png")',
              }} 
            />

            {/* CONTENT */}
            <motion.div 
              className={styles.textWrapper}
            >
               <h1 className={styles.title}>Avante Garde</h1>
               <p className={styles.subtitle}>FASHION EXTRAVAGANZA</p>
            </motion.div>

        </motion.div>

      </div>

      <div className={styles.nextContent}>
      
      </div>
    </div>
  );
}
