import prisma from '@/app/libs/prismadb';

export default async function getReviews(listingId: string) {
  const reviews = await prisma.review.findMany({
    where: { listingId },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return reviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));
}

export type SafeReview = Awaited<ReturnType<typeof getReviews>>[number];
