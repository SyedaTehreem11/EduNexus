import React from 'react';
import { motion } from 'framer-motion';

const StatusBadge = ({ status = 'Pending', size = 'default' }) => {
  const normalized = (status || '').trim();

  const getBadgeStyle = (val) => {
    switch (val) {
      case 'Complete':
        return {
          classes: 'bg-[#73766A]/20 text-[#2D4354] dark:text-[#FED7A5] border border-[#73766A]',
          dot: 'bg-[#73766A]',
        };
      case 'Verified':
        return {
          classes: 'bg-[#73766A]/20 text-[#2D4354] dark:text-[#FED7A5] border border-[#73766A]',
          dot: 'bg-[#73766A]',
        };
      case 'Pending':
        return {
          classes: 'bg-[#FED7A5]/50 text-[#534145] dark:bg-[#FED7A5]/80 dark:text-[#20212B] border border-[#9E6752]',
          dot: 'bg-[#9E6752]',
        };
      case 'Manual Review':
        return {
          classes: 'bg-[#9E6752]/20 text-[#534145] dark:text-[#FED7A5] border border-[#9E6752]',
          dot: 'bg-[#9E6752]',
        };
      case 'Missing':
        return {
          classes: 'bg-[#9E6752]/20 text-[#9E6752] dark:text-[#FED7A5] border border-[#9E6752]',
          dot: 'bg-[#9E6752]',
        };
      default:
        return {
          classes: 'bg-[#73766A]/10 text-[#534145] dark:text-[#FED7A5] border border-[#73766A]/40',
          dot: 'bg-[#73766A]',
        };
    }
  };

  const style = getBadgeStyle(normalized);
  const sizeClasses = size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <motion.span
      key={normalized}
      initial={{ scale: 0.95, opacity: 0.8 }}
      animate={{ scale: [1, 1.05, 1], opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`inline-flex items-center gap-1.5 rounded-full ${style.classes} ${sizeClasses} transition-colors`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{normalized || 'Unknown'}</span>
    </motion.span>
  );
};

export default StatusBadge;
