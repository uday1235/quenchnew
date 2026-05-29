import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' });

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const baseUrl = process.env.NEXTAUTH_URL || new URL(request.url).origin;

  const body = await request.json();
  const { listingId, scheduledDate, scheduledTime, customerPhone, totalPrice } = body;

  if (!listingId || !scheduledDate || !scheduledTime || !customerPhone || !totalPrice) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

  // Create a pending reservation first — updated to PAID via webhook
  const reservation = await prisma.reservation.create({
    data: {
      userId: currentUser.id,
      listingId,
      startDate: new Date(scheduledDate),
      endDate: new Date(scheduledDate),
      totalPrice,
      scheduledDate,
      scheduledTime,
      customerPhone,
      status: 'PENDING',
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'inr',
          unit_amount: totalPrice * 100, // paise
          product_data: {
            name: listing.title,
            description: `Session on ${scheduledDate} at ${scheduledTime}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      reservationId: reservation.id,
      customerPhone,
      listingTitle: listing.title,
      scheduledDate,
      scheduledTime,
    },
    success_url: `${baseUrl}/bookings/success?reservation=${reservation.id}`,
    cancel_url:  `${baseUrl}/listings/${listingId}`,
  });

  // Store Stripe session ID on the reservation
  await prisma.reservation.update({
    where: { id: reservation.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url });
}
