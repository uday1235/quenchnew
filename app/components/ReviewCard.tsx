import { SafeReview } from '@/app/actions/getReviews';
import { format } from 'date-fns';
import Avatar from './Avatar';
import StarRating from './StarRating';

export default function ReviewCard({ review }: { review: SafeReview }) {
  return (
    <div className="flex flex-col gap-3 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar src={review.user.image} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate">{review.user.name ?? 'Anonymous'}</p>
          <p className="text-xs text-slate-400">{format(new Date(review.createdAt), 'MMM d, yyyy')}</p>
        </div>
        <StarRating value={review.rating} size={14} />
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
    </div>
  );
}
