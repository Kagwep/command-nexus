import { useState,useCallback,useEffect } from "react";
import { TextField } from "@mui/material";
import Canvas from "./components/Game/Logic/CommandNexus";
import socket from './socket';
import CustomDialog from "./components/Customs/CustomDialog";
import InitGame from "./InitGame";
import { Players } from "./components/Game/Logic/CommandNexus";


function Game() {

    const [username, setUsername] = useState("");
    const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  
    const [room, setRoom] = useState("");
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
  
    return  (
        <>
          <CustomDialog
            open={!usernameSubmitted}
            handleClose={() => setUsernameSubmitted(true)}
            title="Pick a username"
            contentText="Please select a username"
            handleContinue={() => {
              if (!username) return;
              socket.emit("username", username);
              setUsernameSubmitted(true);
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="Username"
              name="username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              fullWidth
              variant="standard"
            />
          </CustomDialog>
          {room ? (
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
            <InitGame
              setRoom={setRoom}
              setOrientation={setOrientation}
              setPlayers={setPlayers}
              setPlayersIdentity={setPlayersIdentity}
            />
          )}
        </>
      );
}

export default Game;