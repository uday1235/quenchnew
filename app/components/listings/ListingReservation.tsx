'use client';

import { useState } from 'react';
import { TbCurrencyRupee } from 'react-icons/tb';
import { HiOutlineClock, HiOutlineCalendar, HiOutlinePhone } from 'react-icons/hi';
import Button from '../Button';

const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
];

interface ListingReservationProps {
  price: number;
  onSubmit: (data: { scheduledDate: string; scheduledTime: string; customerPhone: string }) => void;
  disabled?: boolean;
}

const ListingReservation: React.FC<ListingReservationProps> = ({ price, onSubmit, disabled }) => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (val: string) => /^[+]?[\d\s\-]{10,15}$/.test(val.trim());

  const handleBook = () => {
    if (!date) return;
    if (!time) return;
    if (!validatePhone(phone)) {
      setPhoneError('Enter a valid mobile number');
      return;
    }
    setPhoneError('');
    onSubmit({ scheduledDate: date, scheduledTime: time, customerPhone: phone.trim() });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      {/* price header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-baseline gap-1">
          <TbCurrencyRupee size={22} className="text-brand-600 mt-0.5" />
          <span className="text-3xl font-bold text-slate-900">{price}</span>
          <span className="text-slate-400 text-sm font-normal ml-1">/ session</span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* date picker */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <HiOutlineCalendar size={16} className="text-brand-500" />
            Select Date
          </label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-brand-400 transition"
          />
        </div>

        {/* time slots */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <HiOutlineClock size={16} className="text-brand-500" />
            Select Time Slot
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={`
                  text-xs font-medium py-2 px-1 rounded-lg border transition
                  ${time === slot
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600'
                  }
                `}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* mobile number */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <HiOutlinePhone size={16} className="text-brand-500" />
            Your Mobile Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setPhoneError(''); }}
            placeholder="+91 9876543210"
            className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none transition
              ${phoneError ? 'border-rose-400 focus:border-rose-400' : 'border-slate-200 focus:border-brand-400'}
            `}
          />
          {phoneError && <p className="text-xs text-rose-500 mt-1">{phoneError}</p>}
          <p className="text-xs text-slate-400 mt-1">You'll receive a confirmation SMS after payment</p>
        </div>

        {/* summary */}
        {date && time && (
          <div className="bg-brand-50 rounded-xl p-3 border border-brand-100 text-sm text-brand-700">
            <p className="font-semibold">Booking Summary</p>
            <p className="mt-1">{date} at {time}</p>
          </div>
        )}

        {/* total + pay */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex justify-between items-center mb-4 text-slate-700 font-semibold">
            <span>Total</span>
            <span className="flex items-center gap-0.5 text-brand-600 text-lg">
              <TbCurrencyRupee size={18} />
              {price}
            </span>
          </div>
          <Button
            label={disabled ? 'Processing…' : 'Pay & Book Session'}
            onClick={handleBook}
            disabled={disabled || !date || !time || !phone}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingReservation;
