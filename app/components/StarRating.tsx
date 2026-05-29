'use client';

import { HiStar } from 'react-icons/hi';

interface StarRatingProps {
  value: number;       // 1-5, supports half not needed
  size?: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
}

export default function StarRating({ value, size = 16, interactive = false, onChange }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <HiStar
          key={star}
          size={size}
          onClick={() => interactive && onChange?.(star)}
          className={`transition-colors ${
            star <= value
              ? 'text-amber-400'
              : 'text-slate-200'
          } ${interactive ? 'cursor-pointer hover:text-amber-300' : ''}`}
        />
      ))}
    </div>
  );
}
