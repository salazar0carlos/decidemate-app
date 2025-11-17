// Navigation types for Expo Router

export type RootStackParamList = {
  index: undefined;
  '(tabs)': undefined;
  'decision/[id]': { id: string };
  onboarding: undefined;
  paywall: undefined;
};

export type TabsParamList = {
  index: undefined;
  add: undefined;
  insights: undefined;
  settings: undefined;
};
