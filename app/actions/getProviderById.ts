import prisma from '@/app/libs/prismadb';

export default async function getProviderById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      listings: { orderBy: { createdAt: 'desc' } },
      reviews:  { include: { user: { select: { id: true, name: true, image: true } } }, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!user) return null;

  const avgRating = user.reviews.length
    ? Math.round((user.reviews.reduce((s, r) => s + r.rating, 0) / user.reviews.length) * 10) / 10
    : null;

  return {
    id:                 user.id,
    name:               user.name,
    image:              user.image,
    bio:                user.bio,
    isVerified:         user.isVerified,
    role:               user.role,
    subscriptionStatus: user.subscriptionStatus,
    createdAt:          user.createdAt.toISOString(),
    listings:           user.listings.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() })),
    reviews:            user.reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    avgRating,
    reviewCount:        user.reviews.length,
    listingCount:       user.listings.length,
  };
}

export type ProviderProfile = NonNullable<Awaited<ReturnType<typeof getProviderById>>>;
