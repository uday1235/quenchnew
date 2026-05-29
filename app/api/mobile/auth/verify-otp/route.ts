import { NextResponse } from 'next/server';
import twilio from 'twilio';
import prisma from '@/app/libs/prismadb';
import { signMobileToken } from '@/app/libs/mobileAuth';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req: Request) {
  const { phone, code } = await req.json();
  if (!phone || !code) return NextResponse.json({ error: 'Phone and code required' }, { status: 400 });

  const result = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
    .verificationChecks.create({ to: phone, code });

  if (result.status !== 'approved') {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
  }

  let user = await prisma.user.findFirst({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({
      data: { phone, name: phone, role: 'CUSTOMER' },
    });
  }

  const token = signMobileToken(user.id);
  return NextResponse.json({
    token,
    user: { id: user.id, name: user.name, phone: user.phone, image: user.image, role: user.role },
  });
}
