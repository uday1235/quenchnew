'use client';

import { useRouter } from 'next/navigation';

const Logo = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push('/')}
      className="hidden md:flex items-center gap-2 cursor-pointer select-none"
    >
      <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
        <span className="text-white font-extrabold text-base leading-none">Q</span>
      </div>
      <span className="font-extrabold text-xl tracking-tight text-slate-900">Quench</span>
    </div>
  );
};

export default Logo;
