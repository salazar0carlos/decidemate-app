import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { H1, Caption } from '../../src/components/ui/Typography';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { DecisionCard } from '../../src/components/decisions/DecisionCard';
import { useDecisions } from '../../src/hooks/useDecisions';
import { DecisionFilter } from '../../src/types/decision';
import { colors, spacing } from '../../src/theme';

const FILTERS: Array<{ key: DecisionFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'reviewed', label: 'Reviewed' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<DecisionFilter>('all');
  const { decisions, loading, refresh } = useDecisions(selectedFilter);

  const handleAddDecision = () => {
    router.push('/(tabs)/add');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <H1>Decisions</H1>
        <Caption color={colors.text.tertiary}>{decisions.length} total</Caption>
      </View>

      <View style={styles.filterContainer}>
        {FILTERS.map(filter => (
          <Pressable
            key={filter.key}
            onPress={() => setSelectedFilter(filter.key)}
            style={[
              styles.filterChip,
              selectedFilter === filter.key && styles.filterChipActive,
            ]}
          >
            <Caption
              color={
                selectedFilter === filter.key
                  ? colors.primary[500]
                  : colors.text.secondary
              }
              style={selectedFilter === filter.key ? styles.filterChipTextActive : undefined}
            >
              {filter.label}
            </Caption>
          </Pressable>
        ))}
      </View>

      {decisions.length === 0 && !loading ? (
        <EmptyState
          title="No decisions yet"
          message="Start tracking your decisions to improve your judgment over time."
          actionLabel="Add Decision"
          onAction={handleAddDecision}
        />
      ) : (
        <FlatList
          data={decisions}
          renderItem={({ item }) => <DecisionCard decision={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              tintColor={colors.primary[500]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
  },

  filterContainer: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },

  filterChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
  },

  filterChipActive: {
    backgroundColor: colors.primary[50],
  },

  filterChipTextActive: {
    fontWeight: '600',
  },

  list: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
});
