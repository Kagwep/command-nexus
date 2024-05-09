import React from "react";
import Button from "@mui/material/Button";
import { keyframes } from "@mui/system";
import './gamestyles.css';
import SportsHandballIcon from '@mui/icons-material/SportsHandball';

const flickerKeyframes = keyframes({
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0.7,
  },
});

const flashButtonStyle = {
  animation: `${flickerKeyframes} 1000ms infinite alternate ease-in-out`,
};

const FlashButton: React.FC<{ btnText: string }> = ({ btnText }) => {
  return (

    <Button
      variant="contained"
      color="warning"
      className="flash-button"
      style={flashButtonStyle}
      sx={{fontSize:'10px',fontWeight:'bold'}}
    >
       <SportsHandballIcon fontSize="small" sx={{paddingLeft:1}}/> {btnText}
    </Button>

  );
};

export default FlashButton;

