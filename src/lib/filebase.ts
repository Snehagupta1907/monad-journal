"use server"
import { FilebaseClient } from "@filebase/client";

const GATEWAY = "ipfs.filebase.io";
const filebaseClientImage = new FilebaseClient({
    token: process.env.FILEBASE_API_KEY
});

export const uploadToIPFS = async (fileBuffer: Buffer | string): Promise<string | null> => {
    try {

        const content = new Blob([fileBuffer]);
        const cid = await filebaseClientImage.storeBlob(content);

        const imageUrlOnIPFS = `https://${GATEWAY}/ipfs/${cid}`;
        console.log("Uploaded Image IPFS URL:", imageUrlOnIPFS);
        return imageUrlOnIPFS;
    } catch (error) {
        console.error("Error uploading image to IPFS:", error);
        return null;
    }
};

export const uploadImageToIPFS = async (base64String: string): Promise<string | null> => {
    try {
      const buffer = Buffer.from(base64String, 'base64');
      const blob = new Blob([buffer]);
      const cid = await filebaseClientImage.storeBlob(blob);
      return `https://${GATEWAY}/ipfs/${cid}`;
    } catch (error) {
      console.error("Error uploading image to IPFS:", error);
      return null;
    }
  };
  