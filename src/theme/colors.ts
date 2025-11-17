// Premium color palette - no generic blues, sophisticated neutrals with accent
export const colors = {
  // Primary - Deep Teal (sophisticated, trustworthy)
  primary: {
    50: '#E6F2F0',
    100: '#CCE5E1',
    200: '#99CBC3',
    300: '#66B1A5',
    400: '#339787',
    500: '#007D69', // Main primary
    600: '#006454',
    700: '#004B3F',
    800: '#00322A',
    900: '#001915',
  },

  // Neutrals - Warm grays (not cold)
  neutral: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
  },

  // Semantic colors
  success: {
    light: '#DCFCE7',
    main: '#16A34A',
    dark: '#166534',
  },

  warning: {
    light: '#FEF3C7',
    main: '#F59E0B',
    dark: '#B45309',
  },

  error: {
    light: '#FEE2E2',
    main: '#EF4444',
    dark: '#B91C1C',
  },

  info: {
    light: '#E0E7FF',
    main: '#6366F1',
    dark: '#4338CA',
  },

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAF9',
    tertiary: '#F5F5F4',
  },

  // Text colors
  text: {
    primary: '#1C1917',
    secondary: '#57534E',
    tertiary: '#A8A29E',
    inverse: '#FFFFFF',
  },

  // Border colors
  border: {
    light: '#E7E5E4',
    main: '#D6D3D1',
    dark: '#A8A29E',
  },

  // Pure colors
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof colors;
export type ColorShade = keyof typeof colors.primary;
