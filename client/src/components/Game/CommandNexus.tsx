import React, { useEffect, useRef } from 'react'
import { setupScene } from './CommandNexusScene';
import { Engine, Scene } from '@babylonjs/core';


const CommandNexus = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (canvasRef.current) {

        const engine = new Engine(canvasRef.current, true);

        let scene: Scene;

        const createScene = async () => {
            scene = new Scene(engine);
           
            await setupScene(scene, engine);
          };
      
          createScene();

            // Main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });

        // Resize handler
        window.addEventListener('resize', () => {
            engine.resize();
        });

    
        return () => {
            engine.dispose();
        };
      }
    }, []);
    
    return  <canvas ref={canvasRef} style={{ width: '100%', height: '100vh' }} />;
}

export default CommandNexus