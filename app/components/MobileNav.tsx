'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiHome, HiSearch, HiCalendar, HiUser } from 'react-icons/hi';
import useLoginModal from '@/app/hooks/useLoginModal';
import { SafeUser } from '@/app/types';

const NAV = [
  { href: '/',          icon: HiHome,     label: 'Home'     },
  { href: '/?q=',       icon: HiSearch,   label: 'Search'   },
  { href: '/trips',     icon: HiCalendar, label: 'Bookings' },
];

interface MobileNavProps {
  currentUser?: SafeUser | null;
}

export default function MobileNav({ currentUser }: MobileNavProps) {
  const pathname = usePathname();
  const loginModal = useLoginModal();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      <div className="flex items-stretch">
        {NAV.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/' ? pathname === '/' : !!pathname?.startsWith(href.replace('?q=', ''));
          return (
            <Link
              key={label}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                isActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
              {isActive && <span className="absolute bottom-0 w-8 h-0.5 bg-brand-600 rounded-t-full" />}
            </Link>
          );
        })}

        {/* Profile / Login */}
        {currentUser ? (
          <Link
            href={`/providers/${currentUser.id}`}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
              pathname?.startsWith('/providers') ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {currentUser.image ? (
              <img src={currentUser.image} alt="" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <HiUser size={22} />
            )}
            <span className="text-[10px] font-semibold tracking-wide">Profile</span>
          </Link>
        ) : (
          <button
            onClick={loginModal.onOpen}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <HiUser size={22} />
            <span className="text-[10px] font-semibold tracking-wide">Login</span>
          </button>
        )}
      </div>
    </nav>
  );
}
