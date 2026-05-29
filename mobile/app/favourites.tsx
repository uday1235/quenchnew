import { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import { colors, spacing, shadow } from '@/constants/theme';

export default function FavouritesScreen() {
  const router = useRouter();
  const [listings,   setListings]   = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/favourites');
      setListings(data);
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
        <Text style={styles.title}>My Favourites</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 60 }} color={colors.brand} size="large" />
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(i) => i.id}
          numColumns={2}
          contentContainerStyle={{ padding: spacing.md, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <ListingCard listing={item} />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="heart-outline" size={56} color={colors.slate200} />
              <Text style={styles.emptyTitle}>No favourites yet</Text>
              <Text style={styles.emptySub}>Tap the heart on any listing to save it here.</Text>
              <TouchableOpacity style={styles.browseBtn} onPress={() => router.replace('/(tabs)')}>
                <Text style={styles.browseBtnText}>Browse Services</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.background },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.slate100 },
  title:        { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.slate900 },
  empty:        { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle:   { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.slate700 },
  emptySub:     { fontFamily: 'Nunito_400Regular', fontSize: 14, color: colors.slate400, textAlign: 'center', paddingHorizontal: 40 },
  browseBtn:    { backgroundColor: colors.brand, paddingHorizontal: spacing.xl, paddingVertical: 12, borderRadius: 20 },
  browseBtnText:{ color: colors.white, fontFamily: 'Nunito_700Bold', fontSize: 15 },
});
