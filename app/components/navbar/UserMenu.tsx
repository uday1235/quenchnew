'use client';

import { useCallback, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useRentModal from '@/app/hooks/useRentModal';
import { SafeUser } from '@/app/types';

import MenuItem from './MenuItem';
import Avatar from '../Avatar';

interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const rentModal = useRentModal();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => setIsOpen((v) => !v), []);

  const onListService = useCallback(() => {
    if (!currentUser) return loginModal.onOpen();
    rentModal.onOpen();
  }, [loginModal, rentModal, currentUser]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onListService}
          className="hidden md:block text-sm font-semibold py-2 px-4 rounded-full border border-slate-200 hover:bg-slate-50 transition cursor-pointer text-slate-700"
        >
          List a Service
        </div>
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border border-slate-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu className="text-slate-600" />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-lg w-[40vw] md:w-56 bg-white overflow-hidden right-0 top-12 text-sm border border-slate-100 z-50">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem label="My Bookings" onClick={() => router.push('/trips')} />
                <MenuItem label="My Favourites" onClick={() => router.push('/favorites')} />
                <MenuItem label="My Appointments" onClick={() => router.push('/reservations')} />
                <MenuItem label="My Services" onClick={() => router.push('/properties')} />
                <MenuItem label="List a New Service" onClick={rentModal.onOpen} />
                <div className="border-t border-slate-100" />
                <MenuItem label="Logout" onClick={() => signOut()} />
              </>
            ) : (
              <>
                <MenuItem label="Login" onClick={loginModal.onOpen} />
                <MenuItem label="Sign up" onClick={registerModal.onOpen} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
