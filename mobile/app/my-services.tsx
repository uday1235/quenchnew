import { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, shadow } from '@/constants/theme';

export default function MyServicesScreen() {
  const router    = useRouter();
  const { user }  = useAuth();
  const [listings,   setListings]   = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting,   setDeleting]   = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/listings', { params: { userId: user?.id } });
      setListings(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, []);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Delete Service', `Remove "${title}" from Quench?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          setDeleting(id);
          try {
            await api.delete(`/listings/${id}`);
            setListings((prev) => prev.filter((l) => l.id !== id));
          } catch {
            Alert.alert('Error', 'Could not delete listing.');
          } finally {
            setDeleting(null);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.slate900} />
        </TouchableOpacity>
        <Text style={styles.title}>My Services</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/list-service')}
        >
          <Ionicons name="add" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 60 }} color={colors.brand} size="large" />
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imageSrc }} style={styles.thumb} />
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.title}</Text>
                <View style={styles.row}>
                  <Ionicons name="location-outline" size={13} color={colors.slate400} />
                  <Text style={styles.detail}>{item.locationValue}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.category}>{item.category}</Text>
                </View>
                <Text style={styles.price}>₹{item.price} / session</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id, item.title)}
                disabled={deleting === item.id}
              >
                {deleting === item.id
                  ? <ActivityIndicator size="small" color={colors.rose} />
                  : <Ionicons name="trash-outline" size={20} color={colors.rose} />
                }
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="briefcase-outline" size={56} color={colors.slate200} />
              <Text style={styles.emptyTitle}>No services yet</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/list-service')}>
                <Text style={styles.emptyBtnText}>+ List your first service</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.background },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.slate100 },
  title:       { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.slate900 },
  addBtn:      { backgroundColor: colors.brand, borderRadius: radius.full, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  list:        { padding: spacing.md, gap: 12 },
  card:        { backgroundColor: colors.white, borderRadius: radius.lg, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: colors.slate100, ...shadow.sm },
  thumb:       { width: 90, height: 90 },
  info:        { flex: 1, padding: spacing.sm, gap: 3 },
  name:        { fontFamily: 'Nunito_700Bold', fontSize: 14, color: colors.slate900 },
  row:         { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detail:      { fontSize: 12, color: colors.slate500, fontFamily: 'Nunito_400Regular' },
  category:    { fontSize: 11, color: colors.brand, fontFamily: 'Nunito_700Bold', backgroundColor: colors.brandLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full },
  price:       { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: colors.brand, marginTop: 2 },
  deleteBtn:   { padding: spacing.md, justifyContent: 'center' },
  empty:       { alignItems: 'center', paddingTop: 80, gap: 16 },
  emptyTitle:  { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.slate700 },
  emptyBtn:    { backgroundColor: colors.brand, paddingHorizontal: spacing.xl, paddingVertical: 12, borderRadius: radius.xl },
  emptyBtnText:{ color: colors.white, fontFamily: 'Nunito_700Bold', fontSize: 15 },
});
