import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { H1, H4, Body, Caption } from '../../src/components/ui/Typography';
import { Card } from '../../src/components/ui/Card';
import { analyticsService, AnalyticsStats, CategoryStats } from '../../src/services/analytics';
import { CATEGORY_LABELS } from '../../src/types/decision';
import { colors, spacing } from '../../src/theme';

export default function InsightsScreen() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const [overallStats, catStats, insightsData] = await Promise.all([
      analyticsService.getOverallStats(),
      analyticsService.getCategoryStats(),
      analyticsService.generateInsights(),
    ]);

    setStats(overallStats);
    setCategoryStats(catStats);
    setInsights(insightsData);
    setLoading(false);
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

  if (!stats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Body>No data available</Body>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <H1 style={styles.title}>Insights</H1>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <H4 style={styles.statValue}>{stats.totalDecisions}</H4>
            <Caption color={colors.text.tertiary}>Total Decisions</Caption>
          </Card>

          <Card style={styles.statCard}>
            <H4 style={styles.statValue}>{stats.averageConfidence.toFixed(1)}/10</H4>
            <Caption color={colors.text.tertiary}>Avg Confidence</Caption>
          </Card>

          <Card style={styles.statCard}>
            <H4 style={styles.statValue}>{stats.reviewCompletionRate.toFixed(0)}%</H4>
            <Caption color={colors.text.tertiary}>Review Rate</Caption>
          </Card>

          {stats.reviewedDecisions > 0 && (
            <Card style={styles.statCard}>
              <H4 style={styles.statValue}>{stats.averageOutcome.toFixed(1)}/10</H4>
              <Caption color={colors.text.tertiary}>Avg Outcome</Caption>
            </Card>
          )}
        </View>

        {insights.length > 0 && (
          <View style={styles.section}>
            <H4 style={styles.sectionTitle}>Your Patterns</H4>
            {insights.map((insight, index) => (
              <Card key={index} style={styles.insightCard}>
                <Body>💡 {insight}</Body>
              </Card>
            ))}
          </View>
        )}

        {categoryStats.length > 0 && (
          <View style={styles.section}>
            <H4 style={styles.sectionTitle}>By Category</H4>
            {categoryStats.map(cat => (
              <Card key={cat.category} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <Body style={styles.categoryName}>{CATEGORY_LABELS[cat.category]}</Body>
                  <Caption color={colors.text.tertiary}>{cat.count} decisions</Caption>
                </View>
                <View style={styles.categoryStats}>
                  <View style={styles.categoryStat}>
                    <Caption color={colors.text.tertiary}>Confidence</Caption>
                    <Body>{cat.averageConfidence.toFixed(1)}/10</Body>
                  </View>
                  {cat.averageOutcome > 0 && (
                    <>
                      <View style={styles.categoryStat}>
                        <Caption color={colors.text.tertiary}>Outcome</Caption>
                        <Body>{cat.averageOutcome.toFixed(1)}/10</Body>
                      </View>
                      <View style={styles.categoryStat}>
                        <Caption color={colors.text.tertiary}>Success Rate</Caption>
                        <Body>{cat.successRate.toFixed(0)}%</Body>
                      </View>
                    </>
                  )}
                </View>
              </Card>
            ))}
          </View>
        )}

        {stats.reviewedDecisions >= 3 && (
          <Card style={styles.calibrationCard}>
            <H4 style={styles.sectionTitle}>Confidence Calibration</H4>
            <Body style={styles.calibrationText}>
              {Math.abs(stats.confidenceCalibration) < 0.5
                ? "🎯 You're well-calibrated! Your confidence matches outcomes."
                : stats.confidenceCalibration > 0
                ? `⚠️ You tend to be overconfident by ${(stats.confidenceCalibration * 10).toFixed(0)}% on average.`
                : `💭 You tend to be underconfident by ${(Math.abs(stats.confidenceCalibration) * 10).toFixed(0)}% on average.`}
            </Body>
          </Card>
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

  title: {
    marginBottom: spacing[4],
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginBottom: spacing[6],
  },

  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: spacing[4],
  },

  statValue: {
    marginBottom: spacing[1],
    color: colors.primary[500],
  },

  section: {
    marginBottom: spacing[6],
  },

  sectionTitle: {
    marginBottom: spacing[3],
  },

  insightCard: {
    marginBottom: spacing[2],
  },

  categoryCard: {
    marginBottom: spacing[3],
  },

  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },

  categoryName: {
    fontWeight: '600',
  },

  categoryStats: {
    flexDirection: 'row',
    gap: spacing[4],
  },

  categoryStat: {
    flex: 1,
  },

  calibrationCard: {
    backgroundColor: colors.primary[50],
  },

  calibrationText: {
    marginTop: spacing[2],
  },
});
