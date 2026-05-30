import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { useFonts, Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { PlayfairDisplay_700Bold, PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

SplashScreen.preventAutoHideAsync();

// Expo Go does not support remote push notifications from SDK 53+
// This is only active in development builds and production
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

function NotificationHandler() {
  const router = useRouter();
  const { user } = useAuth();
  const responseListener = useRef<any>(null);

  useEffect(() => {
    if (!user || isExpoGo) return;

    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList:   true,
          shouldPlaySound:  true,
          shouldSetBadge:   true,
        }),
      });

      // register push token
      (async () => {
        if (!Device.isDevice) return;

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
          });
        }

        const { status: existing } = await Notifications.getPermissionsAsync();
        let finalStatus = existing;
        if (existing !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') return;

        const projectId = Constants.expoConfig?.extra?.eas?.projectId
          ?? Constants.easConfig?.projectId;

        const { data: token } = await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined as any
        );
        if (token) api.post('/mobile/push-token', { token }).catch(() => {});
      })();

      // handle notification taps
      responseListener.current = Notifications.addNotificationResponseReceivedListener((res) => {
        const data = res.notification.request.content.data as any;
        if (data?.type === 'booking_confirmed' || data?.type === 'booking_reminder') {
          router.push('/(tabs)/bookings');
        }
        if (data?.type === 'new_booking') router.push('/appointments');
      });
    } catch {
      // silently fail in environments that don't support push
    }

    return () => { responseListener.current?.remove?.(); };
  }, [user]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NotificationHandler />
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="listing/[id]" options={{ headerShown: true, title: '' , headerBackTitle: 'Back' }} />
          <Stack.Screen name="provider/[id]" options={{ headerShown: true, title: 'Provider Profile', headerBackTitle: 'Back' }} />
          <Stack.Screen name="booking-success" options={{ headerShown: false, gestureEnabled: false }} />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
