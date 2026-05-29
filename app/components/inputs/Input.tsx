'use client';

import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { TbCurrencyRupee } from 'react-icons/tb';

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const Input: React.FC<InputProps> = ({ id, label, type = 'text', disabled, formatPrice, register, required, errors }) => {
  return (
    <div className="w-full relative">
      {formatPrice && (
        <TbCurrencyRupee size={24} className="text-slate-400 absolute top-5 left-2" />
      )}
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=" "
        type={type}
        className={`
          peer w-full p-4 pt-6 font-light bg-white border-2 rounded-xl outline-none transition
          disabled:opacity-70 disabled:cursor-not-allowed text-slate-900
          ${formatPrice ? 'pl-9' : 'pl-4'}
          ${errors[id] ? 'border-rose-400 focus:border-rose-400' : 'border-slate-200 focus:border-brand-400'}
        `}
      />
      <label
        className={`
          absolute text-sm duration-150 transform -translate-y-3 top-5 z-10 origin-[0]
          ${formatPrice ? 'left-9' : 'left-4'}
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
          peer-focus:scale-75 peer-focus:-translate-y-4
          ${errors[id] ? 'text-rose-400' : 'text-slate-400'}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
