import { NextResponse } from 'next/server';
import getProviderById from '@/app/actions/getProviderById';

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
  const provider = await getProviderById(params.userId);
  if (!provider) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(provider);
}
