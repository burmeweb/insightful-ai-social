import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Stars,
  Sparkles,
  Text3D,
  Center
} from '@react-three/drei';
import Avatar3D from './Avatar3D';
import * as THREE from 'three';

const Room = ({ participants = [] }) => {
  const positions = [
    [-3, 0, -3],
    [3, 0, -3],
    [-3, 0, 3],
    [3, 0, 3],
    [0, 0, -5],
    [-5, 0, 0],
    [5, 0, 0],
    [0, 0, 5]
  ];
  
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];
  
  return (
    <>
      {/* Room floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#1f2937"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Room walls */}
      <mesh position={[0, 2.5, -10]}>
        <boxGeometry args={[20, 8, 0.5]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      
      {/* Participants */}
      {participants.map((participant, idx) => (
        <Avatar3D
          key={participant.id}
          position={positions[idx % positions.length]}
          color={colors[idx % colors.length]}
          size={0.8}
          isSpeaking={participant.isSpeaking}
          isOnline={participant.isOnline}
          name={participant.name}
        />
      ))}
      
      {/* Voice waves */}
      <Sparkles count={100} scale={10} size={2} speed={0.3} />
      
      {/* Room title */}
      <Center position={[0, 5, -9]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          Voice Chat
          <meshNormalMaterial />
        </Text3D>
      </Center>
    </>
  );
};

const VoiceRoom3D = ({ participants = [], style = {} }) => {
  return (
    <div className="w-full h-96 rounded-xl overflow-hidden" style={style}>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50 }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          <pointLight position={[-10, 10, -10]} intensity={0.5} />
          
          <Room participants={participants} />
          
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            minDistance={5}
            maxDistance={20}
          />
          
          <Environment preset="city" />
          <Stars radius={100} depth={50} count={5000} factor={4} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default VoiceRoom3D;
