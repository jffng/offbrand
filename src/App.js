import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber' //i had to re install this..idk why
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextureLoader } from "three"

import rainyWindow from './assets/rainy-window.jpg';
import mp3 from './assets/took-a-trip.mp3';
import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);

      controls.minDistance = 0.5;
      controls.maxDistance = 10;
      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return null;
};

function Scene( { isPlaying, analyser, setDb } ) {
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
      u_db: {
        type: "f",
        value: 0.001
      },
      u_image: { 
        type: "t",
        value: imageTexture
      }
    }), [ imageTexture ]
  );

  useFrame((state) => {
    const { clock } = state;
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();

    if ( analyser ){
      const pcmData = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(pcmData);
      let sumSquares = 0.0;
      for (const amplitude of pcmData) { sumSquares += amplitude*amplitude; }
      // nums.reduce((a, b) => (a + b)) / nums.length;

      // setDb( Math.sqrt(sumSquares / pcmData.length) );
      mesh.current.material.uniforms.u_db.value = Math.max(0.3, Math.sqrt(sumSquares / pcmData.length) )
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]} scale={1.0}>
      <planeGeometry attach="geometry" args={[1, 1,16, 16]} />
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
  const song = useRef( new Audio( mp3) );
  const ctx = useRef( new ( window.AudioContext || window.webkitAudioContext)() );
  
  const [ isPlaying, setIsPlaying ] = useState( false );
  const [ source, setSource ] = useState( null );
  const [ analyser, setAnalyser ] = useState( null );
  const [ db, setDb ] = useState( 0 );

  const playHandler = () => {
    if ( ! isPlaying || song.current.paused ) {
      song.current.play();
      ctx.current.resume();
      setIsPlaying( true );
    } else {
      song.current.pause();
      setIsPlaying( false );
    }
  }

  useEffect(() => {
    const src = ctx.current.createMediaElementSource( song.current );
    setSource( src );

    //connect analayser to source
    const analyser = ctx.current.createAnalyser();
    src.connect( analyser );
    analyser.connect(ctx.current.destination);
    setAnalyser( analyser );
  },[ ]);

  return (
    <main style={{ width: '100vw', height: '100vh', backgroundColor: '#1B1B1B', backgroundImage:`url(${rainyWindow}`}}>
      <Canvas camera={{ position: [0.0, 0.0, 0.7] }}>
        <CameraController />
        <Scene isPlaying={isPlaying} analyser={analyser} setDb={setDb}/>
      </Canvas>
      <div className="player-container">
        <button onClick={playHandler}>Play/Pause</button>
      </div>
    </main>
  );
}

export default App;
