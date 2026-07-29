import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Trash2, ChevronDown, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { ToneStyle, TONE_OPTIONS, SERVICE_OPTIONS, DEFAULT_CHECKLIST } from '@/types';
import { useBrandProfile } from '@/providers/BrandProfileProvider';
import { useWorkflows } from '@/providers/WorkflowProvider';
import { generateReviewContent } from '@/utils/generateContent';

export default function NewWorkflowScreen() {
  const router = useRouter();
  const { profile } = useBrandProfile();
  const { saveWorkflow } = useWorkflows();

  const [reviewText, setReviewText] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [city, setCity] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [tone, setTone] = useState<ToneStyle>('Warm');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current;

  const toggleService = useCallback((service: string) => {
    void Haptics.selectionAsync();
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  }, []);

  const handleClear = useCallback(() => {
    setReviewText('');
    setCustomerName('');
    setCity('');
    setSelectedServices([]);
    setTone('Warm');
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!reviewText.trim()) {
      Alert.alert('Missing Review', 'Please paste or enter the review text.');
      return;
    }
    if (!city.trim()) {
      Alert.alert('Missing City', 'Please enter the city or area.');
      return;
    }
    if (selectedServices.length === 0) {
      Alert.alert('Missing Service', 'Please select at least one service.');
      return;
    }

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsGenerating(true);

    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    try {
      const content = await generateReviewContent({
        reviewText: reviewText.trim(),
        customerName: customerName.trim(),
        city: city.trim(),
        services: selectedServices,
        tone,
        brandProfile: profile,
      });

      const workflowId = Date.now().toString() + Math.random().toString(36).substring(2, 9);

      const workflow = {
        id: workflowId,
        dateCreated: new Date().toISOString(),
        reviewText: reviewText.trim(),
        customerName: customerName.trim(),
        city: city.trim(),
        services: selectedServices,
        tone,
        status: 'generated' as const,
        generatedContent: content,
        checklist: DEFAULT_CHECKLIST,
        notes: '',
      };

      saveWorkflow(workflow);

      router.replace(`/generated-content?id=${workflowId}`);
    } catch (error) {
      console.error('Generation error:', error);
      Alert.alert('Generation Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [reviewText, customerName, city, selectedServices, tone, profile, saveWorkflow, router, buttonScale]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Review Text</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={6}
          placeholder="Paste the 5-star review here..."
          placeholderTextColor={Colors.textMuted}
          value={reviewText}
          onChangeText={setReviewText}
          textAlignVertical="top"
          testID="review-text-input"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Customer Name <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. John D."
          placeholderTextColor={Colors.textMuted}
          value={customerName}
          onChangeText={setCustomerName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>City / Area <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Mason, Ohio"
          placeholderTextColor={Colors.textMuted}
          value={city}
          onChangeText={setCity}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Service(s) Performed <Text style={styles.required}>*</Text></Text>
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowServicePicker(!showServicePicker)}
        >
          <Text style={[styles.dropdownText, selectedServices.length === 0 && styles.placeholder]}>
            {selectedServices.length > 0
              ? selectedServices.join(', ')
              : 'Select services...'}
          </Text>
          <ChevronDown size={18} color={Colors.textMuted} />
        </Pressable>
        {showServicePicker && (
          <View style={styles.pickerContainer}>
            {SERVICE_OPTIONS.map((service) => {
              const selected = selectedServices.includes(service);
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
        <Text style={styles.label}>Tone / Style</Text>
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowToneDropdown(!showToneDropdown)}
        >
          <Text style={styles.dropdownText}>{tone}</Text>
          <ChevronDown size={18} color={Colors.textMuted} />
        </Pressable>
        {showToneDropdown && (
          <View style={styles.pickerContainer}>
            {TONE_OPTIONS.map((option) => (
              <Pressable
                key={option}
                style={[styles.pickerItem, tone === option && styles.pickerItemSelected]}
                onPress={() => {
                  setTone(option);
                  setShowToneDropdown(false);
                  void Haptics.selectionAsync();
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

      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <Pressable
          style={[styles.generateBtn, isGenerating && styles.generateBtnDisabled]}
          onPress={handleGenerate}
          disabled={isGenerating}
          testID="generate-btn"
        >
          {isGenerating ? (
            <ActivityIndicator color={Colors.navy} size="small" />
          ) : (
            <Sparkles size={20} color={Colors.navy} />
          )}
          <Text style={styles.generateBtnText}>
            {isGenerating ? 'Generating...' : 'Generate Reply + Social Content'}
          </Text>
        </Pressable>
      </Animated.View>

      <Pressable style={styles.clearBtn} onPress={handleClear}>
        <Trash2 size={16} color={Colors.textSecondary} />
        <Text style={styles.clearBtnText}>Clear Form</Text>
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  required: {
    color: Colors.gold,
  },
  optional: {
    color: Colors.textMuted,
    fontWeight: '400' as const,
    textTransform: 'none',
    letterSpacing: 0,
  },
  textArea: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.white,
    minHeight: 130,
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
  generateBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },
  generateBtnDisabled: {
    opacity: 0.7,
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.navy,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 14,
  },
  clearBtnText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
