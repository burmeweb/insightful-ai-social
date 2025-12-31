import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

const Avatar3D = ({ 
  position = [0, 0, 0], 
  color = '#3b82f6', 
  size = 1,
  isSpeaking = false,
  isOnline = true,
  name = 'User'
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
      
      // Speaking animation
      if (isSpeaking) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.1 : 1);
      }
      
      // Slow rotation
      meshRef.current.rotation.y += 0.005;
    }
  });
  
  useEffect(() => {
    if (isOnline) {
      const interval = setInterval(() => {
        setPulseScale(1.2);
        setTimeout(() => setPulseScale(1), 200);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isOnline]);
  
  return (
    <group position={position}>
      {/* Avatar sphere */}
      <mesh 
        ref={meshRef} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <MeshWobbleMaterial 
          color={color} 
          speed={1} 
          factor={hovered ? 0.2 : 0.1}
          emissive={hovered ? color : '#000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
      
      {/* Online status indicator */}
      {isOnline && (
        <mesh position={[size * 1.2, size * 0.8, 0]}>
          <sphereGeometry args={[size * 0.2, 16, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
        </mesh>
      )}
      
      {/* Speaking indicator */}
      {isSpeaking && (
        <mesh position={[0, size * 1.5, 0]}>
          <ringGeometry args={[size * 0.8, size, 32]} />
          <meshBasicMaterial 
            color="#ef4444" 
            side={THREE.DoubleSide}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
      
      {/* Name label */}
      <Text
        position={[0, -size * 1.5, 0]}
        fontSize={size * 0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {name}
      </Text>
    </group>
  );
};

export default Avatar3D;
