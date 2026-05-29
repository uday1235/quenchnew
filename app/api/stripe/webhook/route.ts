import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import twilio from 'twilio';
import prisma from '@/app/libs/prismadb';
import { sendPushNotification } from '@/app/libs/expoPush';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' });

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(to: string, body: string) {
  try {
    await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    });
  } catch (err) {
    console.error('Twilio SMS error:', err);
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig  = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  // ── Per-session payment succeeded ──────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.mode === 'payment') {
      const { reservationId, customerPhone, listingTitle, scheduledDate, scheduledTime } =
        session.metadata ?? {};

      if (reservationId) {
        await prisma.reservation.update({
          where: { id: reservationId },
          data: {
            status:          'PAID',
            stripePaymentId: session.payment_intent as string,
          },
        });

        // SMS to customer
        if (customerPhone) {
          await sendSMS(
            customerPhone,
            `✅ Booking Confirmed!\nService: ${listingTitle}\nDate: ${scheduledDate}\nTime: ${scheduledTime}\nThank you for booking via Quench!`
          );
        }

        // SMS + push to provider
        const reservation = await prisma.reservation.findUnique({
          where: { id: reservationId },
          include: { listing: true, user: true },
        });

        if (reservation?.listing.phone) {
          await sendSMS(
            reservation.listing.phone,
            `🔔 New Booking!\nService: ${listingTitle}\nDate: ${scheduledDate}\nTime: ${scheduledTime}\nCustomer will contact you shortly.`
          );
        }

        // push → customer
        if (reservation?.user.pushToken) {
          await sendPushNotification({
            to:    reservation.user.pushToken,
            title: '✅ Booking Confirmed!',
            body:  `${listingTitle} on ${scheduledDate} at ${scheduledTime}`,
            data:  { type: 'booking_confirmed', reservationId },
          });
        }

        // push → provider
        const provider = await prisma.user.findUnique({
          where: { id: reservation?.listing.userId },
        });
        if (provider?.pushToken) {
          await sendPushNotification({
            to:    provider.pushToken,
            title: '🔔 New Booking Received!',
            body:  `${listingTitle} — ${scheduledDate} at ${scheduledTime}`,
            data:  { type: 'new_booking', reservationId },
          });
        }
      }
    }

    // ── Provider subscription activated ──────────────────────────
    if (session.mode === 'subscription') {
      const userId = session.metadata?.userId;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: session.subscription as string,
            subscriptionStatus:   'active',
            role:                 'PROVIDER',
          },
        });
      }
    }
  }

  // ── Subscription cancelled / past-due ─────────────────────────
  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    await prisma.user.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data:  { subscriptionStatus: sub.status },
    });
  }

  return NextResponse.json({ received: true });
}
