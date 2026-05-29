import Container from '@/app/components/Container';
import ListingCard from '@/app/components/listings/ListingCard';
import EmptyState from '@/app/components/EmptyState';
import MagazineStories from '@/app/components/MagazineStories';
import getListings, { IListingsParams } from '@/app/actions/getListings';
import getCurrentUser from '@/app/actions/getCurrentUser';
import ClientOnly from './components/ClientOnly';

interface HomeProps {
  searchParams: IListingsParams;
}

const Home = async ({ searchParams }: HomeProps) => {
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  const isFiltered = Object.values(searchParams).some(Boolean);

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      {!isFiltered && <MagazineStories />}
      <Container>
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {listings.map((listing: any) => (
            <ListingCard key={listing.id} currentUser={currentUser} data={listing} />
          ))}
        </div>
      </Container>
    </ClientOnly>
  );
};

export default Home;
export const dynamic = 'force-dynamic';
