import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import FlowerLogo from '@/components/FlowerLogo';
import { colors } from '@/constants/theme';

export default function SplashIndex() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/phone');
    }
  }, [user, isLoading]);

  return (
    <View style={styles.container}>
      <FlowerLogo size={64} />
      <Text style={styles.title}>Quench</Text>
      <Text style={styles.sub}>Find & book local services</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 36, color: '#fff' },
  sub:   { fontFamily: 'Nunito_400Regular', fontSize: 15, color: 'rgba(255,255,255,0.75)' },
});
