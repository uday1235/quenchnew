
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import getReservations from "@/app/actions/getReservations";
import getReviews from "@/app/actions/getReviews";

import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

import ListingClient from "./ListingClient";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  const [listing, reservations, currentUser] = await Promise.all([
    getListingById(params),
    getReservations(params),
    getCurrentUser(),
  ]);

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  const reviews = await getReviews(listing.id);

  // can review if logged in and has a PAID reservation for this listing
  const canReview = !!currentUser && reservations.some(
    (r) => r.userId === currentUser.id && r.status === 'PAID'
  );

  return (
    <ClientOnly>
      <ListingClient
        listing={listing}
        reservations={reservations}
        currentUser={currentUser}
        reviews={reviews}
        canReview={canReview}
      />
    </ClientOnly>
  );
}
 
export default ListingPage;
