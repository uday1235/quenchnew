import { redirect } from 'next/navigation';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import Container from '@/app/components/Container';
import { HiCheckCircle, HiPhone, HiMail, HiCalendar, HiClock } from 'react-icons/hi';

interface SuccessPageProps {
  searchParams: { reservation?: string };
}

export default async function BookingSuccessPage({ searchParams }: SuccessPageProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/');

  const reservationId = searchParams.reservation;
  if (!reservationId) redirect('/');

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { listing: true },
  });

  if (!reservation || reservation.userId !== currentUser.id) redirect('/');

  const isPaid = reservation.status === 'PAID' || reservation.status === 'CONFIRMED';

  return (
    <Container>
      <div className="max-w-lg mx-auto py-16 flex flex-col items-center gap-8">
        {/* success icon */}
        <div className="flex flex-col items-center gap-3 text-center">
          <HiCheckCircle size={64} className="text-emerald-500" />
          <h1 className="text-3xl font-bold text-slate-900">Booking Confirmed!</h1>
          <p className="text-slate-500">
            Your session has been booked{isPaid ? ' and payment received' : ''}. Check your phone for an SMS confirmation.
          </p>
        </div>

        {/* booking details */}
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-brand-600 px-6 py-4">
            <h2 className="text-white font-semibold text-lg">{reservation.listing.title}</h2>
            <p className="text-brand-100 text-sm">{reservation.listing.category}</p>
          </div>

          <div className="p-6 flex flex-col gap-4">
            {reservation.scheduledDate && (
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <HiCalendar size={18} className="text-brand-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Date</p>
                  <p className="font-semibold">{reservation.scheduledDate}</p>
                </div>
              </div>
            )}

            {reservation.scheduledTime && (
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <HiClock size={18} className="text-brand-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Time</p>
                  <p className="font-semibold">{reservation.scheduledTime}</p>
                </div>
              </div>
            )}

            {/* provider contact — revealed after payment */}
            {isPaid && (
              <>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                    Provider Contact
                  </p>

                  {reservation.listing.phone && (
                    <a
                      href={`tel:${reservation.listing.phone}`}
                      className="flex items-center gap-3 text-slate-700 hover:text-brand-600 transition mb-3"
                    >
                      <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <HiPhone size={18} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Mobile</p>
                        <p className="font-semibold">{reservation.listing.phone}</p>
                      </div>
                    </a>
                  )}

                  {reservation.listing.contactEmail && (
                    <a
                      href={`mailto:${reservation.listing.contactEmail}`}
                      className="flex items-center gap-3 text-slate-700 hover:text-brand-600 transition"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <HiMail size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Email</p>
                        <p className="font-semibold">{reservation.listing.contactEmail}</p>
                      </div>
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <a
          href="/"
          className="text-sm text-brand-600 hover:underline font-medium"
        >
          ← Browse more services
        </a>
      </div>
    </Container>
  );
}
