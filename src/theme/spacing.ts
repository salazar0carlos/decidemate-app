// 4px base unit spacing system
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
} as const;

// Common padding/margin patterns
export const spacingPatterns = {
  // Screen padding
  screenHorizontal: spacing[4],
  screenVertical: spacing[6],

  // Card padding
  cardPadding: spacing[4],
  cardGap: spacing[3],

  // List item spacing
  listItemVertical: spacing[3],
  listItemHorizontal: spacing[4],
  listGap: spacing[2],

  // Input spacing
  inputVertical: spacing[3],
  inputHorizontal: spacing[4],

  // Button spacing
  buttonVertical: spacing[3],
  buttonHorizontal: spacing[6],
  buttonGap: spacing[2],

  // Section spacing
  sectionGap: spacing[6],
  componentGap: spacing[4],
} as const;

export type SpacingKey = keyof typeof spacing;
export type SpacingValue = typeof spacing[SpacingKey];
