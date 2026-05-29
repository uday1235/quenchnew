import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 });

    if (!process.env.TWILIO_VERIFY_SERVICE_SID)
      return NextResponse.json({ error: 'TWILIO_VERIFY_SERVICE_SID not set' }, { status: 500 });

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phone, channel: 'sms' });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Unknown error', code: err?.code },
      { status: 500 }
    );
  }
}
