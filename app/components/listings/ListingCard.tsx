'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { TbCurrencyRupee } from 'react-icons/tb';
import { HiOutlineLocationMarker } from 'react-icons/hi';

import useCountries from '@/app/hooks/useCountries';
import { SafeListing, SafeReservation, SafeUser } from '@/app/types';
import HeartButton from '../HeartButton';
import Button from '../Button';
import StarRating from '../StarRating';

interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  avgRating?: number;
  reviewCount?: number;
}

const ListingCard: React.FC<ListingCardProps> = ({ data, reservation, onAction, disabled, actionLabel, actionId = '', currentUser, avgRating, reviewCount }) => {
  const router = useRouter();
  const { getByValue } = useCountries();
  const location = getByValue(data.locationValue);

  const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (disabled) return;
    onAction?.(actionId);
  }, [disabled, onAction, actionId]);

  const price = useMemo(() => reservation ? reservation.totalPrice : data.price, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) return null;
    return `${format(new Date(reservation.startDate), 'PP')} – ${format(new Date(reservation.endDate), 'PP')}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
        {/* image */}
        <div className="aspect-square w-full relative overflow-hidden">
          <Image
            fill
            className="object-cover h-full w-full group-hover:scale-105 transition duration-300"
            src={data.imageSrc}
            alt={data.title}
          />
          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-brand-600 border border-brand-100 shadow-sm">
              {data.category}
            </span>
          </div>
        </div>
        {/* details */}
        <div className="p-4 flex flex-col gap-1">
          <div className="font-semibold text-slate-900 truncate">{data.title}</div>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <HiOutlineLocationMarker size={14} />
            <span>{location?.region}, {location?.label}</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {reservationDate || data.category}
          </div>
          {avgRating !== undefined && (
            <div className="flex items-center gap-1.5 mt-1">
              <StarRating value={Math.round(avgRating)} size={13} />
              <span className="text-xs text-slate-500 font-medium">
                {avgRating.toFixed(1)}
                {reviewCount !== undefined && <span className="text-slate-400"> ({reviewCount})</span>}
              </span>
            </div>
          )}
          <div className="flex items-center gap-0.5 mt-2 text-brand-600 font-bold">
            <TbCurrencyRupee size={18} />
            <span className="text-lg">{price}</span>
            {!reservation && <span className="font-normal text-sm text-slate-400 ml-1">/ session</span>}
          </div>
        </div>
      </div>
      {onAction && actionLabel && (
        <div className="mt-2 px-1">
          <Button disabled={disabled} small label={actionLabel} onClick={handleCancel} />
        </div>
      )}
    </div>
  );
};

export default ListingCard;
