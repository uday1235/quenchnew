'use client';

import { IconType } from 'react-icons';

interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled, outline, small, icon: Icon }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        relative disabled:opacity-50 disabled:cursor-not-allowed
        rounded-lg hover:opacity-90 active:scale-[0.98] transition w-full font-semibold
        ${outline
          ? 'bg-white border-2 border-slate-300 text-slate-700 hover:border-brand-400 hover:text-brand-600'
          : 'bg-brand-600 border-2 border-brand-600 text-white shadow-sm hover:bg-brand-700'
        }
        ${small ? 'text-sm py-2' : 'text-base py-3'}
      `}
    >
      {Icon && <Icon size={24} className="absolute left-4 top-3" />}
      {label}
    </button>
  );
};

export default Button;
