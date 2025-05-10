/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAccount } from "wagmi";
import { EntryForm } from "@/components/EntryForm";
import { WalletConnect } from "@/components/WalletConnect";
import { motion } from "framer-motion";
import { Notebook, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { canMintToday } from "@/lib/journal";

export default function JournalPage() {
  const { isConnected, address } = useAccount();
  const [farcasterUser, setFarcasterUser] = useState<any>(null);
  const [canMint, setCanMint] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const initFarcaster = async () => {
      try {
        const context = await sdk.context;
        if (context?.user) {
          setFarcasterUser(context.user);
        }
      } catch (error) {
        console.error("Failed to get Farcaster context:", error);
      }
    };

    initFarcaster();
  }, []);

  // Check if user can mint today when wallet is connected

  console.log({isConnected})

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const checkMintingStatus = async () => {
      if (isConnected && address && provider) {
        console.log(isConnected && address && provider)
        setIsLoading(true);
        try {
          const canUserMint = await canMintToday(
            provider as ethers.providers.Provider,
            address
          );
          console.log({canUserMint})
          setCanMint(canUserMint);
        } catch (error) {
          console.error("Failed to check minting status:", error);
          setCanMint(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkMintingStatus();
  }, [isConnected, address]);

  // const handleAddToFarcaster = async () => {
  //   try {
  //     await sdk.actions.addFrame();
  //   } catch (error) {
  //     console.error("Failed to add to Farcaster:", error);
  //   }
  // };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      className="container mx-auto px-4 sm:px-6 py-8 sm:py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="max-w-4xl mx-auto" variants={containerVariants}>
        {/* Header Section */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mb-8 sm:mb-12"
          variants={itemVariants}
        >
          <motion.div className="flex items-center gap-2 sm:gap-3 mb-6 md:mb-0">
            <motion.div
              animate={{
                rotate: [0, 10, 0, -10, 0],
                transition: { repeat: Infinity, duration: 5 },
              }}
            >
              <BookOpen size={28} className="text-[#6c54f8] sm:w-9 sm:h-9" />
            </motion.div>
            <h1 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6c54f8] to-violet-500">
              Builder Journal
            </h1>
            {farcasterUser && (
              <div className="ml-2 text-sm text-gray-600">
                Welcome, {farcasterUser.displayName || farcasterUser.username}
              </div>
            )}
            <motion.div
              initial={{ scale: 1 }}
              animate={{
                scale: [1, 1.2, 1],
                transition: { repeat: Infinity, duration: 2 },
              }}
            >
              <Sparkles size={20} className="text-purple-400 sm:w-6 sm:h-6" />
            </motion.div>
          </motion.div>

          <motion.div
            className="flex gap-4 items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <WalletConnect />
            {/* <button
              onClick={handleAddToFarcaster}
              className="px-4 py-2 bg-purple-100 text-[#6c54f8] rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              Add to Farcaster
            </button> */}
          </motion.div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          className="bg-gradient-to-r from-purple-50 to-white rounded-2xl p-4 sm:p-8 mb-8 sm:mb-12 border-l-4 border-[#6c54f8] shadow-md"
          variants={itemVariants}
          style={{ boxShadow: "0 4px 20px rgba(108, 84, 248, 0.1)" }}
        >
          <motion.p
            className="text-gray-700 text-base sm:text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Document your builder journey and mint it as an NFT on Monad. Share
            your progress, challenges, and insights with the community. Build in
            public and create a collection of your achievements!
          </motion.p>

          <motion.div
            className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {["journaling", "building", "blockchain", "NFT", "Monad"].map(
              (tag, index) => (
                <motion.span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-purple-100 text-[#6c54f8] rounded-full text-xs sm:text-sm font-medium"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#6c54f8",
                    color: "#ffffff",
                  }}
                >
                  #{tag}
                </motion.span>
              )
            )}
          </motion.div>
        </motion.div>

        {/* Form or Connect Wallet Section */}
        <motion.div variants={itemVariants}>
          {isConnected ? (
            <>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-[#6c54f8] border-r-transparent border-b-[#6c54f8] border-l-transparent"></div>
                  <p className="mt-4 text-gray-600">
                    Checking if you can mint today...
                  </p>
                </div>
              ) : (
                <>
                  {canMint ? (
                    <EntryForm />
                  ) : (
                    <motion.div
                      className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 text-center border-2 border-purple-100"
                      style={{
                        background:
                          "linear-gradient(to bottom right, #ffffff, #fff0f0)",
                        boxShadow: "0 10px 25px rgba(248, 84, 84, 0.15)",
                      }}
                    >
                      <motion.div className="text-red-500 mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </motion.div>
                      <h2 className="text-2xl text-purple-950 font-bold mb-4">
                        Daily Mint Limit Reached
                      </h2>
                      <p className="text-gray-600 mb-4">
                        You&apos;ve already minted your journal entry for today.
                        Please come back tomorrow to continue documenting your
                        builder journey!
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </>
          ) : (
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 text-center border-2 border-purple-100"
              style={{
                background:
                  "linear-gradient(to bottom right, #ffffff, #f6f3ff)",
                boxShadow: "0 10px 25px rgba(108, 84, 248, 0.15)",
              }}
              whileHover={{ boxShadow: "0 12px 30px rgba(108, 84, 248, 0.2)" }}
            >
              <motion.div
                className="mb-4 sm:mb-6 flex justify-center"
                animate={{
                  y: [0, -10, 0],
                  transition: {
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  },
                }}
              >
                <Notebook
                  size={60}
                  className="text-[#6c54f8] sm:w-20 sm:h-20"
                />
              </motion.div>

              <motion.h2
                className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-[#6c54f8]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Connect Your Wallet
              </motion.h2>

              <motion.p
                className="text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Connect your wallet to start documenting your builder journey on
                Monad and create your first journal entry NFT!
              </motion.p>

              <motion.div
                className="flex justify-center items-center gap-2 sm:gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <WalletConnect />
                </motion.div>

                <motion.div
                  animate={{
                    x: [0, 10, 0],
                    transition: {
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <ArrowRight
                    size={20}
                    className="text-[#6c54f8] ml-2 sm:w-6 sm:h-6"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-purple-100 text-[#6c54f8]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="flex items-center justify-center gap-2">
                  <Sparkles size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-sm sm:text-base">
                    Join the builder community today!
                  </span>
                  <Sparkles size={14} className="sm:w-4 sm:h-4" />
                </p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
