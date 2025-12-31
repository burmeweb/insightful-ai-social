// components/threejs/VoiceRoom3D.jsx
import { OrbitControls, Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Avatar3D from './Avatar3D';

export default function VoiceRoom3D({ users }) {
  return (
    <Canvas style={{ height: '400px', borderRadius: '10px' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {users.map((user, idx) => (
        <Avatar3D 
          key={user.id}
          position={[Math.cos(idx) * 3, 0, Math.sin(idx) * 3]}
          color={user.color}
          isSpeaking={user.isSpeaking}
        />
      ))}
      <OrbitControls />
      <Environment preset="sunset" />
    </Canvas>
  );
}
