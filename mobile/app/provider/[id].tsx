import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import ReviewCard from '@/components/ReviewCard';
import StarRating from '@/components/StarRating';
import { colors, radius, spacing, shadow } from '@/constants/theme';

export default function ProviderProfileScreen() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get(`/providers/${id}`)
      .then(({ data }) => setProvider(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator color={colors.brand} size="large" />
    </View>
  );
  if (!provider) return (
    <View style={styles.centered}>
      <Text style={{ color: colors.slate500, fontFamily: 'Nunito_700Bold' }}>Provider not found.</Text>
    </View>
  );

  const avgRating = provider.avgRating;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* hero */}
        <View style={styles.hero} />

        <View style={styles.body}>
          {/* profile card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              {provider.image ? (
                <Image source={{ uri: provider.image }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <Text style={styles.avatarInitial}>{provider.name?.[0] ?? '?'}</Text>
                </View>
              )}
              {provider.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.emerald} />
                </View>
              )}
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{provider.name}</Text>
                {provider.isVerified && (
                  <View style={styles.verifiedChip}>
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              {provider.bio && <Text style={styles.bio}>{provider.bio}</Text>}

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{provider.listingCount}</Text>
                  <Text style={styles.statLabel}>Services</Text>
                </View>
                {avgRating !== null && (
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{avgRating}</Text>
                    <Text style={styles.statLabel}>Rating</Text>
                  </View>
                )}
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{provider.reviewCount}</Text>
                  <Text style={styles.statLabel}>Reviews</Text>
                </View>
              </View>
            </View>
          </View>

          {/* services */}
          {provider.listings?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Services Offered</Text>
              {provider.listings.map((l: any) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </>
          )}

          {/* reviews */}
          {provider.reviews?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>What Clients Say</Text>

              {avgRating && (
                <View style={styles.ratingOverview}>
                  <Text style={styles.bigRating}>{avgRating}</Text>
                  <View>
                    <StarRating value={Math.round(avgRating)} size={22} />
                    <Text style={styles.ratingSubtitle}>{provider.reviewCount} verified reviews</Text>
                  </View>
                </View>
              )}

              {provider.reviews.map((r: any) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { height: 140, backgroundColor: colors.brand },
  body: { padding: spacing.lg, gap: spacing.lg, marginTop: -48 },
  profileCard: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.lg, flexDirection: 'row', gap: spacing.md, ...shadow.md, borderWidth: 1, borderColor: colors.slate100 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: radius.lg, borderWidth: 3, borderColor: colors.white },
  avatarFallback: { backgroundColor: colors.brandLight, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: colors.brand },
  verifiedBadge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: colors.white, borderRadius: 12 },
  profileInfo: { flex: 1, gap: 6 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  name: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 18, color: colors.slate900 },
  verifiedChip: { backgroundColor: '#ecfdf5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full, borderWidth: 1, borderColor: '#a7f3d0' },
  verifiedText: { fontSize: 10, fontWeight: '700', color: colors.emerald, letterSpacing: 0.5 },
  bio: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: colors.slate500, lineHeight: 20 },
  statsRow: { flexDirection: 'row', gap: spacing.lg, marginTop: 4 },
  stat: { alignItems: 'center' },
  statValue: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 18, color: colors.brand },
  statLabel: { fontFamily: 'Nunito_400Regular', fontSize: 11, color: colors.slate400 },
  sectionTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.slate900 },
  ratingOverview: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, backgroundColor: '#fffbeb', padding: spacing.md, borderRadius: radius.xl, borderWidth: 1, borderColor: '#fde68a' },
  bigRating: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 48, color: colors.amber },
  ratingSubtitle: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: colors.slate500, marginTop: 4 },
});
