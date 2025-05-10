/**
 * Represents a single todo item
 */
export interface Todo {
    id: number;
    text: string;
    completed: boolean;
  }
  
  /**
   * Represents a full journal entry
   */
  export interface JournalEntry {
    title: string;
    content: string;
    date: string;
    author: string;
    timestamp: number;
  }
  
  /**
   * Represents an NFT journal entry with token data
   */
  export interface JournalNFT extends JournalEntry {
    tokenId: number;
    ipfsUri: string;
    transactionHash: string;
  }
  
  /**
   * Contract type for our Builder Journal NFT
   */
  export interface BuilderJournalNFT {
    createJournalEntry: (entryURI: string) => Promise<number>;
    getTotalEntries: () => Promise<number>;
    canMintToday: (address: string) => Promise<boolean>;
  }
  
  /**
   * NFT Metadata format for storing on IPFS
   */
  export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    external_url?: string;
    attributes: {
      trait_type: string;
      value: string | number;
    }[];
  }