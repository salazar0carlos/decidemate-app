import React from 'react';
import { View, StyleSheet } from 'react-native';
import { H3, Body } from './Typography';
import { Button } from './Button';
import { colors, spacing } from '../../theme';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <H3 style={styles.title}>{title}</H3>
        <Body style={styles.message} color={colors.text.secondary}>
          {message}
        </Body>
        {actionLabel && onAction && (
          <Button onPress={onAction} style={styles.button}>
            {actionLabel}
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },

  content: {
    alignItems: 'center',
    maxWidth: 300,
  },

  title: {
    marginBottom: spacing[2],
    textAlign: 'center',
  },

  message: {
    textAlign: 'center',
    marginBottom: spacing[4],
  },

  button: {
    minWidth: 150,
  },
});
