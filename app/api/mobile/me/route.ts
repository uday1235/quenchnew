import { NextResponse, NextRequest } from 'next/server';
import { getMobileUser } from '@/app/libs/mobileAuth';

export async function GET(req: NextRequest) {
  const user = await getMobileUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({
    id: user.id, name: user.name, email: user.email,
    phone: user.phone, image: user.image, role: user.role,
    bio: user.bio, isVerified: user.isVerified,
    subscriptionStatus: user.subscriptionStatus,
  });
}
