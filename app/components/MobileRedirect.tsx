'use client';

import { useEffect } from 'react';

export default function MobileRedirect({ reservationId }: { reservationId: string }) {
  useEffect(() => {
    const deepLink = `quench://booking-success?reservation=${reservationId}`;
    window.location.href = deepLink;
  }, [reservationId]);

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <p className="text-sm text-slate-500">Redirecting back to the app…</p>
      <a
        href={`quench://booking-success?reservation=${reservationId}`}
        className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition"
      >
        Open in Quench App
      </a>
    </div>
  );
}
