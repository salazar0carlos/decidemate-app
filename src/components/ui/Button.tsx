import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, shadows, animations } from '../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  children: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(animations.patterns.pressScale, animations.spring.snappy);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(1, animations.spring.snappy);
    }
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const containerStyle = [
    styles.base,
    styles[`${variant}Container`],
    styles[`${size}Container`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    (disabled || loading) && styles.disabledText,
  ];

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[containerStyle, animatedStyle]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.primary[500]}
          size="small"
        />
      ) : (
        <Text style={textStyle}>{children}</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // Variant styles
  primaryContainer: {
    backgroundColor: colors.primary[500],
    ...shadows.md,
  },
  primaryText: {
    color: colors.white,
  },

  secondaryContainer: {
    backgroundColor: colors.neutral[100],
    ...shadows.sm,
  },
  secondaryText: {
    color: colors.text.primary,
  },

  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.border.main,
  },
  outlineText: {
    color: colors.text.primary,
  },

  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: colors.primary[500],
  },

  // Size styles
  smallContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  smallText: {
    ...typography.styles.buttonSmall,
  },

  mediumContainer: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
  mediumText: {
    ...typography.styles.button,
  },

  largeContainer: {
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[4],
  },
  largeText: {
    ...typography.styles.button,
    fontSize: 18,
  },

  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },

  fullWidth: {
    width: '100%',
  },

  text: {
    fontWeight: '600',
  },
});
