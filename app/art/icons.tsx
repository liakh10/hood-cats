import type { CSSProperties, FC } from "react";

type P = { size?: number; className?: string; style?: CSSProperties };

export const ScoreIcon: FC<P> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M12 3l2.4 5.1 5.6.7-4.1 3.9 1 5.6L12 15.7 6.9 18.3l1-5.6-4.1-3.9 5.6-.7L12 3Z" fill="none" stroke="#f2c14e" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

export const LootIcon: FC<P> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M12 4c-2 0-3 1.6-2.4 3C6 8.4 4.6 12 6 16c1 3 3.4 4 6 4s5-1 6-4c1.4-4 0-7.6-3.6-9C14.9 5.6 14 4 12 4Z" fill="none" stroke="#00c805" strokeWidth="1.7" strokeLinejoin="round" />
    <text x="12" y="16" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="8" fill="#00c805">$</text>
  </svg>
);

export const FlockIcon: FC<P> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M4 20c0-4 3-7 8-7s8 3 8 7" fill="none" stroke="#ff8a3d" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="8" r="4" fill="none" stroke="#ff8a3d" strokeWidth="1.8" />
  </svg>
);

export const TrophyIcon: FC<P> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" fill="none" stroke="#f2c14e" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M7 6H4a3 3 0 0 0 3 5M17 6h3a3 3 0 0 1-3 5" fill="none" stroke="#f2c14e" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 15h4v3h-4z" fill="none" stroke="#f2c14e" strokeWidth="1.8" /><path d="M8 21h8" stroke="#f2c14e" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const XIcon: FC<P> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M3 3l7.6 9.9L3.4 21h2.3l5.8-6.7L16.6 21H21l-8-10.4L20.4 3h-2.3l-5.4 6.2L7.7 3H3Z" fill="currentColor" />
  </svg>
);
