import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' });

export async function POST() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Reuse existing Stripe customer or create one
  let customerId = currentUser.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: currentUser.email!,
      name:  currentUser.name  ?? undefined,
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: currentUser.id },
      data:  { stripeCustomerId: customer.id },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price:    process.env.STRIPE_PROVIDER_MONTHLY_PRICE_ID!,
        quantity: 1,
      },
    ],
    metadata: { userId: currentUser.id },
    success_url: `${process.env.NEXTAUTH_URL}/properties?subscribed=true`,
    cancel_url:  `${process.env.NEXTAUTH_URL}/properties`,
  });

  return NextResponse.json({ url: session.url });
}
