import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PlayerTurnProvider } from './components/Game/GameComponents/PlayerTurn.tsx';
import AppProvider from './providers/AppProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>

   <AppProvider>
      <PlayerTurnProvider>
        <App />
      </PlayerTurnProvider>
    </AppProvider>
  </React.StrictMode>,
)
