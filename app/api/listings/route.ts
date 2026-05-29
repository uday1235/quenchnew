import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category  = searchParams.get('category')  ?? undefined;
  const q         = searchParams.get('q')         ?? undefined;
  const location  = searchParams.get('location')  ?? undefined;
  const minPrice  = searchParams.get('minPrice')  ?? undefined;
  const maxPrice  = searchParams.get('maxPrice')  ?? undefined;

  const where: any = {};
  if (category) where.category = category;
  if (location) where.locationValue = { equals: location, mode: 'insensitive' };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseInt(minPrice);
    if (maxPrice) where.price.lte = parseInt(maxPrice);
  }
  if (q) {
    where.OR = [
      { title:       { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { category:    { contains: q, mode: 'insensitive' } },
    ];
  }

  const listings = await prisma.listing.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    listings.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() }))
  );
}

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
