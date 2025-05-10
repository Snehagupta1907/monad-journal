'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {  getDefaultConfig, darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { http } from "viem";
import { monadTestnet } from "viem/chains";


const config = getDefaultConfig({
    appName: "RainbowKit demo",
    projectId: "6780ea76605adb8e2893655e41c392a3",
    chains: [monadTestnet],
    transports: {
      [monadTestnet.id]: http(),
    },
  });


const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider  theme={darkTheme({accentColor:"#372fa3"})} modalSize="wide">
        {children}
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
  );
}
