import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '@/constants/theme';
import StarRating from './StarRating';

interface Listing {
  id: string;
  title: string;
  imageSrc: string;
  category: string;
  locationValue: string;
  price: number;
  avgRating?: number;
  reviewCount?: number;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={() => router.push(`/listing/${listing.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: listing.imageSrc }} style={styles.image} resizeMode="cover" />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{listing.category}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={12} color={colors.slate400} />
          <Text style={styles.location}>{listing.locationValue}</Text>
        </View>

        {listing.avgRating !== undefined && (
          <View style={styles.row}>
            <StarRating value={Math.round(listing.avgRating)} size={12} />
            <Text style={styles.ratingText}>
              {listing.avgRating.toFixed(1)}
              {listing.reviewCount !== undefined && ` (${listing.reviewCount})`}
            </Text>
          </View>
        )}

        <View style={styles.priceRow}>
          <Ionicons name="logo-usd" size={14} color={colors.brand} />
          <Text style={styles.price}>₹{listing.price}</Text>
          <Text style={styles.priceSuffix}> / session</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.slate100,
    ...shadow.sm,
  },
  imageContainer: { width: '100%', aspectRatio: 1, position: 'relative' },
  image: { width: '100%', height: '100%' },
  categoryBadge: {
    position: 'absolute', bottom: 10, left: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.brandLight,
  },
  categoryText: { fontSize: 11, fontWeight: '700', color: colors.brand },
  body: { padding: spacing.md, gap: 4 },
  title: { fontSize: 14, fontWeight: '700', color: colors.slate900 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { fontSize: 12, color: colors.slate500 },
  ratingText: { fontSize: 11, color: colors.slate500, fontWeight: '600' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  price: { fontSize: 18, fontWeight: '800', color: colors.brand },
  priceSuffix: { fontSize: 12, color: colors.slate400 },
});
