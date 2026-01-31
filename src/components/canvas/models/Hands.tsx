// src/components/canvas/models/Hands.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface HandsProps {
  canPlay?: boolean; // New prop to control when animations can start
}

export function Hands({ canPlay = false, ...props }: HandsProps) {
  const group = useRef<any>(null);
  const { nodes, animations } = useGLTF('/models/hands_iridescent-transformed.glb') as any;
  const { actions } = useAnimations(animations, group);
  const [ready, setReady] = useState(false);

  const { width } = useThree((state) => state.viewport);
  const isMobile = width < 2.5;
  const isTablet = width >= 2.5 && width < 6;

  let responsiveScale = isMobile ? 9 : isTablet ? 12 : 20;
  let responsivePosition: [number, number, number] = isMobile ? [0, 0, -2] : isTablet ? [0, 0, -1] : [0, 0, 0];

  useEffect(() => {
    // Only play animations when canPlay is true
    if (!canPlay) return;

    const intro = actions['intro'];
    const twitch = actions['twitch'];

    if (intro) {
      intro.reset().setLoop(THREE.LoopOnce, 1);
      intro.clampWhenFinished = true;
      intro.play();
      setReady(true);
    }

    let twitchTimeout: NodeJS.Timeout;
    const playRandomTwitch = () => {
      if (twitch) twitch.reset().setLoop(THREE.LoopOnce, 1).fadeIn(0.3).play();
      twitchTimeout = setTimeout(playRandomTwitch, Math.random() * 6000 + 4000);
    };

    const startTimer = setTimeout(playRandomTwitch, 5000);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(twitchTimeout);
    };
  }, [actions, canPlay]); // Added canPlay to dependency array

  if (!nodes) return null;

  return (
    <group ref={group} visible={ready} {...props} dispose={null} scale={responsiveScale} position={responsivePosition}>
      <primitive object={nodes.Scene} />
    </group>
  );
}

useGLTF.preload('/models/hands_iridescent-transformed.glb');