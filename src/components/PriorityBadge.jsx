import React from 'react';
import { ArrowUpCircle, ArrowRightCircle, ArrowDownCircle } from 'lucide-react';

const PRIORITY_CONFIG = {
  High: {
    label: 'High Priority',
    bg: 'bg-[#FFF1F0]',
    text: 'text-[#E03E44]',
    border: 'border-[#FFCCC7]',
    icon: ArrowUpCircle,
  },
  Medium: {
    label: 'Medium Priority',
    bg: 'bg-[#F5F3FF]',
    text: 'text-[#7C3AED]',
    border: 'border-[#DDD6FE]',
    icon: ArrowRightCircle,
  },
  Low: {
    label: 'Low Priority',
    bg: 'bg-[#F0FDF4]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    icon: ArrowDownCircle,
  },
};

const PriorityBadge = ({ priority = 'Medium', size = 'sm', showIcon = true }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] font-bold rounded-lg gap-1',
    sm: 'px-2.5 py-1 text-xs font-bold rounded-xl gap-1.5',
    md: 'px-3 py-1.5 text-xs font-bold rounded-xl gap-1.5',
    lg: 'px-3.5 py-2 text-sm font-extrabold rounded-2xl gap-2',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size] || sizeClasses.sm} shadow-2xs`}
    >
      {showIcon && <Icon className={iconSizes[size] || iconSizes.sm} />}
      <span>{config.label}</span>
    </span>
  );
};

export default PriorityBadge;
