import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Save } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useBrandProfile } from '@/providers/BrandProfileProvider';
import { SERVICE_OPTIONS, TONE_OPTIONS } from '@/types';
import { Check, ChevronDown } from 'lucide-react-native';

export default function BrandProfileScreen() {
  const { profile, updateProfile, isSaving, isLoading } = useBrandProfile();

  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [tone, setTone] = useState('');
  const [brandStyle, setBrandStyle] = useState('');
  const [colors, setColors] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [ctaPreference, setCtaPreference] = useState('');
  const [keywordDefaults, setKeywordDefaults] = useState('');
  const [defaultFacebookTone, setDefaultFacebookTone] = useState('');
  const [defaultGoogleReplyTone, setDefaultGoogleReplyTone] = useState('');
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [showTonePicker, setShowTonePicker] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setBusinessName(profile.businessName);
      setOwnerName(profile.ownerName);
      setWebsite(profile.website);
      setPhone(profile.phone);
      setServiceArea(profile.serviceArea);
      setTone(profile.tone);
      setBrandStyle(profile.brandStyle);
      setColors(profile.colors);
      setServices(profile.services);
      setCtaPreference(profile.ctaPreference);
      setKeywordDefaults(profile.keywordDefaults);
      setDefaultFacebookTone(profile.defaultFacebookTone);
      setDefaultGoogleReplyTone(profile.defaultGoogleReplyTone);
    }
  }, [isLoading, profile]);

  const toggleService = useCallback((service: string) => {
    void Haptics.selectionAsync();
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  }, []);

  const handleSave = useCallback(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateProfile({
      businessName,
      ownerName,
      website,
      phone,
      serviceArea,
      tone,
      brandStyle,
      colors,
      services,
      ctaPreference,
      keywordDefaults,
      defaultFacebookTone,
      defaultGoogleReplyTone,
    });
    Alert.alert('Saved', 'Brand profile updated successfully.');
  }, [
    businessName, ownerName, website, phone, serviceArea, tone,
    brandStyle, colors, services, ctaPreference, keywordDefaults,
    defaultFacebookTone, defaultGoogleReplyTone, updateProfile,
  ]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.sectionHeader}>Business Details</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Osborne Pro Wash"
          placeholderTextColor={Colors.textMuted}
          value={businessName}
          onChangeText={setBusinessName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Owner Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. John Osborne"
          placeholderTextColor={Colors.textMuted}
          value={ownerName}
          onChangeText={setOwnerName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. www.OsborneProWash.com"
          placeholderTextColor={Colors.textMuted}
          value={website}
          onChangeText={setWebsite}
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 513-543-5904"
          placeholderTextColor={Colors.textMuted}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Service Area</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Southwest Ohio"
          placeholderTextColor={Colors.textMuted}
          value={serviceArea}
          onChangeText={setServiceArea}
        />
      </View>

      <Text style={styles.sectionHeader}>Brand Voice</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Brand Style</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Luxury, minimal, high-end"
          placeholderTextColor={Colors.textMuted}
          value={brandStyle}
          onChangeText={setBrandStyle}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Default Tone</Text>
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowTonePicker(!showTonePicker)}
        >
          <Text style={[styles.dropdownText, !tone && styles.placeholder]}>
            {tone || 'Select tone...'}
          </Text>
          <ChevronDown size={18} color={Colors.textMuted} />
        </Pressable>
        {showTonePicker && (
          <View style={styles.pickerContainer}>
            {TONE_OPTIONS.map((option) => (
              <Pressable
                key={option}
                style={[styles.pickerItem, tone === option && styles.pickerItemSelected]}
                onPress={() => {
                  setTone(option);
                  setShowTonePicker(false);
                }}
              >
                <Text style={[styles.pickerItemText, tone === option && styles.pickerItemTextSelected]}>
                  {option}
                </Text>
                {tone === option && <Check size={16} color={Colors.gold} />}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Brand Colors</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Dark blue, white, subtle gold accents"
          placeholderTextColor={Colors.textMuted}
          value={colors}
          onChangeText={setColors}
        />
      </View>

      <Text style={styles.sectionHeader}>Services & Keywords</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Main Services</Text>
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowServicePicker(!showServicePicker)}
        >
          <Text style={[styles.dropdownText, services.length === 0 && styles.placeholder]}>
            {services.length > 0 ? services.join(', ') : 'Select services...'}
          </Text>
          <ChevronDown size={18} color={Colors.textMuted} />
        </Pressable>
        {showServicePicker && (
          <View style={styles.pickerContainer}>
            {SERVICE_OPTIONS.map((service) => {
              const selected = services.includes(service);
              return (
                <Pressable
                  key={service}
                  style={[styles.pickerItem, selected && styles.pickerItemSelected]}
                  onPress={() => toggleService(service)}
                >
                  <Text style={[styles.pickerItemText, selected && styles.pickerItemTextSelected]}>
                    {service}
                  </Text>
                  {selected && <Check size={16} color={Colors.gold} />}
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>CTA Preference</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Call us today for a free quote"
          placeholderTextColor={Colors.textMuted}
          value={ctaPreference}
          onChangeText={setCtaPreference}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Default Keywords</Text>
        <TextInput
          style={styles.textArea}
          placeholder="e.g. pressure washing, exterior cleaning, soft wash"
          placeholderTextColor={Colors.textMuted}
          value={keywordDefaults}
          onChangeText={setKeywordDefaults}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <Text style={styles.sectionHeader}>Default Tones</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Default Google Reply Tone</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Warm, professional, premium"
          placeholderTextColor={Colors.textMuted}
          value={defaultGoogleReplyTone}
          onChangeText={setDefaultGoogleReplyTone}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Default Facebook Tone</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Professional, polished"
          placeholderTextColor={Colors.textMuted}
          value={defaultFacebookTone}
          onChangeText={setDefaultFacebookTone}
        />
      </View>

      <Pressable style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
        {isSaving ? (
          <ActivityIndicator color={Colors.navy} size="small" />
        ) : (
          <Save size={18} color={Colors.navy} />
        )}
        <Text style={styles.saveBtnText}>
          {isSaving ? 'Saving...' : 'Save Brand Profile'}
        </Text>
      </Pressable>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.white,
  },
  textArea: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.white,
    minHeight: 80,
  },
  dropdown: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 15,
    color: Colors.white,
    flex: 1,
  },
  placeholder: {
    color: Colors.textMuted,
  },
  pickerContainer: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  pickerItemSelected: {
    backgroundColor: Colors.goldMuted,
  },
  pickerItemText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  pickerItemTextSelected: {
    color: Colors.gold,
    fontWeight: '600' as const,
  },
  saveBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.navy,
  },
});
