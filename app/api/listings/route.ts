import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.error();

  const body = await request.json();
  const { title, description, imageSrc, category, location, price, phone, contactEmail, idProofUrl } = body;

  if (!title || !description || !imageSrc || !category || !location || !price) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Persist ID proof on the user record too
  if (idProofUrl) {
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { idProofUrl, role: 'PROVIDER' },
    });
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      locationValue: location.value,
      price: parseInt(price, 10),
      phone: phone ?? null,
      contactEmail: contactEmail ?? null,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing);
}
