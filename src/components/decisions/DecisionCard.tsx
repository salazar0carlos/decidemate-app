import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { format, differenceInDays } from 'date-fns';
import { Decision, CATEGORY_COLORS, CATEGORY_LABELS } from '../../types/decision';
import { H4, Body, Caption } from '../ui/Typography';
import { Card } from '../ui/Card';
import { colors, spacing } from '../../theme';

interface DecisionCardProps {
  decision: Decision;
}

export function DecisionCard({ decision }: DecisionCardProps) {
  const router = useRouter();

  const daysUntilReview = differenceInDays(new Date(decision.reviewDate), new Date());
  const isReviewed = !!decision.outcome;
  const categoryColor = CATEGORY_COLORS[decision.category];

  const handlePress = () => {
    router.push(`/decision/${decision.id}`);
  };

  return (
    <Card onPress={handlePress} style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
          <Caption style={{ color: categoryColor }}>
            {CATEGORY_LABELS[decision.category]}
          </Caption>
        </View>
        {!isReviewed && daysUntilReview <= 0 && (
          <View style={styles.dueBadge}>
            <Caption style={styles.dueText}>Due for review</Caption>
          </View>
        )}
      </View>

      <H4 style={styles.title} numberOfLines={2}>
        {decision.title}
      </H4>

      <Body style={styles.description} numberOfLines={2} color={colors.text.secondary}>
        {decision.description}
      </Body>

      <View style={styles.footer}>
        <View style={styles.confidenceContainer}>
          <Caption color={colors.text.tertiary}>Confidence</Caption>
          <View style={styles.confidenceBar}>
            <View
              style={[
                styles.confidenceFill,
                { width: `${decision.confidenceLevel * 10}%` },
              ]}
            />
          </View>
        </View>

        {!isReviewed && (
          <Caption color={colors.text.tertiary}>
            {daysUntilReview > 0
              ? `Review in ${daysUntilReview} days`
              : daysUntilReview === 0
              ? 'Review today'
              : `${Math.abs(daysUntilReview)} days overdue`}
          </Caption>
        )}

        {isReviewed && decision.outcome && (
          <View style={styles.outcomeBadge}>
            <Caption style={styles.outcomeText}>
              Reviewed • {decision.outcome.rating}/10
            </Caption>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing[3],
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },

  categoryBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
  },

  dueBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
    backgroundColor: colors.warning.light,
  },

  dueText: {
    color: colors.warning.dark,
    fontWeight: '600',
  },

  title: {
    marginBottom: spacing[2],
  },

  description: {
    marginBottom: spacing[3],
  },

  footer: {
    gap: spacing[2],
  },

  confidenceContainer: {
    gap: spacing[1],
  },

  confidenceBar: {
    height: 6,
    backgroundColor: colors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
  },

  confidenceFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 3,
  },

  outcomeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
    backgroundColor: colors.success.light,
  },

  outcomeText: {
    color: colors.success.dark,
    fontWeight: '600',
  },
});
