import { Platform } from 'react-native';

// Font system with proper scaling
export const typography = {
  // Font families
  fonts: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    semibold: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
  },

  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
  },

  // Pre-defined text styles
  styles: {
    h1: {
      fontSize: 36,
      lineHeight: 43,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 30,
      lineHeight: 36,
      fontWeight: '700' as const,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 24,
      lineHeight: 29,
      fontWeight: '600' as const,
      letterSpacing: -0.25,
    },
    h4: {
      fontSize: 20,
      lineHeight: 24,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 18,
      lineHeight: 22,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    bodyLarge: {
      fontSize: 18,
      lineHeight: 27,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    bodySmall: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '400' as const,
      letterSpacing: 0.25,
    },
    button: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600' as const,
      letterSpacing: 0.25,
    },
    buttonSmall: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '600' as const,
      letterSpacing: 0.25,
    },
  },
} as const;

export type TypographyStyle = keyof typeof typography.styles;
