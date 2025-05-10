'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { MintButton } from './MintButton';
import { JournalEntry } from '@/types/journal';
import { uploadImageToIPFS, uploadToIPFS } from '@/lib/filebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Notebook, Sparkles, Calendar, Upload, Image, Loader2, Check, RefreshCw, Link } from 'lucide-react';

// File to array buffer conversion
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function EntryForm() {
  const { address, isConnected } = useAccount();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Set today's date when component loads
  useEffect(() => {
    const today = new Date();
    setDate(today.toISOString().split('T')[0]);
  }, []);

  // Create preview URL when image is selected
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const prepareJournalData = async () => {
    if (!title || !content) {
      alert('Please add a title and content for your journal entry');
      return null;
    }

    const entryData: JournalEntry = {
      title,
      content,
      date,
      author: address || '0x0',
      timestamp: Date.now(),
      portfolioUrl, // Add the portfolio URL to the journal data
    };

    return entryData;
  };

  const handlePrepareForMint = async () => {
    try {
      setIsUploading(true);
      const entryData = await prepareJournalData();

      if (!entryData) {
        setIsUploading(false);
        return;
      }

      let imageUrl = 'https://placekitten.com/400/400'; // fallback

      // Upload selected image to IPFS
      if (imageFile) {
        // Convert to base64 string first to avoid Uint8Array serialization issues
        const base64Data = await fileToBase64(imageFile);
        console.log("Converting image to base64 for upload");
        // const imageBuffer = Buffer.from(base64Data, 'base64');
        const imageHash = await uploadImageToIPFS(base64Data);
        imageUrl = imageHash || "https://placekitten.com/400/400";
      }

      // Use portfolio URL if available, otherwise use default
      const externalUrl = portfolioUrl 
        ? portfolioUrl 
        : null;

      const metadata = {
        name: entryData.title,
        description: entryData.content.substring(0, 100) + '...',
        image: imageUrl,
        external_url: externalUrl,
        attributes: [
          {
            trait_type: 'Date',
            value: entryData.date,
          },
        ],
      };

      const metadataHash = await uploadToIPFS(JSON.stringify(metadata));
      setIpfsHash(metadataHash);
      setSuccess(true);
      
      // Reset success status after animation completes
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error preparing metadata:', error);
      alert('Failed to prepare metadata');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setContent('');
    setDate(new Date().toISOString().split('T')[0]);
    setPortfolioUrl('');
    setImageFile(null);
    setPreviewUrl(null);
    setIpfsHash(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-3 sm:p-6 md:p-8 w-full max-w-4xl mx-auto my-4 sm:my-8 border-2 border-violet-100 dark:border-violet-900"
      style={{ 
        background: "linear-gradient(to bottom right, #ffffff, #f3f0ff)",
        boxShadow: "0 10px 25px rgba(108, 84, 248, 0.15)" 
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-center gap-2 mb-4 sm:mb-6 md:mb-8"
        variants={itemVariants}
      >
        <Notebook size={20} className="text-[#6c54f8] sm:size-8 md:size-12" />
        <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-[#6c54f8]">
          Today&apos;s Builder Journal
        </h2>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles size={16} className="text-violet-400 sm:size-8 md:size-12" />
        </motion.div>
      </motion.div>

      <motion.div className="mb-3 sm:mb-4 md:mb-6" variants={itemVariants}>
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <Calendar size={16} className="text-[#6c54f8]" />
          <label className="block text-violet-400 font-medium text-sm md:text-base">Date</label>
        </div>
        <motion.input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6c54f8] focus:border-transparent bg-white text-gray-800 text-sm md:text-base"
          whileFocus={{ boxShadow: "0 0 0 3px rgba(108, 84, 248, 0.2)" }}
        />
      </motion.div>

      <motion.div className="mb-3 sm:mb-4 md:mb-6" variants={itemVariants}>
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <Sparkles size={16} className="text-[#6c54f8]" />
          <label className="block text-violet-400 font-medium text-sm md:text-base">Title</label>
        </div>
        <motion.input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What did you build today?"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6c54f8] focus:border-transparent bg-white text-gray-800 text-sm md:text-base"
          whileFocus={{ boxShadow: "0 0 0 3px rgba(108, 84, 248, 0.2)" }}
        />
      </motion.div>

      <motion.div className="mb-3 sm:mb-4 md:mb-6" variants={itemVariants}>
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <Link size={16} className="text-[#6c54f8]" />
          <label className="block text-violet-400 font-medium text-sm md:text-base">Portfolio URL (optional)</label>
        </div>
        <motion.input
          type="url"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          placeholder="https://your-portfolio.com"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6c54f8] focus:border-transparent bg-white text-gray-800 text-sm md:text-base"
          whileFocus={{ boxShadow: "0 0 0 3px rgba(108, 84, 248, 0.2)" }}
        />
      </motion.div>

      <motion.div className="mb-4 sm:mb-6 md:mb-8" variants={itemVariants}>
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <Notebook size={16} className="text-[#6c54f8]" />
          <label className="block text-violet-400 font-medium text-sm md:text-base">Journal Entry</label>
        </div>
        <motion.textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your progress, challenges, and insights..."
          rows={5}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6c54f8] focus:border-transparent bg-white text-gray-800 text-sm md:text-base"
          whileFocus={{ boxShadow: "0 0 0 3px rgba(108, 84, 248, 0.2)" }}
        />
      </motion.div>

      <motion.div className="mb-4 sm:mb-6 md:mb-8" variants={itemVariants}>
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <Image size={16} className="text-[#6c54f8]" />
          <label className="block text-violet-400 font-medium text-sm md:text-base">
            Upload Image (optional)
          </label>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <motion.label 
            className="flex flex-col items-center justify-center w-full sm:w-28 md:w-32 h-28 md:h-32 bg-violet-50 border-2 border-dashed border-violet-300 rounded-xl cursor-pointer hover:bg-violet-100 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center justify-center pt-4 pb-4 sm:pt-5 sm:pb-6">
              <Upload className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-[#6c54f8] mb-1 sm:mb-2" />
              <p className="text-xs text-[#6c54f8] text-center">Choose an image</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
            />
          </motion.label>
          
          <AnimatePresence>
            {previewUrl && (
              <motion.div 
                className="relative w-full sm:w-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full sm:w-28 md:w-32 h-28 md:h-32 object-cover rounded-xl border-2 border-violet-300" 
                />
                <motion.button
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center"
                  onClick={() => {
                    setImageFile(null);
                    setPreviewUrl(null);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div 
        className="mt-4 sm:mt-6 md:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4"
        variants={itemVariants}
      >
        <motion.button
          onClick={handlePrepareForMint}
          disabled={isUploading || !isConnected}
          className={`w-full sm:w-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
            isUploading || !isConnected
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#6c54f8] to-[#6c54f8] hover:from-[#6c54f8] hover:to-violet-400 text-white'
          }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span className="text-xs sm:text-sm md:text-base">Preparing...</span>
            </>
          ) : success ? (
            <>
              <Check size={16} />
              <span className="text-xs sm:text-sm md:text-base">Ready!</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span className="text-xs sm:text-sm md:text-base">Prepare for Minting</span>
            </>
          )}
        </motion.button>

        <AnimatePresence>
          {ipfsHash && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-full sm:w-auto"
            >
              <MintButton ipfsHash={ipfsHash} onSuccess={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleReset}
          className="w-full sm:w-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-400 font-medium flex items-center justify-center gap-2"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <RefreshCw size={16} />
          <span className="text-xs sm:text-sm md:text-base">Reset</span>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {!isConnected && (
          <motion.p 
            className="mt-3 sm:mt-4 md:mt-6 text-yellow-600 dark:text-yellow-400 flex items-center gap-2 bg-yellow-50 p-2 sm:p-3 rounded-lg border border-yellow-200 text-xs sm:text-sm md:text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Connect your wallet to mint your journal entry
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}