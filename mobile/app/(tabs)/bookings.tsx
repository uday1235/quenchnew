import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, shadow } from '@/constants/theme';

const STATUS_COLOR: Record<string, string> = {
  PAID:      '#10b981',
  PENDING:   '#f59e0b',
  CONFIRMED: '#4f46e5',
  CANCELLED: '#94a3b8',
};

export default function BookingsScreen() {
  const { user } = useAuth();
  const router   = useRouter();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/reservations', { params: { userId: user?.id } });
      setReservations(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { if (user) load(); }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) return (
    <SafeAreaView style={styles.safe}>
      <ActivityIndicator style={{ marginTop: 60 }} color={colors.brand} size="large" />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Bookings</Text>
        <Text style={styles.sub}>{reservations.length} booking{reservations.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={reservations}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/listing/${item.listingId}`)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: item.listing.imageSrc }} style={styles.thumb} />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>{item.listing.title}</Text>
              <View style={styles.row}>
                <Ionicons name="calendar-outline" size={13} color={colors.slate400} />
                <Text style={styles.detail}>{item.scheduledDate}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="time-outline" size={13} color={colors.slate400} />
                <Text style={styles.detail}>{item.scheduledTime}</Text>
              </View>
              <View style={styles.statusRow}>
                <View style={[styles.badge, { backgroundColor: (STATUS_COLOR[item.status] ?? colors.slate400) + '22' }]}>
                  <Text style={[styles.badgeText, { color: STATUS_COLOR[item.status] ?? colors.slate400 }]}>
                    {item.status}
                  </Text>
                </View>
                <Text style={styles.price}>₹{item.totalPrice}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={56} color={colors.slate200} />
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptySub}>Browse services and book your first session!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.white, padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.slate100 },
  heading: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 26, color: colors.slate900 },
  sub: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: colors.slate500, marginTop: 2 },
  list: { padding: spacing.md, gap: 12 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: colors.slate100, ...shadow.sm },
  thumb: { width: 90, height: 90 },
  info: { flex: 1, padding: spacing.sm, gap: 4 },
  title: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: colors.slate900 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detail: { fontSize: 12, color: colors.slate500, fontFamily: 'Nunito_400Regular' },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  price: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: colors.brand },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.slate700 },
  emptySub: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: colors.slate400, textAlign: 'center', paddingHorizontal: 40 },
});
