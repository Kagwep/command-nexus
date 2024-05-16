import React, { useEffect, useRef } from 'react';
import { GameScene } from './sceneSetup';
import "./style.css"
import { Players } from '../../../utils/commonGame';

export interface CanvasProps {
  players:Players[];
  room:string;
  orientation?:string;
  cleanup?:() => void;
  username:string;
  player_identity:string;
}


const Canvas:React.FC<CanvasProps> = ({ players, room,username,player_identity,cleanup }) => {

  console.log(players)


  const canvasRef = useRef<HTMLCanvasElement>(null);

      useEffect(() => {
        console.log('useEffect called');
        if (canvasRef.current) {
            console.log('Canvas element found');
            const game = new GameScene(canvasRef.current);
            game.renderLoop();
        } else {
            console.log('Canvas element not found');
        }
    }, []);


  return (
    <>

        <canvas ref={canvasRef} id="renderCanvas" className='canvas rounded-md'  ></canvas>

    </>
  )
}

export default Canvas