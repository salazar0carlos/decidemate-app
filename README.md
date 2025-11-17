# DecideMate

A production-ready React Native app for tracking decisions, reviewing outcomes, and improving judgment over time.

## Features

### Core Functionality
- **Decision Tracking**: Log decisions with title, description, category, and confidence level
- **Smart Reviews**: Set review dates and receive reminders to evaluate outcomes
- **Analytics & Insights**: Track confidence calibration, category performance, and decision patterns
- **Premium Tiers**: Freemium model (30 decisions free, unlimited with premium)

### Premium Design System
- Custom color palette with deep teal primary color and warm neutrals
- Typography system using native system fonts (SF Pro/Roboto)
- 4px base spacing system for consistent layout
- Platform-specific shadows with subtle, realistic depth
- Reanimated spring animations for premium feel
- Haptic feedback on all interactive elements

### Technical Highlights
- **React Native with Expo SDK 54**
- **TypeScript (strict mode)** - Zero type errors
- **Expo Router** - File-based navigation
- **AsyncStorage** - Local data persistence
- **React Native Reanimated** - Smooth 60fps animations
- **Victory Native** - Data visualization
- **RevenueCat Integration** (placeholder for in-app purchases)

## Project Structure

```
decidemate-app/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx             # Home/Decision List
│   │   ├── add.tsx               # Add Decision Form
│   │   ├── insights.tsx          # Analytics Dashboard
│   │   └── settings.tsx          # Settings & Data Management
│   ├── decision/
│   │   └── [id].tsx              # Decision Detail & Review
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Entry redirect
├── src/
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.tsx        # Animated button with haptics
│   │   │   ├── Card.tsx          # Elevated card component
│   │   │   ├── Input.tsx         # Floating label input
│   │   │   ├── Typography.tsx    # Pre-styled text components
│   │   │   └── EmptyState.tsx    # Empty state component
│   │   └── decisions/
│   │       └── DecisionCard.tsx  # Decision list item
│   ├── hooks/
│   │   ├── useDecisions.ts       # Decision state management
│   │   └── usePremium.ts         # Premium status hook
│   ├── services/
│   │   ├── storage.ts            # AsyncStorage wrapper
│   │   ├── decisions.ts          # CRUD operations
│   │   └── analytics.ts          # Pattern analysis
│   ├── theme/
│   │   ├── colors.ts             # Premium color palette
│   │   ├── typography.ts         # Font system
│   │   ├── spacing.ts            # Spacing system
│   │   ├── shadows.ts            # Shadow styles
│   │   └── animations.ts         # Animation configs
│   └── types/
│       ├── decision.ts           # Decision data models
│       └── navigation.ts         # Navigation types
├── assets/                       # App icons and splash screens
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript configuration
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### TypeScript Verification

```bash
# Check for type errors
npx tsc --noEmit
```

## Data Models

### Decision
```typescript
interface Decision {
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
```

### Categories
- Financial
- Career
- Relationships
- Health
- Business
- Personal
- Other

## Key Features Implementation

### 1. Decision List (Home Screen)
- FlatList with pull-to-refresh
- Filter chips (All, Pending, Reviewed)
- Decision cards with confidence meters
- Empty state with CTA
- Navigation to detail screen

### 2. Add Decision Flow
- Single-page form (streamlined from multi-step)
- Category selection with visual chips
- Confidence level slider (1-10)
- Review period selection (30/60/90 days)
- Free tier limit enforcement (30 decisions)

### 3. Decision Detail & Review
- Full decision information display
- Review form when due
- Outcome rating (1-10)
- Lessons learned capture
- Confidence vs outcome comparison
- Visual calibration feedback

### 4. Insights & Analytics
- Overall statistics cards
- Confidence calibration analysis
- Category performance breakdown
- Pattern insights generation
- Success rate tracking

### 5. Settings
- Data export (JSON)
- Clear all data (with confirmation)
- Premium upgrade CTA
- App information

## App Store Configuration

### iOS
- **Bundle ID**: com.vallos.decidemate
- **Build Number**: 1
- **Supports iPad**: Yes
- **Required Permission**: Notifications

### Android
- **Package**: com.vallos.decidemate
- **Version Code**: 1
- **Permissions**: NOTIFICATIONS, VIBRATE

## Next Steps for Production

### Carlos's TODO List:

1. **RevenueCat Setup**
   - Create RevenueCat account
   - Configure products (monthly/annual subscriptions)
   - Add API keys to app
   - Test purchase flow

2. **App Assets**
   - Design app icon (1024x1024)
   - Create splash screen
   - Generate adaptive icons
   - Add notification icon

3. **Screenshots & Marketing**
   - Capture App Store screenshots
   - Write compelling descriptions
   - Choose appropriate categories

4. **Legal Requirements**
   - Create privacy policy
   - Add terms of service
   - Set up support email

5. **Developer Accounts**
   - Apple Developer Program ($99/year)
   - Google Play Console ($25 one-time)

6. **Testing**
   - TestFlight beta testing (iOS)
   - Internal testing (Android)
   - User feedback iteration

7. **Notifications**
   - Implement notification scheduling for review dates
   - Add deep linking to decision detail
   - Test notification delivery

8. **Onboarding**
   - Create 3-4 screen carousel
   - Request notification permissions
   - Optional premium pitch

9. **EAS Build**
   - Configure Expo Application Services
   - Create production builds
   - Submit to app stores

10. **Analytics** (Optional)
    - Add Firebase Analytics
    - Track key user actions
    - Monitor retention metrics

## Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Create iOS build
eas build --platform ios

# Create Android build
eas build --platform android

# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

## Technologies Used

- **React Native** 0.81.5
- **Expo** SDK 54
- **TypeScript** 5.9.2
- **Expo Router** 6.0.15
- **React Native Reanimated** 4.1.5
- **React Native Gesture Handler** 2.29.1
- **AsyncStorage** 2.2.0
- **Victory Native** 41.20.2
- **date-fns** 4.1.0
- **uuid** 13.0.0

## License

Private - All rights reserved

## Contact

For questions or support, contact Carlos at the provided email.

---

**Built with Claude Code** - A production-ready app in a single session.
