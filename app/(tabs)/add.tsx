import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { addDays } from 'date-fns';
import { H2, Body, Caption } from '../../src/components/ui/Typography';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useDecisions } from '../../src/hooks/useDecisions';
import { usePremium } from '../../src/hooks/usePremium';
import {
  DecisionCategory,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '../../src/types/decision';
import { colors, spacing } from '../../src/theme';

const CATEGORIES: DecisionCategory[] = [
  'financial',
  'career',
  'relationships',
  'health',
  'business',
  'personal',
  'other',
];

const REVIEW_PERIODS = [
  { label: '30 days', days: 30 },
  { label: '60 days', days: 60 },
  { label: '90 days', days: 90 },
];

export default function AddDecisionScreen() {
  const router = useRouter();
  const { createDecision } = useDecisions();
  const { canCreateDecision } = usePremium();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DecisionCategory>('personal');
  const [confidenceLevel, setConfidenceLevel] = useState(5);
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [reviewDays, setReviewDays] = useState(30);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a decision title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    const canCreate = await canCreateDecision();
    if (!canCreate) {
      Alert.alert(
        'Limit Reached',
        'You have reached the free tier limit of 30 decisions. Upgrade to premium for unlimited decisions.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    const result = await createDecision({
      title: title.trim(),
      description: description.trim(),
      category,
      confidenceLevel,
      expectedOutcome: expectedOutcome.trim(),
      reviewDate: addDays(new Date(), reviewDays),
      tags: [],
    });

    setLoading(false);

    if (result) {
      Alert.alert('Success', 'Decision created successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to create decision');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <H2 style={styles.title}>New Decision</H2>

        <Input
          label="Decision Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Should I invest in stocks?"
          containerStyle={styles.input}
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Explain your decision..."
          multiline
          numberOfLines={4}
          containerStyle={styles.input}
          style={styles.textArea}
        />

        <View style={styles.section}>
          <Caption style={styles.sectionLabel}>Category</Caption>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor:
                      category === cat
                        ? CATEGORY_COLORS[cat] + '20'
                        : colors.neutral[100],
                    borderColor:
                      category === cat ? CATEGORY_COLORS[cat] : 'transparent',
                  },
                ]}
              >
                <Caption
                  style={{
                    color: category === cat ? CATEGORY_COLORS[cat] : colors.text.secondary,
                    fontWeight: category === cat ? '600' : '400',
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </Caption>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Caption style={styles.sectionLabel}>
            Confidence Level: {confidenceLevel}/10
          </Caption>
          <View style={styles.sliderContainer}>
            {[...Array(10)].map((_, i) => (
              <Pressable
                key={i}
                onPress={() => setConfidenceLevel(i + 1)}
                style={[
                  styles.sliderButton,
                  i + 1 <= confidenceLevel && styles.sliderButtonActive,
                ]}
              />
            ))}
          </View>
        </View>

        <Input
          label="Expected Outcome"
          value={expectedOutcome}
          onChangeText={setExpectedOutcome}
          placeholder="What do you expect to happen?"
          multiline
          numberOfLines={3}
          containerStyle={styles.input}
        />

        <View style={styles.section}>
          <Caption style={styles.sectionLabel}>Review In</Caption>
          <View style={styles.reviewPeriodContainer}>
            {REVIEW_PERIODS.map(period => (
              <Pressable
                key={period.days}
                onPress={() => setReviewDays(period.days)}
                style={[
                  styles.reviewPeriodChip,
                  reviewDays === period.days && styles.reviewPeriodChipActive,
                ]}
              >
                <Body
                  style={{
                    color:
                      reviewDays === period.days
                        ? colors.primary[500]
                        : colors.text.secondary,
                    fontWeight: reviewDays === period.days ? '600' : '400',
                  }}
                >
                  {period.label}
                </Body>
              </Pressable>
            ))}
          </View>
        </View>

        <Button
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
          fullWidth
        >
          Create Decision
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  content: {
    padding: spacing[4],
  },

  title: {
    marginBottom: spacing[6],
  },

  input: {
    marginBottom: spacing[4],
  },

  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  section: {
    marginBottom: spacing[4],
  },

  sectionLabel: {
    marginBottom: spacing[2],
    fontWeight: '600',
    color: colors.text.primary,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },

  categoryChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 12,
    borderWidth: 2,
  },

  sliderContainer: {
    flexDirection: 'row',
    gap: spacing[1],
  },

  sliderButton: {
    flex: 1,
    height: 8,
    backgroundColor: colors.neutral[200],
    borderRadius: 4,
  },

  sliderButtonActive: {
    backgroundColor: colors.primary[500],
  },

  reviewPeriodContainer: {
    flexDirection: 'row',
    gap: spacing[2],
  },

  reviewPeriodChip: {
    flex: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: 12,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
  },

  reviewPeriodChipActive: {
    backgroundColor: colors.primary[50],
  },

  submitButton: {
    marginTop: spacing[4],
  },
});
