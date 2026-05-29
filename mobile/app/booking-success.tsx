import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';
import { colors, radius, spacing, shadow } from '@/constants/theme';

export default function BookingSuccessScreen() {
  const { reservation } = useLocalSearchParams<{ reservation?: string }>();
  const router = useRouter();
  const [res, setRes]       = useState<any>(null);
  const [loading, setLoading] = useState(!!reservation);

  useEffect(() => {
    if (!reservation) return;
    api.get(`/reservations/${reservation}`)
      .then(({ data }) => setRes(data))
      .finally(() => setLoading(false));
  }, [reservation]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={80} color={colors.emerald} />
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.sub}>
          Your session has been booked. Check your phone for an SMS confirmation.
        </Text>

        {loading && <ActivityIndicator color={colors.brand} style={{ marginTop: spacing.lg }} />}

        {res && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{res.listing?.title}</Text>
            {res.scheduledDate && (
              <View style={styles.row}>
                <Ionicons name="calendar-outline" size={16} color={colors.slate400} />
                <Text style={styles.detail}>{res.scheduledDate}</Text>
              </View>
            )}
            {res.scheduledTime && (
              <View style={styles.row}>
                <Ionicons name="time-outline" size={16} color={colors.slate400} />
                <Text style={styles.detail}>{res.scheduledTime}</Text>
              </View>
            )}
            <View style={[styles.row, { marginTop: spacing.sm }]}>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>PAID</Text>
              </View>
              <Text style={styles.amount}>₹{res.totalPrice}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)/bookings')} activeOpacity={0.85}>
          <Text style={styles.btnText}>View My Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/(tabs)')} activeOpacity={0.7}>
          <Text style={styles.link}>← Browse more services</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
  iconWrap: { backgroundColor: '#ecfdf5', borderRadius: radius.full, padding: spacing.lg },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 30, color: colors.slate900, textAlign: 'center' },
  sub: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: colors.slate500, textAlign: 'center', lineHeight: 22 },
  card: { width: '100%', backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.lg, gap: 10, borderWidth: 1, borderColor: colors.slate100, ...shadow.sm },
  cardTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 18, color: colors.slate900 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detail: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: colors.slate600 },
  paidBadge: { backgroundColor: '#ecfdf5', paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full },
  paidText: { fontWeight: '800', fontSize: 11, color: colors.emerald, letterSpacing: 1 },
  amount: { fontFamily: 'Nunito_800ExtraBold', fontSize: 18, color: colors.brand },
  btn: { width: '100%', backgroundColor: colors.brand, borderRadius: radius.xl, paddingVertical: 16, alignItems: 'center', ...shadow.md },
  btnText: { color: '#fff', fontFamily: 'Nunito_800ExtraBold', fontSize: 16 },
  link: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: colors.brand },
});
