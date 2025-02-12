import { createContext, useContext, ReactNode } from 'react';
import { SDK } from '@dojoengine/sdk';
import { CommandNexusSchemaType } from '../dojogen/models.gen';

interface SDKContextType {
  sdk: SDK<CommandNexusSchemaType>;
}

const SDKContext = createContext<SDKContextType | undefined>(undefined);

interface SDKProviderProps {
  sdk: SDK<CommandNexusSchemaType>;
  children: ReactNode;
}

export function SDKProvider({ sdk, children }: SDKProviderProps) {
  return (
    <SDKContext.Provider value={{ sdk }}>
      {children}
    </SDKContext.Provider>
  );
}

export function useSDK() {
  const context = useContext(SDKContext);
  if (context === undefined) {
    throw new Error('useSDK must be used within an SDKProvider');
  }
  return context.sdk;
}