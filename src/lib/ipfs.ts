/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Upload content to IPFS and return the CID
 * Note: In a production app, you'd typically use a service like Pinata, NFT.Storage, or Web3.Storage
 * This example uses a serverless function to handle the upload
 */
export async function uploadToIPFS(content: any): Promise<string> {
    try {
      // Convert object to JSON string if it's not already a string
      const contentData = typeof content === 'string' ? content : JSON.stringify(content);
      
      // Call our API route to handle the actual upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: contentData }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to upload to IPFS: ${response.statusText}`);
      }
  
      const data = await response.json();
      
      if (!data.cid) {
        throw new Error('No CID returned from IPFS upload');
      }
      
      return data.cid;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }
  
  /**
   * Get content from IPFS using a gateway
   */
  export async function getFromIPFS(cid: string): Promise<any> {
    try {
      // Remove ipfs:// prefix if present
      const cleanCid = cid.replace('ipfs://', '');
      
      // Using public IPFS gateway
      const gateway = 'https://ipfs.io/ipfs/';
      const response = await fetch(`${gateway}${cleanCid}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
      }
      
      // Try to parse as JSON, fall back to text if not valid JSON
      try {
        return await response.json();
      } catch (e) {
        return await response.text();
      }
    } catch (error) {
      console.error('Error fetching from IPFS:', error);
      throw error;
    }
  }