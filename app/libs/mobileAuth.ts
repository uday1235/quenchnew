import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import prisma from './prismadb';

const SECRET = process.env.MOBILE_JWT_SECRET || process.env.NEXTAUTH_SECRET!;

export function signMobileToken(userId: string) {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: '90d' });
}

export function verifyMobileToken(token: string): { sub: string } | null {
  try {
    return jwt.verify(token, SECRET) as { sub: string };
  } catch {
    return null;
  }
}

export async function getMobileUser(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const payload = verifyMobileToken(auth.slice(7));
  if (!payload) return null;
  return prisma.user.findUnique({ where: { id: payload.sub } });
}
