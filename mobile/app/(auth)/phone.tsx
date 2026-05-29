import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuth } from '@/context/AuthContext';
import { sendOtp, googleAuth } from '@/lib/api';
import FlowerLogo from '@/components/FlowerLogo';
import { colors, radius, spacing, shadow } from '@/constants/theme';

WebBrowser.maybeCompleteAuthSession();

// Isolated component so the hook only runs when client IDs are available
function GoogleButton({ onError }: { onError: (msg: string) => void }) {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const [, , googlePrompt] = Google.useAuthRequest({
    webClientId:     process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId:     process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    selectAccount:   true,
  });

  const handle = async () => {
    setLoading(true);
    try {
      const result = await googlePrompt();
      if (result.type === 'success') {
        const { data } = await googleAuth(result.authentication!.accessToken);
        await signIn(data.token, data.user);
        router.replace('/(tabs)');
      }
    } catch {
      onError('Google sign-in failed. Use phone OTP instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.googleBtn} onPress={handle} disabled={loading} activeOpacity={0.85}>
      {loading
        ? <ActivityIndicator color={colors.slate700} />
        : <Text style={styles.googleText}>🇬 Continue with Google</Text>
      }
    </TouchableOpacity>
  );
}

// Only mount GoogleButton when the right client ID is configured
const hasGoogleClientId =
  (Platform.OS === 'android' && !!process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID) ||
  (Platform.OS === 'ios'     && !!process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID)     ||
  (Platform.OS === 'web'     && !!process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID);

export default function PhoneScreen() {
  const router  = useRouter();
  const [phone,   setPhone]   = useState('+91 ');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleContinue = async () => {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length < 10) { setError('Enter a valid phone number'); return; }
    setError('');
    setLoading(true);
    try {
      await sendOtp(cleaned);
      router.push({ pathname: '/(auth)/otp', params: { phone: cleaned } });
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Could not send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <FlowerLogo size={44} />
            <Text style={styles.brand}>Quench</Text>
          </View>
          <Text style={styles.headline}>Welcome Back</Text>
          <Text style={styles.sub}>Sign in to book services near you</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+91 98765 43210"
            placeholderTextColor={colors.slate400}
            autoFocus
          />
          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.btn} onPress={handleContinue} disabled={loading} activeOpacity={0.85}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Send OTP →</Text>
            }
          </TouchableOpacity>

          {hasGoogleClientId && (
            <>
              <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.orText}>or continue with</Text>
                <View style={styles.line} />
              </View>
              <GoogleButton onError={setError} />
            </>
          )}
        </View>

        <Text style={styles.terms}>
          By continuing you agree to our Terms & Privacy Policy
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:  { flexGrow: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  header:     { paddingTop: 80, paddingBottom: spacing.xl, gap: 8 },
  logoRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  brand:      { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 28, color: colors.slate900 },
  headline:   { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 32, color: colors.slate900 },
  sub:        { fontFamily: 'Nunito_400Regular', fontSize: 15, color: colors.slate500 },
  form:       { gap: spacing.md },
  label:      { fontFamily: 'Nunito_700Bold', fontSize: 13, color: colors.slate700 },
  input: {
    borderWidth: 2, borderColor: colors.slate200,
    borderRadius: radius.xl, paddingHorizontal: spacing.lg, paddingVertical: 14,
    fontSize: 16, fontFamily: 'Nunito_400Regular', color: colors.slate900,
    backgroundColor: colors.white,
  },
  error:   { color: colors.rose, fontSize: 13, fontFamily: 'Nunito_400Regular' },
  btn: {
    backgroundColor: colors.brand, borderRadius: radius.xl,
    paddingVertical: 16, alignItems: 'center', ...shadow.md,
  },
  btnText:   { color: '#fff', fontFamily: 'Nunito_800ExtraBold', fontSize: 16 },
  divider:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line:      { flex: 1, height: 1, backgroundColor: colors.slate200 },
  orText:    { fontSize: 12, color: colors.slate400, fontFamily: 'Nunito_400Regular' },
  googleBtn: {
    borderWidth: 1.5, borderColor: colors.slate200, borderRadius: radius.xl,
    paddingVertical: 14, alignItems: 'center', backgroundColor: colors.white, ...shadow.sm,
  },
  googleText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.slate700 },
  terms: {
    textAlign: 'center', marginTop: spacing.xl, marginBottom: spacing.xl,
    fontSize: 11, color: colors.slate400, fontFamily: 'Nunito_400Regular',
  },
});
