"use client"
import { WagmiProvider } from 'wagmi';
import { config } from '@/config/farcaster';
import { useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk';

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
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
      {children}
     </WagmiProvider>
  );
} 