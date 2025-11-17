// Reanimated spring configs for premium feel
import { WithSpringConfig } from 'react-native-reanimated';

export const animations = {
  // Spring configurations
  spring: {
    // Default spring - smooth and natural
    default: {
      damping: 20,
      stiffness: 200,
      mass: 1,
    } as WithSpringConfig,

    // Bouncy - playful interactions
    bouncy: {
      damping: 12,
      stiffness: 200,
      mass: 1,
    } as WithSpringConfig,

    // Snappy - quick, responsive
    snappy: {
      damping: 25,
      stiffness: 400,
      mass: 0.8,
    } as WithSpringConfig,

    // Gentle - subtle movements
    gentle: {
      damping: 30,
      stiffness: 150,
      mass: 1.2,
    } as WithSpringConfig,

    // Fast - immediate feedback
    fast: {
      damping: 40,
      stiffness: 500,
      mass: 0.5,
    } as WithSpringConfig,
  },

  // Duration values (in milliseconds)
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 400,
    slower: 600,
  },

  // Easing curves (for use with timing animations)
  easing: {
    // Custom easing functions can be added here
    // For now, we'll rely on spring configs
  },

  // Common animation patterns
  patterns: {
    // Press animation scale
    pressScale: 0.96,

    // Active state scale
    activeScale: 0.98,

    // Hover scale (for web)
    hoverScale: 1.02,
  },
} as const;

export type SpringConfigKey = keyof typeof animations.spring;
export type DurationKey = keyof typeof animations.duration;
