'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {  darkTheme, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, WagmiProvider } from "wagmi";
import { http } from "viem";
import { monadTestnet } from "viem/chains";
import { createStorage } from 'wagmi';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';

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
