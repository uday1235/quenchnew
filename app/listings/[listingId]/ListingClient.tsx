'use client';

import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import useLoginModal from '@/app/hooks/useLoginModal';
import { SafeListing, SafeReservation, SafeUser } from '@/app/types';

import Container from '@/app/components/Container';
import { categories } from '@/app/components/navbar/Categories';
import ListingHead from '@/app/components/listings/ListingHead';
import ListingInfo from '@/app/components/listings/ListingInfo';
import ListingReservation from '@/app/components/listings/ListingReservation';

interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & { user: SafeUser };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({ listing, currentUser }) => {
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
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
