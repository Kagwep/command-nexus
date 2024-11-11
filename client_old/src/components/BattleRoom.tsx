import React, { useEffect,useState, useCallback}from 'react';
import socket from '../socket';
import { Players } from '../utils/commonGame';
import Canvas from './Game/Logic/CommandNexus';

// Define TypeScript interface for a Battle Room
interface BattleRoom {
    id: number;           // Unique identifier for the battle room
    name: string;         // Name of the battle room
    status: string;  // Status of the battle room, limited to 'Active' or 'Waiting'
    players: number;      // Current number of players in the room
    maxPlayers: number;   // Maximum number of players the room can accommodate
    description: string;  // Description of the battle room
}

interface BattleRoomProps {
    rooms: BattleRoom[];
}

const BattleRoomList: React.FC<BattleRoomProps> = ({ rooms }) => {


    const [username, setUsername] = useState("");
    const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  
    const [room, setRoom] = useState("sdsd");
    const [orientation, setOrientation] = useState("");
    const [players, setPlayers] = useState<Players[]>([]);
    const [players_identity, setPlayersIdentity] = useState<string>("");

  
    // resets the states responsible for initializing a game
    const cleanup = useCallback(() => {
      setRoom("");
      setOrientation("");
      setPlayers([]);
      setPlayersIdentity("");
    }, []);
  
    useEffect(() => {
      // const username = prompt("Username");
      // setUsername(username);
      // socket.emit("username", username);
  
      socket.on("opponentJoined", (roomData) => {
        console.log("roomData", roomData)
        setPlayers(roomData.players);
      });
    }, []);

    return (
        <>
        {/* {room ? (
            <Canvas
              room={room}
              orientation={orientation}
              username={username}
              players={players}
              player_identity={players_identity}
              // the cleanup function will be used by Game to reset the state when a game is over
              cleanup={cleanup}
            />
          ) : (


          )} */}
          <div className="max-w-screen-lg mx-auto  shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-bold text-slate-100 mb-4 ">Battle Rooms</h2>
            <div className="bg-cover bg-center" style={{ backgroundImage: 'url("https://res.cloudinary.com/dydj8hnhz/image/upload/v1714890212/hggdym2eguf38jws7lib.jpg")' }}>
                {rooms.map((room) => (
                    <div key={room.id} className="p-4 bg-white bg-opacity-80 rounded-md my-2 flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-2xl ">{room.name}</h3>
                            <p className='text-2xl'>Status: <span className={`text-${room.status === 'Active' ? 'green' : 'yellow'}-500`}>{room.status}</span></p>
                            <p className='text-2xl'>Players: {room.players}</p>
                        </div>
                        <button className="px-4 py-2 bg-slate-950 text-white rounded hover:bg-slate-600 transition duration-300 text-2xl">
                            Join Room
                        </button>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default BattleRoomList;
