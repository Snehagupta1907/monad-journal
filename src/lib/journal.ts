import { ethers } from 'ethers';

// Replace with your actual contract address
export const CONTRACT_ADDRESS = '0xE2654a34B262aB6399F22a7A75981f2E79DEfbD1';

// Contract ABI
export const CONTRACT_ABI = [
  'function createJournalEntry(string entryURI) public returns (uint256)',
  'function getTotalEntries() public view returns (uint256)',
  'function canMintToday(address user) public view returns (bool)',
  'function getAllEntries() public view returns (uint256[] memory, address[] memory)',
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
];

/**
 * Get contract instance with signer or provider
 */
function getContract(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

/**
 * Create a journal entry (write function)
 */
export async function createJournalEntry(
  signer: ethers.Signer,
  ipfsUri: string
): Promise<ethers.providers.TransactionResponse> {
  const contract = getContract(signer);
  console.log({ contract, ipfsUri });

  // Call the createJournalEntry function with the IPFS URI
  const tx = await contract.createJournalEntry(ipfsUri);
  await tx.wait(); // Wait for confirmation
  return tx;
}

/**
 * Get total number of journal entries (read function)
 */
export async function getTotalEntries(provider: ethers.providers.Provider): Promise<number> {
  const contract = getContract(provider);
  const total = await contract.getTotalEntries();
  return total.toNumber();
}

/**
 * Interface for token metadata
 */
export interface TokenMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
}

/**
 * Interface for journal entry
 */
export interface JournalEntry {
  tokenId: number;
  minter: string;
  tokenURI: string;
  metadata?: TokenMetadata;
}

/**
 * Get all journal entries with their metadata
 */
export async function getAllEntries(provider: ethers.providers.Provider): Promise<JournalEntry[]> {
  const contract = getContract(provider);
  const [tokenIds, minters] = await contract.getAllEntries();

  const entries: JournalEntry[] = [];
  
  for (let i = 0; i < tokenIds.length; i++) {
    const tokenId = tokenIds[i].toNumber();
    const uri = await contract.tokenURI(tokenId);
    
    const entry: JournalEntry = {
      tokenId,
      minter: minters[i],
      tokenURI: uri
    };
    
    // Try to fetch and parse metadata
    try {
      entry.metadata = await fetchTokenMetadata(uri);
    } catch (error) {
      console.error(`Failed to fetch metadata for token ${tokenId}:`, error);
    }
    
    entries.push(entry);
  }

  return entries;
}

/**
 * Fetch and parse token metadata from URI
 */
export async function fetchTokenMetadata(uri: string): Promise<TokenMetadata> {
  // Handle IPFS URIs
  const url = uri.startsWith('ipfs://') ? getIPFSUrl(uri) : uri;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch metadata: ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Fetch a single journal entry by token ID
 */
export async function getJournalEntry(
  provider: ethers.providers.Provider,
  tokenId: number
): Promise<JournalEntry> {
  const contract = getContract(provider);
  
  // Get the token URI
  const uri = await contract.tokenURI(tokenId);
  
  // Get the token minter (owner might be different if transferred)
  const [, minters] = await contract.getAllEntries();
  const tokenIds = await contract.getAllEntries().then(([ids]) => ids.map((id: ethers.BigNumber) => id.toNumber()));
  const index = tokenIds.indexOf(tokenId);
  const minter = index !== -1 ? minters[index] : ethers.constants.AddressZero;
  
  const entry: JournalEntry = {
    tokenId,
    minter,
    tokenURI: uri
  };
  
  // Try to fetch and parse metadata
  try {
    entry.metadata = await fetchTokenMetadata(uri);
  } catch (error) {
    console.error(`Failed to fetch metadata for token ${tokenId}:`, error);
  }
  
  return entry;
}

/**
 * Check if a user can mint today (read function)
 */
export async function canMintToday(
  provider: ethers.providers.Provider,
  userAddress: string
): Promise<boolean> {
  const contract = getContract(provider);
  return await contract.canMintToday(userAddress);
}

/**
 * Format an Ethereum address to short readable form
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Format a date string in 'MMM DD, YYYY' format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    console.error('Invalid date format:', e);
    return dateString;
  }
}

/**
 * Get a public IPFS gateway URL from a CID or IPFS URI
 */
export function getIPFSUrl(cidOrUri: string): string {
  return `https://ipfs.io/ipfs/${cidOrUri.replace('ipfs://', '')}`;
}

/**
 * Extract date from metadata attributes
 */
export function getEntryDate(metadata?: TokenMetadata): string {
  if (!metadata || !metadata.attributes) return '';
  
  const dateAttribute = metadata.attributes.find(attr => attr.trait_type === 'Date');
  return dateAttribute ? String(dateAttribute.value) : '';
}

/**
 * Get todo stats from metadata attributes
 */
export function getTodoStats(metadata?: TokenMetadata): { total: number, completed: number } {
  if (!metadata || !metadata.attributes) return { total: 0, completed: 0 };
  
  const totalAttr = metadata.attributes.find(attr => attr.trait_type === 'Todo Count');
  const completedAttr = metadata.attributes.find(attr => attr.trait_type === 'Completed Todos');
  
  return {
    total: totalAttr ? Number(totalAttr.value) : 0,
    completed: completedAttr ? Number(completedAttr.value) : 0
  };
}

/**
 * Usage example:
 * 
 * // Get all entries with metadata
 * const entries = await getAllEntries(provider);
 * 
 * // Display entries
 * entries.forEach(entry => {
 *   console.log(`Entry #${entry.tokenId} by ${formatAddress(entry.minter)}`);
 *   if (entry.metadata) {
 *     console.log(`  Title: ${entry.metadata.name}`);
 *     console.log(`  Description: ${entry.metadata.description}`);
 *     console.log(`  Date: ${getEntryDate(entry.metadata)}`);
 *     const { total, completed } = getTodoStats(entry.metadata);
 *     console.log(`  Todos: ${completed}/${total} completed`);
 *   }
 * });
 */