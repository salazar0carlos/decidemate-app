import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { H1, H4, Body, Caption } from '../../src/components/ui/Typography';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { decisionsService } from '../../src/services/decisions';
import { storage } from '../../src/services/storage';
import { colors, spacing } from '../../src/theme';

export default function SettingsScreen() {
  const handleExport = async () => {
    try {
      const json = await decisionsService.exportToJSON();
      Alert.alert('Export', 'In a real app, this would share the JSON file:\n\n' + json.substring(0, 100) + '...');
    } catch (error) {
      Alert.alert('Error', 'Failed to export decisions');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure? This will delete all your decisions permanently.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            const success = await decisionsService.clearAll();
            if (success) {
              Alert.alert('Success', 'All data cleared');
            } else {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <H1 style={styles.title}>Settings</H1>

        <View style={styles.section}>
          <H4 style={styles.sectionTitle}>Data Management</H4>

          <Card style={styles.card} onPress={handleExport}>
            <View style={styles.settingRow}>
              <View>
                <Body style={styles.settingLabel}>Export Decisions</Body>
                <Caption color={colors.text.tertiary}>
                  Download your decisions as JSON
                </Caption>
              </View>
              <Caption color={colors.primary[500]}>→</Caption>
            </View>
          </Card>

          <Card style={styles.card} onPress={handleClearData}>
            <View style={styles.settingRow}>
              <View>
                <Body style={styles.dangerLabel}>
                  Clear All Data
                </Body>
                <Caption color={colors.text.tertiary}>
                  Permanently delete all decisions
                </Caption>
              </View>
              <Caption color={colors.error.main}>→</Caption>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <H4 style={styles.sectionTitle}>About</H4>

          <Card style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.aboutContent}>
                <Body style={styles.settingLabel}>DecideMate</Body>
                <Caption color={colors.text.tertiary}>Version 1.0.0</Caption>
                <Caption color={colors.text.tertiary} style={styles.aboutText}>
                  Track your decisions, review outcomes, and improve your judgment over time.
                </Caption>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <H4 style={styles.sectionTitle}>Premium</H4>

          <Card style={styles.premiumCard}>
            <Body style={styles.premiumTitle}>Unlock Premium</Body>
            <Caption color={colors.text.tertiary} style={styles.premiumText}>
              • Unlimited decisions (Free: 30 limit)
            </Caption>
            <Caption color={colors.text.tertiary} style={styles.premiumText}>
              • Advanced insights and analytics
            </Caption>
            <Caption color={colors.text.tertiary} style={styles.premiumText}>
              • Export and backup your data
            </Caption>
            <Button
              onPress={() => Alert.alert('Premium', 'RevenueCat integration would be implemented here')}
              style={styles.premiumButton}
            >
              Upgrade to Premium
            </Button>
          </Card>
        </View>
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
    marginBottom: spacing[4],
  },

  section: {
    marginBottom: spacing[6],
  },

  sectionTitle: {
    marginBottom: spacing[3],
  },

  card: {
    marginBottom: spacing[2],
  },

  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  settingLabel: {
    fontWeight: '600',
    marginBottom: spacing[1],
  },

  dangerLabel: {
    fontWeight: '600',
    marginBottom: spacing[1],
    color: colors.error.main,
  },

  aboutContent: {
    flex: 1,
  },

  aboutText: {
    marginTop: spacing[2],
    lineHeight: 20,
  },

  premiumCard: {
    backgroundColor: colors.primary[50],
  },

  premiumTitle: {
    fontWeight: '600',
    marginBottom: spacing[2],
  },

  premiumText: {
    marginBottom: spacing[1],
  },

  premiumButton: {
    marginTop: spacing[3],
  },
});
