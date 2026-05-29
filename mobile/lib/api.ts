import axios from 'axios';
import { getToken } from './storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://quenchnew.vercel.app';

const api = axios.create({ baseURL: `${API_URL}/api` });

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['x-client'] = 'mobile';
  }
  return config;
});

export default api;

// ── Auth ──────────────────────────────────────────────────────────
export const sendOtp    = (phone: string) => api.post('/mobile/auth/send-otp', { phone });
export const verifyOtp  = (phone: string, code: string) => api.post('/mobile/auth/verify-otp', { phone, code });
export const googleAuth = (accessToken: string) => api.post('/mobile/auth/google', { accessToken });
export const getMe      = () => api.get('/mobile/me');

// ── Listings ──────────────────────────────────────────────────────
export const getListings = (params?: Record<string, string>) =>
  api.get('/listings', { params });

export const getListing = (id: string) =>
  api.get(`/listings/${id}`);  // uses getListingById via a thin route

// ── Reviews ──────────────────────────────────────────────────────
export const getReviews    = (listingId: string) => api.get(`/reviews/${listingId}`);
export const submitReview  = (listingId: string, rating: number, comment: string) =>
  api.post('/reviews', { listingId, rating, comment });

// ── Reservations ─────────────────────────────────────────────────
export const getMyReservations = () => api.get('/reservations/mine');

// ── Checkout ─────────────────────────────────────────────────────
export const createCheckout = (data: {
  listingId: string;
  scheduledDate: string;
  scheduledTime: string;
  customerPhone: string;
  totalPrice: number;
}) => api.post('/stripe/checkout', data);
