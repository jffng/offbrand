import ReactDOM from 'react-dom'
import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber' //i had to re install this..idk why
import { TextureLoader, Uniform } from "three"
import rainyWindow from './assets/rainy-window.jpg';
import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';

function Scene() {
  const imageTexture = useLoader(TextureLoader, rainyWindow);
  const mesh = useRef();

  //added the type and value for all the uniforms bc shaders are annoying
  const uniforms = useMemo(
    () => ({
      u_time: {
        type: "f",
        value: 0.0
      },
      u_size: {
        type: "f",
        value: 1.0
      },
      u_image: { 
        type: "t",
        value: imageTexture
      }
    }), []
  );

  useFrame((state) => {
    const { clock } = state;
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]} scale={1.0}>
      <planeGeometry attach="geometry" args={[1, 1, 16, 16]} />
      <shaderMaterial
        attach="material"
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  )
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#1B1B1B'}}>
      <Canvas camera={{ position: [1.0, 1.0, 1.0] }}>
        <Scene/>
      </Canvas>
    </div>
  );
}

export default App;
