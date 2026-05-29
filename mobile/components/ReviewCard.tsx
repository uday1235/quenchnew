import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import StarRating from './StarRating';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

export default function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {review.user.image ? (
          <Image source={{ uri: review.user.image }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitial}>{review.user.name?.[0] ?? '?'}</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{review.user.name ?? 'Anonymous'}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <StarRating value={review.rating} size={13} />
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.slate100,
    gap: 10,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarFallback: { backgroundColor: colors.brandLight, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontWeight: '700', color: colors.brand, fontSize: 14 },
  name: { fontWeight: '700', fontSize: 13, color: colors.slate900 },
  date: { fontSize: 11, color: colors.slate400 },
  comment: { fontSize: 13, color: colors.slate600, lineHeight: 20 },
});
