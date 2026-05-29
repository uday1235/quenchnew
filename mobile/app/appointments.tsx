import { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';
import { colors, radius, spacing, shadow } from '@/constants/theme';

const STATUS_COLOR: Record<string, string> = {
  PAID: '#10b981', PENDING: '#f59e0b', CONFIRMED: '#4f46e5', CANCELLED: '#94a3b8',
};

export default function AppointmentsScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, []);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.slate900} />
        </TouchableOpacity>
        <Text style={styles.title}>My Appointments</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 60 }} color={colors.brand} size="large" />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.listing?.imageSrc }} style={styles.thumb} />
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.listing?.title}</Text>
                <View style={styles.row}>
                  <Ionicons name="calendar-outline" size={13} color={colors.slate400} />
                  <Text style={styles.detail}>{item.scheduledDate ?? 'No date'}</Text>
                </View>
                <View style={styles.row}>
                  <Ionicons name="time-outline" size={13} color={colors.slate400} />
                  <Text style={styles.detail}>{item.scheduledTime ?? 'No time'}</Text>
                </View>
                {item.customerPhone && (
                  <View style={styles.row}>
                    <Ionicons name="call-outline" size={13} color={colors.slate400} />
                    <Text style={styles.detail}>{item.customerPhone}</Text>
                  </View>
                )}
                <View style={styles.statusRow}>
                  <View style={[styles.badge, { backgroundColor: (STATUS_COLOR[item.status] ?? colors.slate400) + '22' }]}>
                    <Text style={[styles.badgeText, { color: STATUS_COLOR[item.status] ?? colors.slate400 }]}>
                      {item.status}
                    </Text>
                  </View>
                  <Text style={styles.price}>₹{item.totalPrice}</Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={56} color={colors.slate200} />
              <Text style={styles.emptyTitle}>No appointments yet</Text>
              <Text style={styles.emptySub}>Customer bookings for your services will appear here.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: colors.background },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.slate100 },
  title:      { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.slate900 },
  list:       { padding: spacing.md, gap: 12 },
  card:       { backgroundColor: colors.white, borderRadius: radius.lg, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: colors.slate100, ...shadow.sm },
  thumb:      { width: 90, height: 90 },
  info:       { flex: 1, padding: spacing.sm, gap: 3 },
  name:       { fontFamily: 'Nunito_700Bold', fontSize: 14, color: colors.slate900 },
  row:        { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detail:     { fontSize: 12, color: colors.slate500, fontFamily: 'Nunito_400Regular' },
  statusRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  badge:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full },
  badgeText:  { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  price:      { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: colors.brand },
  empty:      { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.slate700 },
  emptySub:   { fontFamily: 'Nunito_400Regular', fontSize: 14, color: colors.slate400, textAlign: 'center', paddingHorizontal: 40 },
});
