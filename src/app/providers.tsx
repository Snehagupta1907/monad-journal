'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {   lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, WagmiProvider } from "wagmi";
import { http } from "viem";
import { monadTestnet } from "viem/chains";
import { createStorage } from 'wagmi';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';
import { useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk';

const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  storage: createStorage({ storage: typeof window !== 'undefined' ? window.localStorage : undefined }),
  connectors: [
    farcasterFrame()
  ]
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const init = async () => {
      try {
        // Hide splash screen when app is ready
        await sdk.actions.ready();
      } catch (error) {
        console.error('Failed to initialize Farcaster:', error);
      }
    };

    init();
  }, []);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={lightTheme({
            accentColor: "#6c54f8",
            accentColorForeground: "white",
            borderRadius: "medium",
          })} 
          modalSize="wide"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
