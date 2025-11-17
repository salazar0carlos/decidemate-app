import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, typography, spacing } from '../../theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  value,
  onFocus,
  onBlur,
  containerStyle,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const labelPosition = useSharedValue(value ? 1 : 0);
  const borderColor = useSharedValue(0);

  useEffect(() => {
    labelPosition.value = withTiming(value || isFocused ? 1 : 0, {
      duration: 200,
    });
  }, [value, isFocused]);

  useEffect(() => {
    borderColor.value = withTiming(isFocused ? 1 : 0, {
      duration: 200,
    });
  }, [isFocused]);

  const labelStyle = useAnimatedStyle(() => {
    return {
      top: labelPosition.value === 1 ? 8 : 20,
      fontSize: labelPosition.value === 1 ? 12 : 16,
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const color =
      borderColor.value === 1 ? colors.primary[500] : colors.border.main;
    return {
      borderColor: color,
    };
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={containerStyle}>
      <Animated.View
        style={[
          styles.inputContainer,
          containerAnimatedStyle,
          error && styles.errorContainer,
        ]}
      >
        <Animated.Text
          style={[
            styles.label,
            labelStyle,
            isFocused && styles.labelFocused,
            error && styles.labelError,
          ]}
        >
          {label}
        </Animated.Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.text.tertiary}
          {...props}
        />
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1.5,
    borderColor: colors.border.main,
    borderRadius: 12,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
    paddingBottom: spacing[3],
    backgroundColor: colors.white,
    position: 'relative',
  },

  label: {
    position: 'absolute',
    left: spacing[4],
    color: colors.text.secondary,
    backgroundColor: colors.white,
    paddingHorizontal: spacing[1],
  },

  labelFocused: {
    color: colors.primary[500],
  },

  labelError: {
    color: colors.error.main,
  },

  input: {
    ...typography.styles.body,
    color: colors.text.primary,
    padding: 0,
    minHeight: 24,
  },

  errorContainer: {
    borderColor: colors.error.main,
  },

  errorText: {
    ...typography.styles.caption,
    color: colors.error.main,
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
});
