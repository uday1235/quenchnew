import { NextResponse, NextRequest } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { getMobileUser } from "@/app/libs/mobileAuth";

export async function GET(req: NextRequest) {
  const user = (await getMobileUser(req)) ?? (await getCurrentUser());
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const reservations = await prisma.reservation.findMany({
    where: { userId: user.id },
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

export async function POST(
  request: Request, 
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { 
    listingId,
    startDate,
    endDate,
    totalPrice
   } = body;

   if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId
    },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate,
          endDate,
          totalPrice,
        }
      }
    }
  });

  return NextResponse.json(listingAndReservation);
}
