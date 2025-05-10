import Link from 'next/link';
import { formatAddress } from '@/lib/journal';
import { JournalEntry } from '@/types/journal';
import { motion } from 'framer-motion';
import { Calendar, User, ExternalLink, ArrowRight, Hash, Sparkles } from 'lucide-react';

interface JournalCardProps {
  entry: JournalEntry & { 
    tokenId: number;
    imageUrl?: string | null;
    externalUrl?: string | null;
  };
  tokenId: number;
}

export function JournalCard({ entry, tokenId }: JournalCardProps) {
    // Adjust content truncation length based on screen size (shorter for mobile)
    const truncatedContent = entry.content.length > 180 
      ? `${entry.content.substring(0, 180)}...` 
      : entry.content;
  
    return (
      <motion.div 
        className="bg-white rounded-2xl overflow-hidden border border-purple-200 sm:border-2 sm:border-purple-900 w-full"
        style={{ boxShadow: "0 8px 20px rgba(108, 84, 248, 0.06)" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ y: -5, boxShadow: "0 12px 25px rgba(108, 84, 248, 0.12)" }}
      >
        <motion.div 
          className="h-1 sm:h-2 bg-gradient-to-r from-[#6c54f8] to-purple-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2 }}
        />
  
        <div className="p-3 sm:p-5 md:p-6">
          {/* Header */}
          <div className="flex flex-col gap-2 mb-3 sm:mb-5">
            <div className="flex justify-between items-start gap-2">
              <motion.h2 
                className="text-base sm:text-xl md:text-2xl font-bold text-[#6c54f8] line-clamp-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {entry.title}
                <motion.span 
                  className="inline-block ml-1 sm:ml-2"
                  animate={{ rotate: [0, 10, 0, -10, 0], transition: { repeat: Infinity, duration: 5, delay: 1 } }}
                >
                  <Sparkles size={14} className="text-[#6c54f8] inline hidden sm:inline" />
                </motion.span>
              </motion.h2>
  
              <motion.div 
                className="bg-purple-100 text-purple-800 font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center text-xs sm:text-sm flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Hash size={12} className="mr-0.5 sm:mr-1" />
                <span>{tokenId}</span>
              </motion.div>
            </div>
  
            <motion.div 
              className="flex flex-wrap text-gray-600 text-xs gap-y-1 gap-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center">
                <User size={12} className="mr-1 text-[#6c54f8]" />
                <span>By {formatAddress(entry.author)}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={12} className="mr-1 text-[#6c54f8]" />
                <span>{entry.date}</span>
              </div>
            </motion.div>
          </div>
  
          {/* Image */}
          {entry.imageUrl && (
            <motion.div 
              className="mb-3 sm:mb-6 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div 
                className="rounded-lg sm:rounded-xl overflow-hidden shadow-sm sm:shadow-md"
                whileHover={{ scale: 1.01 }}
              >
                <img 
                  src={entry.imageUrl} 
                  alt={`Image for ${entry.title}`} 
                  className="w-full h-24 object-cover" 
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-[#6c54f8]/20 to-transparent pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
            </motion.div>
          )}
  
          {/* Content */}
          <motion.div 
            className="mb-4 sm:mb-6 text-gray-700 whitespace-pre-line leading-relaxed text-xs sm:text-sm md:text-base line-clamp-4 sm:line-clamp-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {truncatedContent}
          </motion.div>
  
          {/* Footer */}
          <motion.div 
            className="flex justify-between items-center pt-3 sm:pt-4 border-t border-purple-100 gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href={`/journal/${tokenId}`}
                className="text-[#6c54f8] hover:text-purple-800 font-medium flex items-center text-xs sm:text-sm md:text-base"
              >
                View Details
                <motion.div
                  animate={{ x: [0, 3, 0], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }}
                >
                  <ArrowRight size={14} className="ml-1 sm:ml-2" />
                </motion.div>
              </Link>
            </motion.div>
  
            {entry.externalUrl && (
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                <a
                  href={entry.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-purple-50 text-[#6c54f8] rounded-md sm:rounded-lg hover:bg-purple-100 flex items-center transition-colors"
                >
                  <ExternalLink size={12} className="mr-1 sm:mr-1.5" />
                  <span className="hidden xs:inline">External Link</span>
                  <span className="xs:hidden">Link</span>
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  }