// Decision data models

export type DecisionCategory =
  | 'financial'
  | 'career'
  | 'relationships'
  | 'health'
  | 'business'
  | 'personal'
  | 'other';

export interface DecisionOutcome {
  description: string;
  rating: number; // 1-10 how well it turned out
  lessonsLearned: string;
  reviewedAt: Date;
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  category: DecisionCategory;
  confidenceLevel: number; // 1-10
  expectedOutcome: string;
  reviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
  outcome?: DecisionOutcome;
  tags: string[];
  isArchived?: boolean;
}

// Helper type for creating new decisions
export type CreateDecisionInput = Omit<
  Decision,
  'id' | 'createdAt' | 'updatedAt' | 'outcome'
>;

// Helper type for updating decisions
export type UpdateDecisionInput = Partial<
  Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>
>;

// Filter types
export type DecisionFilter = 'all' | 'pending' | 'reviewed' | 'archived';

// Category labels and icons
export const CATEGORY_LABELS: Record<DecisionCategory, string> = {
  financial: 'Financial',
  career: 'Career',
  relationships: 'Relationships',
  health: 'Health',
  business: 'Business',
  personal: 'Personal',
  other: 'Other',
};

// Category colors (using theme colors as reference)
export const CATEGORY_COLORS: Record<DecisionCategory, string> = {
  financial: '#16A34A',
  career: '#6366F1',
  relationships: '#EC4899',
  health: '#EF4444',
  business: '#F59E0B',
  personal: '#8B5CF6',
  other: '#78716C',
};

// Confidence level labels
export const CONFIDENCE_LABELS: Record<number, string> = {
  1: 'Very Uncertain',
  2: 'Quite Uncertain',
  3: 'Somewhat Uncertain',
  4: 'Slightly Uncertain',
  5: 'Neutral',
  6: 'Slightly Confident',
  7: 'Somewhat Confident',
  8: 'Quite Confident',
  9: 'Very Confident',
  10: 'Extremely Confident',
};

// Outcome rating labels
export const OUTCOME_LABELS: Record<number, string> = {
  1: 'Terrible',
  2: 'Very Poor',
  3: 'Poor',
  4: 'Below Average',
  5: 'Average',
  6: 'Above Average',
  7: 'Good',
  8: 'Very Good',
  9: 'Excellent',
  10: 'Outstanding',
};
