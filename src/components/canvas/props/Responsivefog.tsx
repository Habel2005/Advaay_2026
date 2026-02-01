// src/components/canvas/helpers/ResponsiveFog.tsx
'use client';
import { useThree } from '@react-three/fiber';

export function ResponsiveFog() {
  const { width } = useThree((state) => state.viewport);
  
  // Logic remains the same, but now it's encapsulated
  const isMobile = width < 2.5;
  const isTablet = width >= 2.5 && width < 6;

  let fogNear = 14;
  let fogFar = 16.5;

  if (isMobile || isTablet) {
    fogNear = 12;
    fogFar = 14;
  } 

  return <fog attach="fog" args={['black', fogNear, fogFar]} />;
}