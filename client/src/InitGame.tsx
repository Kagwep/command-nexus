import { Button, Stack, TextField } from "@mui/material";
import React,{ useState } from "react";
import CustomDialog from "./components/Customs/CustomDialog";
import socket from './socket';
import { Players } from "./utils/commonGame";



export interface ServerJoinRoomResponse {
  error?: any;
  message?: string;
  roomId?: string;
  players?: string[];
}


export interface InitGameProps {
    setRoom:React.Dispatch<React.SetStateAction<string>>;
    setOrientation:React.Dispatch<React.SetStateAction<string>>;
    setPlayers:React.Dispatch<React.SetStateAction<Players[]>>;
    setPlayersIdentity:React.Dispatch<React.SetStateAction<string>>;
    
}

const InitGame: React.FC<InitGameProps> = ({ setRoom, setOrientation, setPlayers,setPlayersIdentity }) => {

  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomInput, setRoomInput] = useState(''); // input state
  const [roomError, setRoomError] = useState('');
 


  const handleCreateRoom = () => {
    socket.emit("createRoom", (r: React.SetStateAction<string>) => {
      console.log(r);
      setRoom(r);
      setOrientation("white");
      setPlayersIdentity('player-1')

    });
  };



  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{ py: 1, height: "100vh" }}
    >
      <CustomDialog
        open={roomDialogOpen}
        handleClose={() => setRoomDialogOpen(false)}
        title="Select Room to Join"
        contentText="Enter a valid room ID to join the room"
        handleContinue={() => {
            // join a room
            if (!roomInput) return; // if given room input is valid, do nothing.
            socket.emit("joinRoom", { roomId: roomInput }, (r: { error: any; message: React.SetStateAction<string>; roomId: React.SetStateAction<string>; players: React.SetStateAction<Players[]>; }) => {
              // r is the response from the server
              if (r.error) return setRoomError(r.message); // if an error is returned in the response set roomError to the error message and exit
              console.log("response:", r);
              setRoom(r?.roomId); // set room to the room ID
              setPlayers(r?.players); // set players array to the array of players in the room
              setOrientation("black"); // set orientation as black
              setRoomDialogOpen(false); // close dialog
              setPlayersIdentity('player-2')
            });
          }}
      >
        <TextField
          autoFocus
          margin="dense"
          id="room"
          label="Room ID"
          name="room"
          value={roomInput}
          required
          onChange={(e) => setRoomInput(e.target.value)}
          type="text"
          fullWidth
          variant="standard"
          error={Boolean(roomError)}
          helperText={!roomError ? 'Enter a room ID' : `Invalid room ID: ${roomError}` }
        />
      </CustomDialog>
      {/* Button for starting a game */}
      <Button
        variant="contained"
        onClick={handleCreateRoom
        }
      >
        Start a game
      </Button>
      {/* Button for joining a game */}
      <Button
        onClick={() => {
          setRoomDialogOpen(true)
        }}
      >
        Join a game
      </Button>

     

    </Stack>
  );
}

export default InitGame;