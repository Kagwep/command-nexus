import React from 'react'
import Navbar from '../Navbar';
import '../../css/App.scss';
import Footer from '../Footer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import { battleRooms } from '../../data/battleRoomData';
import BattleRoomList from '../BattleRoom';


const BattleRoomPage = () => {
  return (
    <div>
    <Navbar />
      <BattleRoomList rooms={battleRooms}/>
    <Footer />
</div>
  )
}

export default BattleRoomPage