import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import CategoryChip from '@/components/CategoryChip';
import FlowerLogo from '@/components/FlowerLogo';
import { colors, spacing, radius } from '@/constants/theme';

const CATEGORIES = [
  'SpaServices','HomeTutions','WebDeveloper','HealthCare','Fitness&Training',
  'MakeupArtists','Maids','Photographers','Meditation','EventManagers',
  'InteriorDesigner','Drivers','DeliveryBoys','OnlineCourses','SalesMen',
];

export default function HomeScreen() {
  const { user } = useAuth();
  const router   = useRouter();
  const [listings,  setListings]  = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [category,  setCategory]  = useState('');
  const [search,    setSearch]    = useState('');

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const load = useCallback(async (cat = category, q = '') => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (cat) params.category = cat;
      if (q)   params.q = q;
      const { data } = await getListings(params);
      setListings(data);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load(category, search);
    setRefreshing(false);
  };

  const handleCategory = (cat: string) => {
    const next = category === cat ? '' : cat;
    setCategory(next);
    load(next, search);
  };

  const handleSearch = () => load(category, search);

  return (
    <SafeAreaView style={styles.safe}>
      {/* header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting()}, {user?.name?.split(' ')[0] ?? 'there'} 👋</Text>
            <Text style={styles.subGreeting}>What service do you need?</Text>
          </View>
          <FlowerLogo size={38} />
        </View>

        {/* search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.slate400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services…"
            placeholderTextColor={colors.slate400}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {!!search && (
            <TouchableOpacity onPress={() => { setSearch(''); load(category, ''); }}>
              <Ionicons name="close-circle" size={18} color={colors.slate400} />
            </TouchableOpacity>
          )}
        </View>

        {/* categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cats} contentContainerStyle={{ gap: 8, paddingRight: spacing.lg }}>
          {CATEGORIES.map((c) => (
            <CategoryChip key={c} label={c} active={category === c} onPress={() => handleCategory(c)} />
          ))}
        </ScrollView>
      </View>

      {/* listings */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 60 }} color={colors.brand} size="large" />
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <ListingCard listing={item} />
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No services found.</Text>
              <TouchableOpacity onPress={() => { setCategory(''); setSearch(''); load('', ''); }}>
                <Text style={styles.resetText}>Reset filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.white, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.slate100 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: spacing.md, marginBottom: spacing.md },
  greeting: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: colors.slate900 },
  subGreeting: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: colors.slate500, marginTop: 2 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.slate100, borderRadius: radius.full,
    paddingHorizontal: spacing.md, paddingVertical: 10, marginBottom: spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.slate900, fontFamily: 'Nunito_400Regular' },
  cats: { marginBottom: spacing.xs },
  grid: { padding: spacing.md, gap: 12 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: colors.slate500 },
  resetText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: colors.brand },
});
