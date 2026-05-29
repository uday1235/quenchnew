import prisma from '@/app/libs/prismadb';

export interface IListingsParams {
  userId?: string;
  category?: string;
  q?: string; // free-text search
}

export default async function getListings(params: IListingsParams) {
  try {
    const { userId, category, q } = params;

    let query: any = {};

    if (userId) query.userId = userId;
    if (category) query.category = category;

    if (q) {
      query.OR = [
        { title:       { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category:    { contains: q, mode: 'insensitive' } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: { createdAt: 'desc' },
    });

    return listings.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() }));
  } catch (error: any) {
    throw new Error(error);
  }
}
