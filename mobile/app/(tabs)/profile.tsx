import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, shadow } from '@/constants/theme';

interface MenuItem { icon: string; label: string; onPress: () => void; danger?: boolean }

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const menus: MenuItem[] = [
    { icon: 'calendar-outline',  label: 'My Bookings',   onPress: () => router.push('/(tabs)/bookings') },
    { icon: 'heart-outline',     label: 'My Favourites', onPress: () => {} },
    { icon: 'briefcase-outline', label: 'My Services',   onPress: () => {} },
    { icon: 'person-outline',    label: 'Provider Profile', onPress: () => user && router.push(`/provider/${user.id}`) },
    { icon: 'log-out-outline',   label: 'Sign Out',      onPress: handleSignOut, danger: true },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* profile card */}
        <View style={styles.card}>
          <View style={styles.avatarWrap}>
            {user?.image ? (
              <Image source={{ uri: user.image }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarInitial}>{user?.name?.[0] ?? '?'}</Text>
              </View>
            )}
            {user?.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={18} color={colors.emerald} />
              </View>
            )}
          </View>

          <Text style={styles.name}>{user?.name ?? 'User'}</Text>
          {user?.email && <Text style={styles.email}>{user.email}</Text>}
          {user?.phone && <Text style={styles.email}>{user.phone}</Text>}

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role ?? 'CUSTOMER'}</Text>
          </View>
        </View>

        {/* menu */}
        <View style={styles.menuCard}>
          {menus.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i < menus.length - 1 && styles.menuItemBorder]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, item.danger && styles.iconWrapDanger]}>
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={item.danger ? colors.rose : colors.brand}
                />
              </View>
              <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>{item.label}</Text>
              {!item.danger && <Ionicons name="chevron-forward" size={16} color={colors.slate400} />}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.version}>Quench v1.0 · Made with ❤️</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, gap: spacing.lg },
  card: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center', gap: 8, ...shadow.sm, borderWidth: 1, borderColor: colors.slate100 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarFallback: { backgroundColor: colors.brandLight, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 28, color: colors.brand },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.white, borderRadius: 10 },
  name: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: colors.slate900, marginTop: 4 },
  email: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: colors.slate500 },
  roleBadge: { backgroundColor: colors.brandLight, paddingHorizontal: 14, paddingVertical: 5, borderRadius: radius.full, marginTop: 4 },
  roleText: { fontFamily: 'Nunito_700Bold', fontSize: 11, color: colors.brand, letterSpacing: 1 },
  menuCard: { backgroundColor: colors.white, borderRadius: radius.xl, overflow: 'hidden', ...shadow.sm, borderWidth: 1, borderColor: colors.slate100 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 16, gap: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.slate100 },
  iconWrap: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.brandLight, alignItems: 'center', justifyContent: 'center' },
  iconWrapDanger: { backgroundColor: '#fff1f2' },
  menuLabel: { flex: 1, fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.slate700 },
  menuLabelDanger: { color: colors.rose },
  version: { textAlign: 'center', fontFamily: 'Nunito_400Regular', fontSize: 12, color: colors.slate400 },
});
