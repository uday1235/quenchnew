import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { getMobileUser } from '@/app/libs/mobileAuth';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function GET(req: NextRequest) {
  const user = (await getMobileUser(req)) ?? (await getCurrentUser());
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const listings = await prisma.listing.findMany({
    where: { id: { in: user.favoriteIds } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    listings.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() }))
  );
}
