import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { getMobileUser } from '@/app/libs/mobileAuth';

export async function POST(req: NextRequest) {
  const user = await getMobileUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { token } = await req.json();
  if (!token?.startsWith('ExponentPushToken')) {
    return NextResponse.json({ error: 'Invalid push token' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data:  { pushToken: token },
  });

  return NextResponse.json({ success: true });
}
