
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import HomePage from './components/Pages/Index'
import Game from "./Game";
import ProfilesPage from './components/Pages/ProfilePages';
import MarketplacePage from './components/Pages/MarketplacePage';
import BattleRoomPage from './components/Pages/BattleRoomPage';
import LeaderBoardPage from './components/Pages/LeaderBoardPage';

import './App.css'


function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<HomePage />} />
        <Route path="/play" element={<Game />} />
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/battle-room" element={<BattleRoomPage />} />
        <Route path="/leader-board" element={<LeaderBoardPage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
