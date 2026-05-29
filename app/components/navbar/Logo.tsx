'use client';

import { useRouter } from 'next/navigation';

const PETALS = [0, 60, 120, 180, 240, 300];

const Logo = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push('/')}
      className="flex items-center gap-2.5 cursor-pointer select-none"
    >
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="qpetal" cx="50%" cy="15%" r="85%">
            <stop offset="0%" stopColor="#c7d2fe" />
            <stop offset="100%" stopColor="#4338ca" />
          </radialGradient>
          <radialGradient id="qcenter" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
        </defs>

        {PETALS.map((deg) => (
          <ellipse
            key={deg}
            cx="20" cy="12"
            rx="5" ry="9"
            fill="url(#qpetal)"
            opacity="0.88"
            transform={`rotate(${deg} 20 20)`}
          />
        ))}

        {/* golden centre */}
        <circle cx="20" cy="20" r="6.5" fill="url(#qcenter)" />
        <circle cx="20" cy="20" r="2.5" fill="#fff" opacity="0.6" />
      </svg>

      <span className="hidden md:inline font-playfair font-bold text-xl tracking-tight text-slate-900">
        Quench
      </span>
    </div>
  );
};

export default Logo;
