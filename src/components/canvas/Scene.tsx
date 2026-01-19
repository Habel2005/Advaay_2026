'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Stars } from '@react-three/drei';

function InteractiveStars() {
  const starsRef = useRef<THREE.Group>(null);
  
  // useFrame runs every single frame
  useFrame((state) => {
    if (!starsRef.current) return;

    // state.pointer gives us x and y coordinates from -1 to 1
    // We calculate the target rotation based on mouse position
    const targetRotationX = state.pointer.y * 0.2; 
    const targetRotationY = state.pointer.x * 0.2;

    // "Lerp" (Linear Interpolation) makes the movement smooth and "heavy"
    starsRef.current.rotation.x = THREE.MathUtils.lerp(
      starsRef.current.rotation.x,
      targetRotationX,
      0.05
    );
    starsRef.current.rotation.y = THREE.MathUtils.lerp(
      starsRef.current.rotation.y,
      targetRotationY,
      0.05
    );
  });

  return (
    <group ref={starsRef}>
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />
    </group>
  );
}

export default function Scene() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <InteractiveStars />
      </Canvas>
    </div>
  );
}