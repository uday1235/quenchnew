import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HiCheckBadge, HiStar, HiBriefcase, HiChatBubbleLeftRight } from 'react-icons/hi2';
import { TbCurrencyRupee } from 'react-icons/tb';
import { format } from 'date-fns';

import getProviderById from '@/app/actions/getProviderById';
import getCurrentUser from '@/app/actions/getCurrentUser';
import Container from '@/app/components/Container';
import StarRating from '@/app/components/StarRating';
import Avatar from '@/app/components/Avatar';
import ReviewCard from '@/app/components/ReviewCard';
import ListingCard from '@/app/components/listings/ListingCard';
import ClientOnly from '@/app/components/ClientOnly';

interface Props { params: { userId: string } }

export default async function ProviderProfilePage({ params }: Props) {
  const [provider, currentUser] = await Promise.all([
    getProviderById(params.userId),
    getCurrentUser(),
  ]);

  if (!provider || provider.role !== 'PROVIDER') notFound();

  const joinYear = format(new Date(provider.createdAt), 'yyyy');

  return (
    <ClientOnly>
      {/* ── Hero banner ── */}
      <div className="relative w-full h-56 sm:h-72 bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-400 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
      </div>

      <Container>
        <div className="max-w-5xl mx-auto -mt-20 pb-20">
          {/* ── Profile card ── */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 sm:p-8 mb-8 flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-md">
                {provider.image ? (
                  <Image src={provider.image} alt={provider.name ?? ''} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-brand-100 flex items-center justify-center text-brand-600 text-4xl font-bold">
                    {provider.name?.[0] ?? '?'}
                  </div>
                )}
              </div>
              {provider.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1">
                  <HiCheckBadge size={18} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900">{provider.name}</h1>
                {provider.isVerified && (
                  <span className="text-[10px] tracking-widest uppercase bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                    Verified
                  </span>
                )}
              </div>
              {provider.bio && (
                <p className="text-slate-500 text-sm leading-relaxed mb-4 max-w-xl">{provider.bio}</p>
              )}

              {/* stats row */}
              <div className="flex flex-wrap gap-5">
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <HiBriefcase size={16} className="text-brand-500" />
                  <span className="font-semibold">{provider.listingCount}</span>
                  <span className="text-slate-400">services</span>
                </div>
                {provider.avgRating !== null && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <HiStar size={16} className="text-amber-400" />
                    <span className="font-semibold">{provider.avgRating}</span>
                    <span className="text-slate-400">({provider.reviewCount} reviews)</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <HiChatBubbleLeftRight size={16} className="text-brand-500" />
                  <span className="text-slate-400">Member since {joinYear}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Services ── */}
          {provider.listings.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-slate-100" />
                <h2 className="font-playfair text-xl font-bold text-slate-900">Services Offered</h2>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {provider.listings.map((listing) => (
                  <ListingCard key={listing.id} data={listing as any} currentUser={currentUser} />
                ))}
              </div>
            </section>
          )}

          {/* ── Reviews ── */}
          {provider.reviews.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-slate-100" />
                <h2 className="font-playfair text-xl font-bold text-slate-900">
                  What Clients Say
                </h2>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              {provider.avgRating !== null && (
                <div className="flex items-center gap-4 mb-6 p-5 bg-amber-50 rounded-2xl border border-amber-100">
                  <span className="font-playfair text-5xl font-bold text-amber-500">{provider.avgRating}</span>
                  <div>
                    <StarRating value={Math.round(provider.avgRating)} size={22} />
                    <p className="text-sm text-slate-500 mt-1">{provider.reviewCount} verified reviews</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {provider.reviews.map((r) => (
                  <ReviewCard key={r.id} review={r as any} />
                ))}
              </div>
            </section>
          )}

          {provider.listings.length === 0 && provider.reviews.length === 0 && (
            <p className="text-center text-slate-400 py-16">This provider hasn't listed any services yet.</p>
          )}
        </div>
      </Container>
    </ClientOnly>
  );
}
