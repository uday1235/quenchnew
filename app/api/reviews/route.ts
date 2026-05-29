import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { listingId, rating, comment } = await request.json();

  if (!listingId || !rating || !comment?.trim()) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Only allow reviews from users who have a PAID reservation for this listing
  const paidReservation = await prisma.reservation.findFirst({
    where: { userId: currentUser.id, listingId, status: 'PAID' },
  });
  if (!paidReservation) {
    return NextResponse.json({ error: 'You can only review services you have booked' }, { status: 403 });
  }

  const review = await prisma.review.upsert({
    where: { userId_listingId: { userId: currentUser.id, listingId } },
    update: { rating, comment: comment.trim() },
    create: { userId: currentUser.id, listingId, rating, comment: comment.trim() },
  });

  return NextResponse.json(review);
}
