'use client';

import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import useLoginModal from '@/app/hooks/useLoginModal';
import { SafeListing, SafeReservation, SafeUser } from '@/app/types';
import { SafeReview } from '@/app/actions/getReviews';

import Container from '@/app/components/Container';
import { categories } from '@/app/components/navbar/Categories';
import ListingHead from '@/app/components/listings/ListingHead';
import ListingInfo from '@/app/components/listings/ListingInfo';
import ListingReservation from '@/app/components/listings/ListingReservation';
import ReviewCard from '@/app/components/ReviewCard';
import ReviewForm from '@/app/components/ReviewForm';
import StarRating from '@/app/components/StarRating';

interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & { user: SafeUser };
  currentUser?: SafeUser | null;
  reviews?: SafeReview[];
  canReview?: boolean;
}

const ListingClient: React.FC<ListingClientProps> = ({ listing, currentUser, reviews = [], canReview = false }) => {
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const category = useMemo(
    () => categories.find((c) => c.label === listing.category),
    [listing.category]
  );

  const onBook = useCallback(
    async (data: { scheduledDate: string; scheduledTime: string; customerPhone: string }) => {
      if (!currentUser) return loginModal.onOpen();

      setIsLoading(true);
      try {
        const res = await axios.post('/api/stripe/checkout', {
          listingId: listing.id,
          scheduledDate: data.scheduledDate,
          scheduledTime: data.scheduledTime,
          customerPhone: data.customerPhone,
          totalPrice: listing.price,
        });

        if (res.data?.url) {
          window.location.href = res.data.url; // redirect to Stripe Checkout
        }
      } catch {
        toast.error('Could not initiate payment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser, loginModal, listing]
  );

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                onSubmit={onBook}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* ── Reviews section ── */}
          <div className="border-t border-slate-100 pt-10 pb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-2xl font-bold text-slate-900">
                Reviews
                {reviews.length > 0 && (
                  <span className="ml-2 text-base font-normal text-slate-400">({reviews.length})</span>
                )}
              </h2>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating
                    value={Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)}
                    size={18}
                  />
                  <span className="text-sm font-semibold text-slate-700">
                    {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {canReview && <div className="mb-6"><ReviewForm listingId={listing.id} /></div>}

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
              </div>
            ) : (
              !canReview && (
                <p className="text-slate-400 text-sm">No reviews yet. Be the first to review after your booking!</p>
              )
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
