import { NextResponse } from 'next/server';
import getReviews from '@/app/actions/getReviews';

export async function GET(_req: Request, { params }: { params: { listingId: string } }) {
  const reviews = await getReviews(params.listingId);
  return NextResponse.json(reviews);
}
