import prisma from '@/app/libs/prismadb';

export interface IListingsParams {
  userId?: string;
  category?: string;
  q?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const { userId, category, q, location, minPrice, maxPrice } = params;

    let query: any = {};

    if (userId) query.userId = userId;
    if (category) query.category = category;
    if (location) query.locationValue = { equals: location, mode: 'insensitive' };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.gte = parseInt(minPrice);
      if (maxPrice) query.price.lte = parseInt(maxPrice);
    }

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
