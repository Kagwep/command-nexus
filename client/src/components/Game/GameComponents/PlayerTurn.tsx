import React, { ReactNode,createContext, useContext, useState } from 'react';

interface PlayerTurnContextProps {
  playerTurn: string;
  setPlayerTurn: React.Dispatch<React.SetStateAction<string>>;
}

const PlayerTurnContext = createContext<PlayerTurnContextProps | undefined>(undefined);

interface PlayerTurnProviderProps {
    children: ReactNode;
  }
  
  export const PlayerTurnProvider: React.FC<PlayerTurnProviderProps> = ({ children }) => {
    const [playerTurn, setPlayerTurn] = useState<string>('');
  
    return (
      <PlayerTurnContext.Provider value={{ playerTurn, setPlayerTurn }}>
        {children}
      </PlayerTurnContext.Provider>
    );
  };

export const usePlayerTurn = () => {
  const context = useContext(PlayerTurnContext);
  if (!context) {
    throw new Error('usePlayerTurn must be used within a PlayerTurnProvider');
  }
  return context;
};
