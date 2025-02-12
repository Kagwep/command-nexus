import { createContext, useContext, useState } from "react";

export type OnboardingContextType = {
    isOnboarded: boolean;
    completeOnboarding: () => void;
};

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Custom hook with proper error handling and typing
export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};


export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOnboarded, setIsOnboarded] = useState(false);

    const completeOnboarding = () => {
        setIsOnboarded(true);
       // localStorage.setItem('isOnboarded', 'true');
    };

    const value = {
        isOnboarded,
        completeOnboarding
    };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
};