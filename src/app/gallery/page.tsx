/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { JournalCard } from '@/components/JournalCard';
import { WalletConnect } from '@/components/WalletConnect';
import {
  getAllEntries,
  formatDate,
  formatAddress,
  getEntryDate,
  getTodoStats,
  JournalEntry as ContractJournalEntry
} from '@/lib/journal';
import { motion, AnimatePresence } from 'framer-motion';
import { JournalEntry } from '@/types/journal';
import { RefreshCw, BookOpen, Grid, Archive, PenTool, AlertCircle, Loader, Menu } from 'lucide-react';
import Link from 'next/link';

export default function GalleryPage() {
  const [entries, setEntries] = useState<Array<JournalEntry & { tokenId: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.1
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

  const fetchEntries = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.ethereum) throw new Error('MetaMask not detected');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({provider})
      
      // Fetch all journal entries with metadata from the smart contract
      const entriesFromBlockchain = await getAllEntries(provider);
      console.log('Entries from blockchain:', entriesFromBlockchain);
      
      // Map blockchain entries to your UI structure
      const mappedEntries = entriesFromBlockchain.map((entry: ContractJournalEntry) => {
        // Extract date from metadata or use current date as fallback
        const dateStr = entry.metadata ? getEntryDate(entry.metadata) : new Date().toISOString().split('T')[0];
        const date = dateStr ? new Date(dateStr) : new Date();
        
        // Extract todo stats
        const { total: todoCount, completed: completedCount } = 
          entry.metadata ? getTodoStats(entry.metadata) : { total: 0, completed: 0 };
        
        // Generate todos array based on metadata counts
        const todos = Array(todoCount).fill(null).map((_, i) => ({
          id: `${entry.tokenId}-todo-${i}`,
          text: i < completedCount ? 'Completed task' : 'Pending task',
          completed: i < completedCount
        }));

        return {
          tokenId: entry.tokenId,
          title: entry.metadata?.name || `Journal Entry #${entry.tokenId}`,
          content: entry.metadata?.description || `This is the content of journal entry #${entry.tokenId}.`,
          date: date.toLocaleDateString(),
          author: entry.minter,
          timestamp: date.getTime(),
          todos,
          imageUrl: entry.metadata?.image || null,
          externalUrl: entry.metadata?.external_url || null
        };
      });

      // Sort entries by date, newest first
      const sortedEntries = mappedEntries.sort((a, b) => b.timestamp - a.timestamp);
      
      setEntries(sortedEntries);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError('Failed to load journal entries. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchEntries();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Close mobile menu if window is resized above mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  return (
    <motion.div 
      className="container min-h-screen mx-auto px-4 py-6 md:py-12 overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="max-w-4xl mx-auto" variants={containerVariants}>
        {/* Header Section */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-10"
          variants={itemVariants}
        >
          <motion.div className="flex items-center gap-2 mb-4 md:mb-0 w-full justify-center md:justify-start">
            <motion.div
              animate={{
                rotate: [0, 10, 0, -10, 0],
                transition: { repeat: Infinity, duration: 5 }
              }}
              className="hidden sm:block"
            >
              <Grid size={32} className="text-[#6c54f8]" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6c54f8] to-violet-500 text-center md:text-left">
              Builder Journal Gallery
            </h1>
          </motion.div>
          
          {/* Mobile header controls */}
          <div className="w-full md:hidden flex justify-between items-center mb-4">
            <motion.button
              onClick={handleRefresh}
              className="p-2 bg-purple-100 text-purple-800 rounded-xl hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isRefreshing || isLoading}
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw size={18} className={isRefreshing ? "text-purple-500" : ""} />
              </motion.div>
              <span className="sr-only">Refresh</span>
            </motion.button>

            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-purple-100 text-purple-800 rounded-xl hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu size={18} />
              <span className="sr-only">Menu</span>
            </motion.button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="w-full md:hidden mb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <WalletConnect />
                  
                  <Link href="/journal" passHref>
                    <motion.a
                      className="mt-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-[#6c54f8] hover:from-[#6c54f8] hover:to-purple-700 text-white rounded-xl flex items-center gap-2 justify-center w-full font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <PenTool size={16} />
                      Create Journal Entry
                    </motion.a>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Desktop controls */}
          <div className="hidden md:flex gap-4">
            <motion.button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-purple-100 text-purple-800 rounded-xl hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-2 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isRefreshing || isLoading}
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw size={18} className={isRefreshing ? "text-purple-500" : ""} />
              </motion.div>
              Refresh
            </motion.button>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <WalletConnect />
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              className="flex flex-col items-center justify-center py-12 md:py-20"
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                animate={{ 
                  rotate: 360,
                  transition: { repeat: Infinity, duration: 1.5, ease: "linear" }
                }}
              >
                <Loader size={40} className="text-purple-500 mb-4" />
              </motion.div>
              <motion.p 
                className="text-[#6c54f8] font-medium text-base md:text-lg"
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                }}
              >
                Loading journal entries...
              </motion.p>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 md:p-6 rounded-xl"
              key="error"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              role="alert"
            >
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <AlertCircle size={20} />
                <strong className="font-bold text-base md:text-lg">Error Loading Entries</strong>
              </div>
              <p className="ml-7 md:ml-9 text-sm md:text-base">{error}</p>
              <motion.button
                className="mt-3 md:mt-4 ml-7 md:ml-9 px-3 py-1 md:px-4 md:py-2 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 text-sm md:text-base"
                onClick={handleRefresh}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={16} />
                Try Again
              </motion.button>
            </motion.div>
          ) : entries.length === 0 ? (
            <motion.div 
              className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-6 md:p-12 text-center"
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20 }}
              style={{ 
                background: "linear-gradient(to bottom right, #ffffff, #f6f3ff)",
                boxShadow: "0 10px 25px rgba(108, 84, 248, 0.15)" 
              }}
            >
              <motion.div 
                className="mb-6 md:mb-8 flex justify-center"
                animate={{ 
                  y: [0, -10, 0],
                  transition: { 
                    repeat: Infinity, 
                    duration: 3,
                    ease: "easeInOut"
                  }
                }}
              >
                <Archive size={60} className="text-purple-500" />
              </motion.div>
              
              <motion.h2 
                className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-[#6c54f8]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                No Journal Entries Yet
              </motion.h2>
              
              <motion.p 
                className="text-gray-700 mb-6 md:mb-8 text-base md:text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Be the first to document your builder journey on Monad and create beautiful journal entries!
              </motion.p>
              
              <Link href="/journal" passHref>
                <motion.a
                  className="px-5 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-500 to-[#6c54f8] hover:from-[#6c54f8] hover:to-purple-700 text-white rounded-xl flex items-center gap-2 justify-center mx-auto w-fit font-medium text-sm md:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PenTool size={16} />
                  Create Journal Entry
                </motion.a>
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div 
                className="flex items-center gap-2 mb-4 md:mb-6 text-gray-600 text-base md:text-lg"
                variants={itemVariants}
              >
                <BookOpen size={16} className="text-purple-500" />
                <p className="text-sm md:text-base">
                  Showing <span className="font-medium text-[#6c54f8]">{entries.length}</span> journal entries from the Monad blockchain
                </p>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 gap-6 md:gap-8"
                variants={containerVariants}
              >
                {entries.map((entry, index) => (
                  <motion.div 
                    key={entry.tokenId}
                    variants={itemVariants}
                    custom={index}
                    transition={{ delay: index * 0.1 }}
                  >
                    <JournalCard 
                      entry={entry} 
                      tokenId={entry.tokenId} 
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}