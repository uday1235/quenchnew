import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ActivityIndicator, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import api, { createCheckout } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import StarRating from '@/components/StarRating';
import ReviewCard from '@/components/ReviewCard';
import { colors, radius, spacing, shadow } from '@/constants/theme';

const TIME_SLOTS = [
  '08:00 AM','09:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','01:00 PM','02:00 PM','03:00 PM',
  '04:00 PM','05:00 PM','06:00 PM','07:00 PM',
];

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router   = useRouter();

  const [listing,  setListing]  = useState<any>(null);
  const [reviews,  setReviews]  = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [date,     setDate]     = useState('');
  const [time,     setTime]     = useState('');
  const [phone,    setPhone]    = useState(user?.phone ?? '');
  const [booking,  setBooking]  = useState(false);

  // review form
  const [reviewRating,  setReviewRating]  = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting,    setSubmitting]    = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [l, r] = await Promise.all([
          api.get(`/listings/${id}`),
          api.get(`/reviews/${id}`),
        ]);
        setListing(l.data);
        setReviews(r.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const avgRating = reviews.length
    ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length
    : null;

  const handleBook = async () => {
    if (!date || !time || !phone) { Alert.alert('Please fill all booking details'); return; }
    setBooking(true);
    try {
      const { data } = await createCheckout({
        listingId: id, scheduledDate: date, scheduledTime: time,
        customerPhone: phone, totalPrice: listing.price,
      });
      await WebBrowser.openAuthSessionAsync(data.url, 'quench://');
      router.push('/booking-success');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not start payment');
    } finally {
      setBooking(false);
    }
  };

  const handleReview = async () => {
    if (!reviewRating) { Alert.alert('Please select a rating'); return; }
    if (!reviewComment.trim()) { Alert.alert('Please write a review'); return; }
    setSubmitting(true);
    try {
      await api.post('/reviews', { listingId: id, rating: reviewRating, comment: reviewComment });
      const { data } = await api.get(`/reviews/${id}`);
      setReviews(data);
      setReviewRating(0); setReviewComment('');
      Alert.alert('Thank you!', 'Your review has been submitted.');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator color={colors.brand} size="large" />
    </View>
  );

  if (!listing) return (
    <View style={styles.centered}>
      <Text style={{ color: colors.slate500, fontFamily: 'Nunito_700Bold' }}>Service not found.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* hero image */}
        <Image source={{ uri: listing.imageSrc }} style={styles.hero} />

        <View style={styles.body}>
          {/* title & rating */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{listing.title}</Text>
              <View style={styles.row}>
                <Ionicons name="location-outline" size={13} color={colors.slate400} />
                <Text style={styles.location}>{listing.locationValue}</Text>
              </View>
            </View>
            {avgRating !== null && (
              <View style={styles.ratingBox}>
                <Text style={styles.ratingNum}>{avgRating.toFixed(1)}</Text>
                <StarRating value={Math.round(avgRating)} size={13} />
                <Text style={styles.ratingCount}>({reviews.length})</Text>
              </View>
            )}
          </View>

          {/* category */}
          <View style={styles.catBadge}>
            <Text style={styles.catText}>{listing.category}</Text>
          </View>

          {/* description */}
          <Text style={styles.desc}>{listing.description}</Text>

          {/* provider */}
          {listing.user && (
            <TouchableOpacity
              style={styles.providerCard}
              onPress={() => router.push(`/provider/${listing.userId}`)}
              activeOpacity={0.85}
            >
              {listing.user.image ? (
                <Image source={{ uri: listing.user.image }} style={styles.providerAvatar} />
              ) : (
                <View style={[styles.providerAvatar, { backgroundColor: colors.brandLight, alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ color: colors.brand, fontWeight: '700' }}>{listing.user.name?.[0]}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.providerName}>{listing.user.name}</Text>
                <Text style={styles.providerLink}>View full profile →</Text>
              </View>
              {listing.user.isVerified && <Ionicons name="checkmark-circle" size={18} color={colors.emerald} />}
            </TouchableOpacity>
          )}

          {/* ── Booking form ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Book a Session</Text>
          </View>

          <View style={styles.bookingForm}>
            <Text style={styles.fieldLabel}>Date</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.slate400}
              value={date}
              onChangeText={setDate}
              keyboardType="numbers-and-punctuation"
            />

            <Text style={styles.fieldLabel}>Time Slot</Text>
            <View style={styles.slotsGrid}>
              {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slot, time === slot && styles.slotActive]}
                  onPress={() => setTime(slot)}
                >
                  <Text style={[styles.slotText, time === slot && styles.slotTextActive]}>{slot}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Your Phone</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="+91 9876543210"
              placeholderTextColor={colors.slate400}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Total</Text>
              <Text style={styles.price}>₹{listing.price}</Text>
            </View>

            <TouchableOpacity style={styles.payBtn} onPress={handleBook} disabled={booking} activeOpacity={0.85}>
              {booking
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.payBtnText}>Pay & Book →</Text>
              }
            </TouchableOpacity>
          </View>

          {/* ── Reviews ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {avgRating !== null && <Text style={styles.avgRating}>{avgRating.toFixed(1)} ★</Text>}
          </View>

          {user && (
            <View style={styles.reviewForm}>
              <Text style={styles.fieldLabel}>Your Rating</Text>
              <StarRating value={reviewRating} size={28} interactive onChange={setReviewRating} />
              <TextInput
                style={styles.reviewInput}
                placeholder="Share your experience…"
                placeholderTextColor={colors.slate400}
                multiline
                numberOfLines={3}
                value={reviewComment}
                onChangeText={setReviewComment}
              />
              <TouchableOpacity style={styles.reviewBtn} onPress={handleReview} disabled={submitting}>
                <Text style={styles.reviewBtnText}>{submitting ? 'Submitting…' : 'Submit Review'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {reviews.map((r: any) => (
            <ReviewCard key={r.id} review={r} />
          ))}

          {reviews.length === 0 && (
            <Text style={styles.noReviews}>No reviews yet. Be the first!</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { width: '100%', height: 280 },
  body: { padding: spacing.lg, gap: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: colors.slate900, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { fontSize: 13, color: colors.slate500, fontFamily: 'Nunito_400Regular' },
  ratingBox: { alignItems: 'center', gap: 2, backgroundColor: colors.brandLight, padding: spacing.sm, borderRadius: radius.md },
  ratingNum: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: colors.brand },
  ratingCount: { fontSize: 11, color: colors.slate400, fontFamily: 'Nunito_400Regular' },
  catBadge: { alignSelf: 'flex-start', backgroundColor: colors.brandLight, paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full },
  catText: { fontSize: 12, fontWeight: '700', color: colors.brand },
  desc: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: colors.slate600, lineHeight: 22 },
  providerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.slate100, ...shadow.sm },
  providerAvatar: { width: 44, height: 44, borderRadius: 22 },
  providerName: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.slate900 },
  providerLink: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: colors.brand },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.slate100, paddingTop: spacing.md },
  sectionTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.slate900 },
  avgRating: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: colors.amber },
  bookingForm: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md, borderWidth: 1, borderColor: colors.slate100, ...shadow.sm },
  fieldLabel: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: colors.slate700 },
  dateInput: { borderWidth: 2, borderColor: colors.slate200, borderRadius: radius.xl, paddingHorizontal: spacing.md, paddingVertical: 12, fontSize: 15, color: colors.slate900, fontFamily: 'Nunito_400Regular' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.slate200, backgroundColor: colors.white },
  slotActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  slotText: { fontSize: 12, fontWeight: '700', color: colors.slate600 },
  slotTextActive: { color: colors.white },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.slate100, paddingTop: spacing.sm },
  priceLabel: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.slate700 },
  price: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: colors.brand },
  payBtn: { backgroundColor: colors.brand, borderRadius: radius.xl, paddingVertical: 16, alignItems: 'center', ...shadow.md },
  payBtnText: { color: '#fff', fontFamily: 'Nunito_800ExtraBold', fontSize: 16 },
  reviewForm: { backgroundColor: colors.brandLight, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.sm, borderWidth: 1, borderColor: '#c7d2fe' },
  reviewInput: { borderWidth: 2, borderColor: colors.slate200, borderRadius: radius.xl, padding: spacing.md, fontSize: 14, color: colors.slate900, fontFamily: 'Nunito_400Regular', minHeight: 80, textAlignVertical: 'top', backgroundColor: colors.white },
  reviewBtn: { backgroundColor: colors.brand, borderRadius: radius.xl, paddingVertical: 12, alignItems: 'center' },
  reviewBtnText: { color: '#fff', fontFamily: 'Nunito_800ExtraBold', fontSize: 14 },
  noReviews: { textAlign: 'center', color: colors.slate400, fontFamily: 'Nunito_400Regular', fontSize: 13, paddingVertical: spacing.lg },
});
