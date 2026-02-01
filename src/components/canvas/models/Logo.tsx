'use client';
import { memo, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

// Added canPlay prop to control when GSAP timeline starts
export const Logo = memo(function Logo({ canPlay = false, ...props }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { nodes } = useGLTF('/models/logo-transformed.glb') as any;
  const { width } = useThree((state) => state.viewport);

  const isMobile = width < 2.5;
  const isTablet = width >= 2.5 && width < 6;

  let responsiveScale = 20; 
  let responsivePosition: [number, number, number] = [0, 0, 0];

  if (isMobile) {
    responsiveScale = 9; 
    responsivePosition = [0, 0, -2]; 
  } else if (isTablet) {
    responsiveScale = 12;
    responsivePosition = [0, 0, -1];
  } 

  useEffect(() => {
    // Only run the GSAP timeline when canPlay is true
    if (!canPlay || !meshRef.current) return;

    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    
    // Initial State: Invisible and cold
    mat.transparent = true;
    mat.opacity = 0;
    mat.emissiveIntensity = 0;

    // Reduced delay since AppWrapper already handles the video wait
    const tl = gsap.timeline({ delay: 3 });

    // 2. The Fade In Animation
    tl.to(mat, {
      opacity: 1,
      duration: 2.5,
      ease: "power2.inOut",
    })
    // 3. The "Ignition" - Overlap set to -=2.5 to start with the fade
    .to(mat, {
      emissiveIntensity: 3,
      duration: 1.5,
      ease: "expo.out",
    }, "-=2") 
    // 4. Settle to steady glow
    .to(mat, {
      emissiveIntensity: 1,
      duration: 2,
      ease: "power2.in",
    });

    return () => { tl.kill(); };
  }, [nodes, canPlay]); // canPlay added to dependencies

  if (!nodes || !nodes.Cube003) return null;

  return (
    <group {...props} dispose={null} scale={responsiveScale} position={responsivePosition}>
      <mesh 
        ref={meshRef} 
        geometry={nodes.Cube003.geometry} 
        position={[0, 0, 0.024]} 
        rotation={[0, 0, 0.937]} 
        scale={[0.034, 0.007, 0.008]}
      >
        <meshStandardMaterial 
          color="#d30707" // Fixed hex format
          emissive="#ffffff" 
          emissiveIntensity={0} 
          toneMapped={false} 
          transparent
          depthTest={true}
          depthWrite={true}
        />
      </mesh>
    </group>
  );
});

useGLTF.preload('/models/logo-transformed.glb');