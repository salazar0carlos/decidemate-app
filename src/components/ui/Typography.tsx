import React, { ReactNode } from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { typography, colors } from '../../theme';

interface TypographyProps {
  children: ReactNode;
  style?: TextStyle;
  color?: string;
  numberOfLines?: number;
}

export function H1({ children, style, color, ...props }: TypographyProps) {
  return (
    <Text
      style={[styles.h1, { color: color || colors.text.primary }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function H2({ children, style, color, ...props }: TypographyProps) {
  return (
    <Text
      style={[styles.h2, { color: color || colors.text.primary }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function H3({ children, style, color, ...props }: TypographyProps) {
  return (
    <Text
      style={[styles.h3, { color: color || colors.text.primary }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function H4({ children, style, color, ...props }: TypographyProps) {
  return (
    <Text
      style={[styles.h4, { color: color || colors.text.primary }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function H5({ children, style, color, ...props }: TypographyProps) {
  return (
    <Text
      style={[styles.h5, { color: color || colors.text.primary }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function Body({ children, style, color, ...props }: TypographyProps) {
  return (
    <Text
      style={[styles.body, { color: color || colors.text.primary }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function BodyLarge({
  children,
  style,
  color,
  ...props
}: TypographyProps) {
  return (
    <Text
      style={[styles.bodyLarge, { color: color || colors.text.primary }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function BodySmall({
  children,
  style,
  color,
  ...props
}: TypographyProps) {
  return (
    <Text
      style={[styles.bodySmall, { color: color || colors.text.primary }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function Caption({ children, style, color, ...props }: TypographyProps) {
  return (
    <Text
      style={[styles.caption, { color: color || colors.text.secondary }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: typography.styles.h1,
  h2: typography.styles.h2,
  h3: typography.styles.h3,
  h4: typography.styles.h4,
  h5: typography.styles.h5,
  body: typography.styles.body,
  bodyLarge: typography.styles.bodyLarge,
  bodySmall: typography.styles.bodySmall,
  caption: typography.styles.caption,
});
