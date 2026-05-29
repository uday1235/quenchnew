import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { getMobileUser } from '@/app/libs/mobileAuth';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function GET(req: NextRequest) {
  const user = (await getMobileUser(req)) ?? (await getCurrentUser());
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const reservations = await prisma.reservation.findMany({
    where: { listing: { userId: user.id } },
    include: { listing: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    reservations.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      startDate: r.startDate.toISOString(),
      endDate:   r.endDate.toISOString(),
      listing:   { ...r.listing, createdAt: r.listing.createdAt.toISOString() },
    }))
  );
}
