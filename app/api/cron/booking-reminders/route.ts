import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { sendPushToMany } from '@/app/libs/expoPush';

// Vercel calls this every hour via vercel.json cron
// Finds bookings scheduled ~1 hour from now and sends a reminder push
export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now       = new Date();
  const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

  // Format as YYYY-MM-DD to match scheduledDate string in DB
  const targetDate = inOneHour.toISOString().split('T')[0];

  // Format hour as "HH:00 AM/PM" to loosely match scheduledTime
  const targetHour = inOneHour.getHours();
  const ampm  = targetHour >= 12 ? 'PM' : 'AM';
  const hour12 = targetHour % 12 || 12;
  const timePrefix = `${String(hour12).padStart(2, '0')}:00 ${ampm}`;

  const reservations = await prisma.reservation.findMany({
    where: {
      status:        'PAID',
      scheduledDate: targetDate,
      scheduledTime: { startsWith: timePrefix.slice(0, 5) }, // match "HH:MM"
    },
    include: { user: true, listing: true },
  });

  const messages = reservations
    .filter((r) => r.user.pushToken)
    .map((r) => ({
      to:    r.user.pushToken!,
      title: '⏰ Upcoming Session Reminder',
      body:  `${r.listing.title} starts in 1 hour at ${r.scheduledTime}`,
      data:  { type: 'booking_reminder', reservationId: r.id },
    }));

  if (messages.length > 0) {
    await sendPushToMany(messages);
  }

  return NextResponse.json({ sent: messages.length, targetDate, timePrefix });
}
