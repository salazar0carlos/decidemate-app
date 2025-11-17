import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { format, differenceInDays } from 'date-fns';
import { H2, H4, Body, Caption } from '../../src/components/ui/Typography';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { decisionsService } from '../../src/services/decisions';
import {
  Decision,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  CONFIDENCE_LABELS,
  OUTCOME_LABELS,
} from '../../src/types/decision';
import { colors, spacing } from '../../src/theme';

export default function DecisionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Review form state
  const [outcomeDescription, setOutcomeDescription] = useState('');
  const [outcomeRating, setOutcomeRating] = useState(5);
  const [lessonsLearned, setLessonsLearned] = useState('');

  useEffect(() => {
    loadDecision();
  }, [id]);

  const loadDecision = async () => {
    if (typeof id !== 'string') return;

    setLoading(true);
    const data = await decisionsService.getById(id);
    setDecision(data);
    setLoading(false);
  };

  const handleSubmitReview = async () => {
    if (!decision) return;

    if (!outcomeDescription.trim()) {
      Alert.alert('Error', 'Please describe what happened');
      return;
    }

    setReviewing(true);
    const result = await decisionsService.addOutcome(decision.id, {
      description: outcomeDescription.trim(),
      rating: outcomeRating,
      lessonsLearned: lessonsLearned.trim(),
    });

    setReviewing(false);

    if (result) {
      Alert.alert('Success', 'Review submitted successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  if (!decision) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Body>Decision not found</Body>
        </View>
      </SafeAreaView>
    );
  }

  const daysUntilReview = differenceInDays(new Date(decision.reviewDate), new Date());
  const isReviewed = !!decision.outcome;
  const categoryColor = CATEGORY_COLORS[decision.category];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Caption color={colors.primary[500]}>← Back</Caption>
        </Pressable>

        <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
          <Caption style={{ color: categoryColor }}>
            {CATEGORY_LABELS[decision.category]}
          </Caption>
        </View>

        <H2 style={styles.title}>{decision.title}</H2>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Caption color={colors.text.tertiary}>Created</Caption>
            <Body>{format(new Date(decision.createdAt), 'MMM d, yyyy')}</Body>
          </View>
          <View style={styles.infoRow}>
            <Caption color={colors.text.tertiary}>Review Date</Caption>
            <Body>{format(new Date(decision.reviewDate), 'MMM d, yyyy')}</Body>
          </View>
          <View style={styles.infoRow}>
            <Caption color={colors.text.tertiary}>Confidence</Caption>
            <Body>
              {decision.confidenceLevel}/10 - {CONFIDENCE_LABELS[decision.confidenceLevel]}
            </Body>
          </View>
        </Card>

        <View style={styles.section}>
          <H4 style={styles.sectionTitle}>Description</H4>
          <Body>{decision.description}</Body>
        </View>

        <View style={styles.section}>
          <H4 style={styles.sectionTitle}>Expected Outcome</H4>
          <Body>{decision.expectedOutcome}</Body>
        </View>

        {isReviewed && decision.outcome ? (
          <>
            <Card style={styles.outcomeCard}>
              <H4 style={styles.sectionTitle}>Review Completed</H4>

              <View style={styles.outcomeSection}>
                <Caption color={colors.text.tertiary}>What Happened</Caption>
                <Body>{decision.outcome.description}</Body>
              </View>

              <View style={styles.outcomeSection}>
                <Caption color={colors.text.tertiary}>Outcome Rating</Caption>
                <Body>
                  {decision.outcome.rating}/10 - {OUTCOME_LABELS[decision.outcome.rating]}
                </Body>
              </View>

              {decision.outcome.lessonsLearned && (
                <View style={styles.outcomeSection}>
                  <Caption color={colors.text.tertiary}>Lessons Learned</Caption>
                  <Body>{decision.outcome.lessonsLearned}</Body>
                </View>
              )}

              <View style={styles.comparisonBox}>
                <Caption color={colors.text.tertiary}>Confidence vs Outcome</Caption>
                <Body>
                  Expected: {decision.confidenceLevel}/10 → Actual: {decision.outcome.rating}/10
                </Body>
                {decision.confidenceLevel > decision.outcome.rating && (
                  <Caption style={{ color: colors.warning.dark }}>
                    You were overconfident by {decision.confidenceLevel - decision.outcome.rating} points
                  </Caption>
                )}
                {decision.confidenceLevel < decision.outcome.rating && (
                  <Caption style={{ color: colors.success.dark }}>
                    You were underconfident by {decision.outcome.rating - decision.confidenceLevel} points
                  </Caption>
                )}
              </View>
            </Card>
          </>
        ) : (
          <>
            {!showReviewForm && daysUntilReview <= 0 && (
              <Button
                onPress={() => setShowReviewForm(true)}
                style={styles.reviewButton}
                fullWidth
              >
                Review This Decision
              </Button>
            )}

            {!showReviewForm && daysUntilReview > 0 && (
              <Card style={styles.pendingCard}>
                <Caption color={colors.text.tertiary}>
                  Review in {daysUntilReview} days
                </Caption>
              </Card>
            )}

            {showReviewForm && (
              <Card style={styles.reviewForm}>
                <H4 style={styles.sectionTitle}>Review Decision</H4>

                <Input
                  label="What Actually Happened?"
                  value={outcomeDescription}
                  onChangeText={setOutcomeDescription}
                  placeholder="Describe the actual outcome..."
                  multiline
                  numberOfLines={4}
                  containerStyle={styles.formInput}
                  style={styles.textArea}
                />

                <View style={styles.formSection}>
                  <Caption style={styles.formLabel}>Outcome Rating: {outcomeRating}/10</Caption>
                  <View style={styles.sliderContainer}>
                    {[...Array(10)].map((_, i) => (
                      <Pressable
                        key={i}
                        onPress={() => setOutcomeRating(i + 1)}
                        style={[
                          styles.sliderButton,
                          i + 1 <= outcomeRating && styles.sliderButtonActive,
                        ]}
                      />
                    ))}
                  </View>
                  <Caption color={colors.text.tertiary}>
                    {OUTCOME_LABELS[outcomeRating]}
                  </Caption>
                </View>

                <Input
                  label="Key Lessons Learned (Optional)"
                  value={lessonsLearned}
                  onChangeText={setLessonsLearned}
                  placeholder="What did you learn from this decision?"
                  multiline
                  numberOfLines={3}
                  containerStyle={styles.formInput}
                />

                <Button
                  onPress={handleSubmitReview}
                  loading={reviewing}
                  fullWidth
                >
                  Submit Review
                </Button>
              </Card>
            )}
          </>
        )}
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButton: {
    marginBottom: spacing[3],
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
    marginBottom: spacing[3],
  },

  title: {
    marginBottom: spacing[4],
  },

  infoCard: {
    marginBottom: spacing[4],
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },

  section: {
    marginBottom: spacing[4],
  },

  sectionTitle: {
    marginBottom: spacing[2],
  },

  outcomeCard: {
    marginTop: spacing[4],
  },

  outcomeSection: {
    marginBottom: spacing[3],
  },

  comparisonBox: {
    marginTop: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
  },

  reviewButton: {
    marginTop: spacing[4],
  },

  pendingCard: {
    marginTop: spacing[4],
    alignItems: 'center',
  },

  reviewForm: {
    marginTop: spacing[4],
  },

  formInput: {
    marginBottom: spacing[4],
  },

  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  formSection: {
    marginBottom: spacing[4],
  },

  formLabel: {
    marginBottom: spacing[2],
    fontWeight: '600',
    color: colors.text.primary,
  },

  sliderContainer: {
    flexDirection: 'row',
    gap: spacing[1],
    marginBottom: spacing[2],
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
});
