/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { createJournalEntry } from '@/lib/journal';

interface MintButtonProps {
  ipfsHash: string;
  onSuccess: () => void;
}

export function MintButton({ ipfsHash, onSuccess }: MintButtonProps) {
  const { isConnected } = useAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleMint = async () => {
    if (!isConnected || !ipfsHash) return;

    try {
      setIsMinting(true);
      const ipfsUri = ipfsHash;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();

      const tx = await createJournalEntry(signer, ipfsUri);
      setTxHash(tx.hash);

      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setIsConfirmed(true);
        onSuccess();
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint journal entry');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <button
      onClick={handleMint}
      disabled={!isConnected || isMinting || !ipfsHash}
      className={`px-6 py-2 rounded-md font-medium ${
        !isConnected || isMinting || !ipfsHash
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
      }`}
    >
      {isMinting
        ? 'Minting...'
        : isConfirmed
        ? 'Minted!'
        : 'Mint Journal NFT'}
    </button>
  );
}
