'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletConnect() {
  return (
    <ConnectButton 
      showBalance={false}
      chainStatus="none"
      label="Connect Wallet"
    />
  );
}