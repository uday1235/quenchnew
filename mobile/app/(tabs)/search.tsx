import { useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import { colors, radius, spacing } from '@/constants/theme';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Rishikesh'];
const PRICES = [
  { label: 'Under ₹1k',  min: '0',     max: '999'   },
  { label: '₹1k–₹5k',   min: '1000',  max: '4999'  },
  { label: '₹5k–₹20k',  min: '5000',  max: '19999' },
  { label: '₹20k+',      min: '20000', max: ''      },
];

export default function SearchScreen() {
  const [query,    setQuery]    = useState('');
  const [city,     setCity]     = useState('');
  const [price,    setPrice]    = useState<typeof PRICES[0] | null>(null);
  const [results,  setResults]  = useState<any[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params: Record<string, string> = {};
      if (query)      params.q        = query;
      if (city)       params.location = city;
      if (price?.min) params.minPrice = price.min;
      if (price?.max) params.maxPrice = price.max;
      const { data } = await getListings(params);
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>Search</Text>
        <View style={styles.inputRow}>
          <Ionicons name="search-outline" size={18} color={colors.slate400} />
          <TextInput
            style={styles.input}
            placeholder="Services, categories…"
            placeholderTextColor={colors.slate400}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={doSearch}
            returnKeyType="search"
          />
        </View>

        <Text style={styles.filterLabel}>City</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
          {CITIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, city === c && styles.chipActive]}
              onPress={() => setCity(city === c ? '' : c)}
            >
              <Text style={[styles.chipText, city === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>Price Range</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
          {PRICES.map((p) => (
            <TouchableOpacity
              key={p.label}
              style={[styles.chip, price?.label === p.label && styles.chipActive]}
              onPress={() => setPrice(price?.label === p.label ? null : p)}
            >
              <Text style={[styles.chipText, price?.label === p.label && styles.chipTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.searchBtn} onPress={doSearch}>
          <Text style={styles.searchBtnText}>Search Services</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.brand} size="large" />
      ) : searched ? (
        <FlatList
          data={results}
          keyExtractor={(i) => i.id}
          numColumns={2}
          contentContainerStyle={{ padding: spacing.md, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => <View style={{ flex: 1 }}><ListingCard listing={item} /></View>}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 40 }}>
              <Text style={{ color: colors.slate400, fontFamily: 'Nunito_700Bold' }}>No results found.</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="search-circle-outline" size={64} color={colors.slate200} />
          <Text style={styles.placeholderText}>Use filters above to discover services</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: { backgroundColor: colors.white, padding: spacing.lg, gap: 12, borderBottomWidth: 1, borderBottomColor: colors.slate100 },
  heading: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 26, color: colors.slate900 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.slate100, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 10 },
  input: { flex: 1, fontSize: 14, color: colors.slate900, fontFamily: 'Nunito_400Regular' },
  filterLabel: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: colors.slate500, textTransform: 'uppercase', letterSpacing: 1 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.slate200, backgroundColor: colors.white },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontSize: 12, fontWeight: '700', color: colors.slate700 },
  chipTextActive: { color: colors.white },
  searchBtn: { backgroundColor: colors.brand, borderRadius: radius.xl, paddingVertical: 14, alignItems: 'center' },
  searchBtnText: { color: '#fff', fontFamily: 'Nunito_800ExtraBold', fontSize: 15 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  placeholderText: { fontFamily: 'Nunito_400Regular', color: colors.slate400, fontSize: 14 },
});
