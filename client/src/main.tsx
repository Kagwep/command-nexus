import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PlayerTurnProvider } from './components/Game/GameComponents/PlayerTurn.tsx';
import { WalletProvider } from './contexts/WalletContex.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>

   <WalletProvider>
      <PlayerTurnProvider>
        <App />
      </PlayerTurnProvider>
    </WalletProvider>
  </React.StrictMode>,
)
