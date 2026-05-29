import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Image, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';
import { uploadImage } from '@/lib/cloudinary';
import { colors, radius, spacing, shadow } from '@/constants/theme';

const CATEGORIES = [
  'SpaServices','HomeTutions','WebDeveloper','HealthCare','Fitness&Training',
  'MakeupArtists','Maids','Photographers','Meditation','EventManagers',
  'InteriorDesigner','Drivers','DeliveryBoys','OnlineCourses','SalesMen',
];

const CITIES = ['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Rishikesh'];

const TOTAL_STEPS = 4;

export default function ListServiceScreen() {
  const router = useRouter();
  const [step, setStep]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);

  // form state
  const [category,     setCategory]     = useState('');
  const [title,        setTitle]        = useState('');
  const [description,  setDescription]  = useState('');
  const [city,         setCity]         = useState('');
  const [price,        setPrice]        = useState('');
  const [phone,        setPhone]        = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [imageUri,     setImageUri]     = useState('');
  const [imageUrl,     setImageUrl]     = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed to pick images'); return; }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setUploading(true);
      try {
        const url = await uploadImage(uri);
        setImageUrl(url);
      } catch {
        Alert.alert('Upload failed', 'Could not upload image. Try again.');
        setImageUri('');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!imageUrl) { Alert.alert('Please upload a service image'); return; }
    setLoading(true);
    try {
      await api.post('/listings', {
        title, description, imageSrc: imageUrl,
        category, location: { value: city }, price,
        phone, contactEmail,
      });
      Alert.alert('Service Listed! 🎉', 'Your service is now live on Quench.', [
        { text: 'View My Services', onPress: () => router.replace('/my-services') },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not list service');
    } finally {
      setLoading(false);
    }
  };

  const canNext = () => {
    if (step === 1) return !!category;
    if (step === 2) return title.length > 3 && description.length > 10;
    if (step === 3) return !!city && !!price;
    if (step === 4) return !!phone && !!imageUrl;
    return false;
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.slate900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List a Service</Text>
        <Text style={styles.stepCount}>{step}/{TOTAL_STEPS}</Text>
      </View>

      {/* progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / TOTAL_STEPS) * 100}%` as any }]} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

          {/* ── Step 1: Category ── */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>What service do you offer?</Text>
              <Text style={styles.stepSub}>Select the category that best fits your service.</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c} activeOpacity={0.8}
                    style={[styles.catChip, category === c && styles.catChipActive]}
                    onPress={() => setCategory(c)}
                  >
                    <Text style={[styles.catText, category === c && styles.catTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ── Step 2: Title & Description ── */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Tell us about your service</Text>
              <Text style={styles.stepSub}>A clear title and description helps customers find you.</Text>

              <View style={styles.field}>
                <Text style={styles.label}>Service Title</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Professional Full-Body Massage"
                  placeholderTextColor={colors.slate400}
                  maxLength={80}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe your service, experience, what's included..."
                  placeholderTextColor={colors.slate400}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}

          {/* ── Step 3: Location & Price ── */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Where & how much?</Text>
              <Text style={styles.stepSub}>Set your city and session price in INR.</Text>

              <View style={styles.field}>
                <Text style={styles.label}>City</Text>
                <View style={styles.cityGrid}>
                  {CITIES.map((c) => (
                    <TouchableOpacity
                      key={c} activeOpacity={0.8}
                      style={[styles.catChip, city === c && styles.catChipActive]}
                      onPress={() => setCity(c)}
                    >
                      <Text style={[styles.catText, city === c && styles.catTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Price per session (₹)</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.rupee}>₹</Text>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={price}
                    onChangeText={setPrice}
                    placeholder="e.g. 1500"
                    placeholderTextColor={colors.slate400}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            </View>
          )}

          {/* ── Step 4: Contact & Image ── */}
          {step === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Contact & Photo</Text>
              <Text style={styles.stepSub}>Add your contact details and a photo of your service.</Text>

              <View style={styles.field}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+91 9876543210"
                  placeholderTextColor={colors.slate400}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Contact Email</Text>
                <TextInput
                  style={styles.input}
                  value={contactEmail}
                  onChangeText={setContactEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.slate400}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Service Photo</Text>
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
                  {uploading ? (
                    <ActivityIndicator color={colors.brand} />
                  ) : imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="camera-outline" size={32} color={colors.slate400} />
                      <Text style={styles.imagePlaceholderText}>Tap to upload photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {imageUri && !uploading && (
                  <TouchableOpacity onPress={pickImage} style={styles.changePhoto}>
                    <Text style={styles.changePhotoText}>Change photo</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* bottom CTA */}
      <View style={styles.footer}>
        {step < TOTAL_STEPS ? (
          <TouchableOpacity
            style={[styles.btn, !canNext() && styles.btnDisabled]}
            onPress={() => setStep(step + 1)}
            disabled={!canNext()}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Continue →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btn, (!canNext() || loading) && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={!canNext() || loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>List My Service 🎉</Text>
            }
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.background },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.slate100 },
  headerTitle:   { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 18, color: colors.slate900 },
  stepCount:     { fontFamily: 'Nunito_700Bold', fontSize: 13, color: colors.slate400 },
  progressBar:   { height: 3, backgroundColor: colors.slate100 },
  progressFill:  { height: 3, backgroundColor: colors.brand },
  body:          { padding: spacing.lg, paddingBottom: 100 },
  stepContainer: { gap: spacing.lg },
  stepTitle:     { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 26, color: colors.slate900 },
  stepSub:       { fontFamily: 'Nunito_400Regular', fontSize: 14, color: colors.slate500, marginTop: -8 },
  categoryGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cityGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catChip:       { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.slate200, backgroundColor: colors.white },
  catChipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  catText:       { fontFamily: 'Nunito_700Bold', fontSize: 13, color: colors.slate700 },
  catTextActive: { color: colors.white },
  field:         { gap: 8 },
  label:         { fontFamily: 'Nunito_700Bold', fontSize: 13, color: colors.slate700 },
  input:         { borderWidth: 2, borderColor: colors.slate200, borderRadius: radius.xl, paddingHorizontal: spacing.md, paddingVertical: 13, fontSize: 15, fontFamily: 'Nunito_400Regular', color: colors.slate900, backgroundColor: colors.white },
  textArea:      { minHeight: 120, textAlignVertical: 'top' },
  priceRow:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rupee:         { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: colors.brand },
  imagePicker:   { borderWidth: 2, borderColor: colors.slate200, borderRadius: radius.xl, overflow: 'hidden', minHeight: 180, backgroundColor: colors.white },
  previewImage:  { width: '100%', height: 220 },
  imagePlaceholder: { flex: 1, minHeight: 180, alignItems: 'center', justifyContent: 'center', gap: 10 },
  imagePlaceholderText: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: colors.slate400 },
  changePhoto:   { alignItems: 'center', paddingVertical: spacing.sm },
  changePhotoText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: colors.brand },
  footer:        { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.slate100, ...shadow.md },
  btn:           { backgroundColor: colors.brand, borderRadius: radius.xl, paddingVertical: 16, alignItems: 'center' },
  btnDisabled:   { backgroundColor: colors.slate200 },
  btnText:       { color: '#fff', fontFamily: 'Nunito_800ExtraBold', fontSize: 16 },
});
