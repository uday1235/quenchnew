'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import StarRating from './StarRating';
import Button from './Button';

export default function ReviewForm({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [rating, setRating]     = useState(0);
  const [comment, setComment]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return toast.error('Please select a star rating');
    if (!comment.trim()) return toast.error('Please write a short review');
    setLoading(true);
    try {
      await axios.post('/api/reviews', { listingId, rating, comment });
      toast.success('Review submitted — thank you!');
      setSubmitted(true);
      router.refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? 'Could not submit review');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
        <p className="font-semibold text-emerald-700">Thanks for your review!</p>
        <p className="text-sm text-emerald-600 mt-1">Your feedback helps others find great services.</p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-brand-50 border border-brand-100 rounded-2xl flex flex-col gap-4">
      <div>
        <p className="font-semibold text-slate-800 mb-1">Leave a Review</p>
        <p className="text-xs text-slate-500">Share your experience to help others.</p>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Your rating</p>
        <StarRating value={rating} size={28} interactive onChange={setRating} />
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="How was the experience? Was the provider professional and punctual?"
        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand-400 transition resize-none"
      />

      <Button
        label={loading ? 'Submitting…' : 'Submit Review'}
        onClick={handleSubmit}
        disabled={loading || !rating || !comment.trim()}
      />
    </div>
  );
}
