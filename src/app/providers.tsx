'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { http } from "viem";
import { monadTestnet } from "viem/chains";
import { createStorage } from 'wagmi';

const config = getDefaultConfig({
  appName: "Monad Journal",
  projectId: "6780ea76605adb8e2893655e41c392a3",
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  storage: createStorage({ storage: typeof window !== 'undefined' ? window.localStorage : undefined }),
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
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
