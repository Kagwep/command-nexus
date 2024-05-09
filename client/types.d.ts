import { type MetaMaskInpageProvider } from "@metamask/providers";

declare global {
    interface window{
        ethereum:MetaMaskInpageProvider;
    }
    
}

