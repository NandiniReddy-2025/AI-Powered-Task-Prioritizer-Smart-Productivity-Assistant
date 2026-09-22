import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

const RISK_CONFIG = {
  High: {
    label: 'High Risk',
    bg: 'bg-[#FFF1F0]',
    text: 'text-[#E03E44]',
    border: 'border-[#FFCCC7]',
    icon: ShieldAlert,
  },
  Medium: {
    label: 'Medium Risk',
    bg: 'bg-[#FFF6EF]',
    text: 'text-[#EA580C]',
    border: 'border-[#FFD6BA]',
    icon: AlertTriangle,
  },
  Low: {
    label: 'Low Risk',
    bg: 'bg-[#F0FDF4]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    icon: ShieldCheck,
  },
};

const RiskBadge = ({ riskLevel = 'Low', score, size = 'sm' }) => {
  const config = RISK_CONFIG[riskLevel] || RISK_CONFIG.Low;
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] font-bold rounded-lg gap-1',
    sm: 'px-2.5 py-1 text-xs font-bold rounded-xl gap-1.5',
    md: 'px-3 py-1.5 text-xs font-bold rounded-xl gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size] || sizeClasses.sm} shadow-2xs`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>
        {config.label}
        {score !== undefined && score !== null ? ` (${Math.round(score)}%)` : ''}
      </span>
    </span>
  );
};

export default RiskBadge;
