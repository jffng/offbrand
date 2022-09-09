import React, { useRef, Suspense, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber' //i had to re install this..idk why
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextureLoader } from "three"
import { Html, useProgress } from '@react-three/drei';

import rainyWindow from './assets/rainy-window.jpg';
import background from './assets/background.webp';
import { ReactComponent as Text } from './assets/text.svg';
import mp3 from './assets/took-a-trip.mp3';
import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';

function Loader( { setLoaded } ) {
  const { loaded } = useProgress();

  useEffect( () => {
    setLoaded( loaded );
  }, [ setLoaded, loaded ])
  return (
    <Html center>
      <h2 style={{color: 'white', textAlign: 'center', letterSpacing: '0.02em', fontSize: '3rem'}}>LOADING STUFF</h2>
    </Html>)
}

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

      // mesh.current.material.uniforms.u_db.value = Math.max(0.3, Math.sqrt(sumSquares / pcmData.length) )
      mesh.current.material.uniforms.u_db.value = Math.min( Math.max(0.3, Math.sqrt(sumSquares / pcmData.length)), .5);
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

function UI( { playHandler, isPlaying }) { 
  return (
    <div className="ui-container">
        <Text style={{
          width: 'calc( 100% - 4rem )',
          maxHeight: 'calc( 100% - 4rem)'

        }}/>
        <button id='play-button' onClick={playHandler}>{ isPlaying ? 'Stop' : 'Play' }</button>
        <a id='bandcamp-link' rel="noreferrer" href='https://offbrandnyc.bandcamp.com' target="_blank">buy 🔗</a>
    </div>
  )
}

function App() {
  const song = useRef( new Audio( mp3) );
  const ctx = useRef( new ( window.AudioContext || window.webkitAudioContext)() );
  
  const [ isPlaying, setIsPlaying ] = useState( false );
  const [ analyser, setAnalyser ] = useState( null );
  const [ isLoaded, setIsLoaded ] = useState( false );

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

    //connect analayser to source
    const analyser = ctx.current.createAnalyser();
    src.connect( analyser );
    analyser.connect(ctx.current.destination);
    setAnalyser( analyser );
  },[ ]);

  return (
    <main style={{ width: '100vw', height: '100vh', backgroundColor: '#1B1B1B', backgroundImage:`url(${background}`, backgroundSize: 'cover'}}>
      <Canvas camera={{ position: [-0.3, -0.05, 0.8] }}>
        <Suspense fallback={<Loader setLoaded={setIsLoaded} />}>
          <CameraController />
          <Scene isPlaying={isPlaying} analyser={analyser}/>
        </Suspense>
      </Canvas>
        { isLoaded && <UI isPlaying={isPlaying} playHandler={playHandler}/> }
    </main>
  );
}

export default App;
