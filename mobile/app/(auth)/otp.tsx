import { useRef, useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { verifyOtp, sendOtp } from '@/lib/api';
import { colors, radius, spacing, shadow } from '@/constants/theme';

const OTP_LENGTH = 6;

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router    = useRouter();
  const { signIn } = useAuth();

  const [digits,  setDigits]  = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [resend,  setResend]  = useState(30);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const t = setInterval(() => setResend((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (text: string, idx: number) => {
    if (!/^\d*$/.test(text)) return;
    const next = [...digits];
    next[idx] = text.slice(-1);
    setDigits(next);
    if (text && idx < OTP_LENGTH - 1) inputs.current[idx + 1]?.focus();
  };

  const handleKey = (key: string, idx: number) => {
    if (key === 'Backspace' && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length < OTP_LENGTH) { setError('Enter all 6 digits'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await verifyOtp(phone, code);
      await signIn(data.token, data.user);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Invalid code. Try again.');
      setDigits(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    await sendOtp(phone);
    setResend(30);
    setDigits(Array(OTP_LENGTH).fill(''));
    setError('');
  };

  const filled = digits.join('').length === OTP_LENGTH;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.sub}>Sent to {phone}</Text>

        <View style={styles.boxes}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={(r) => { inputs.current[i] = r; }}
              style={[styles.box, d ? styles.boxFilled : null]}
              value={d}
              onChangeText={(t) => handleChange(t, i)}
              onKeyPress={({ nativeEvent }) => handleKey(nativeEvent.key, i)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={i === 0}
              selectTextOnFocus
            />
          ))}
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.btn, !filled && styles.btnDisabled]}
          onPress={handleVerify}
          disabled={!filled || loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Verify & Continue →</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} disabled={resend > 0}>
          <Text style={[styles.resend, resend > 0 && styles.resendDisabled]}>
            {resend > 0 ? `Resend code in ${resend}s` : 'Resend code'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.background,
    paddingHorizontal: spacing.lg, paddingTop: 60, gap: spacing.lg,
  },
  back: { marginBottom: 8 },
  backText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.brand },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 30, color: colors.slate900 },
  sub: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: colors.slate500, marginTop: -8 },
  boxes: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginTop: spacing.md },
  box: {
    width: 48, height: 56, borderRadius: radius.md,
    borderWidth: 2, borderColor: colors.slate200,
    textAlign: 'center', fontSize: 22, fontFamily: 'Nunito_800ExtraBold', color: colors.slate900,
    backgroundColor: colors.white,
  },
  boxFilled: { borderColor: colors.brand, backgroundColor: colors.brandLight },
  error: { color: colors.rose, textAlign: 'center', fontFamily: 'Nunito_400Regular', fontSize: 13 },
  btn: {
    backgroundColor: colors.brand, borderRadius: radius.xl,
    paddingVertical: 16, alignItems: 'center', ...shadow.md,
  },
  btnDisabled: { backgroundColor: colors.slate200 },
  btnText: { color: '#fff', fontFamily: 'Nunito_800ExtraBold', fontSize: 16 },
  resend: { textAlign: 'center', fontFamily: 'Nunito_700Bold', fontSize: 14, color: colors.brand },
  resendDisabled: { color: colors.slate400 },
});
