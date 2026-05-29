import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { signMobileToken } from '@/app/libs/mobileAuth';

export async function POST(req: Request) {
  const { accessToken } = await req.json();
  if (!accessToken) return NextResponse.json({ error: 'Access token required' }, { status: 400 });

  const googleRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!googleRes.ok) return NextResponse.json({ error: 'Invalid Google token' }, { status: 401 });

  const googleUser = await googleRes.json();
  const { email, name, picture, id: googleId } = googleUser;

  let user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email, name, image: picture, role: 'CUSTOMER', emailVerified: new Date() },
    });
  }

  // link Google account if not already linked
  const existing = await prisma.account.findUnique({
    where: { provider_providerAccountId: { provider: 'google', providerAccountId: googleId } },
  });
  if (!existing) {
    await prisma.account.create({
      data: { userId: user.id, type: 'oauth', provider: 'google', providerAccountId: googleId },
    });
  }

  const token = signMobileToken(user.id);
  return NextResponse.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role },
  });
}
