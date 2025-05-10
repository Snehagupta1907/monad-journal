import { http, createConfig } from 'wagmi';

import { farcasterFrame } from '@farcaster/frame-wagmi-connector';
import { monadTestnet } from 'viem/chains';

export const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  connectors: [
    farcasterFrame()
  ]
}); 