# React Native Mobile App Specification - Odamak

> **Document Version:** 1.0.0
> **Created:** January 28, 2026
> **Project Name:** Odamak Mobile (مرصادنا)
> **Platform:** iOS & Android
> **Based on:** Next.js Web Application

---

## 📋 Table of Contents

- [Executive Summary](#executive-summary)
- [Business Requirements](#business-requirements)
- [App Features & Functionality](#app-features--functionality)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [UI/UX Design Guidelines](#uiux-design-guidelines)
- [API Integration](#api-integration)
- [Mobile-Specific Features](#mobile-specific-features)
- [State Management](#state-management)
- [Navigation Structure](#navigation-structure)
- [Data Flow Architecture](#data-flow-architecture)
- [Performance Requirements](#performance-requirements)
- [Security Requirements](#security-requirements)
- [Offline Capabilities](#offline-capabilities)
- [Push Notifications](#push-notifications)
- [Localization](#localization)
- [Testing Strategy](#testing-strategy)
- [Deployment](#deployment)
- [Phase 1 MVP Scope](#phase-1-mvp-scope)
- [Future Enhancements](#future-enhancements)

---

## 📱 Executive Summary

### Project Overview

**Odamak Mobile** is a React Native cross-platform mobile application that brings the comprehensive gold and currency tracking platform to iOS and Android devices. The app provides real-time market data, smart calculators, and analytics tools for gold investors, currency traders, and financial enthusiasts in Egypt.

### Target Audience
- Gold investors and traders in Egypt
- Currency exchange seekers
- Cryptocurrency enthusiasts
- Financial analysts
- Mobile-first users requiring on-the-go access to market data

### Core Value Proposition
- **Real-time Updates**: Live gold prices, currency rates, and crypto data
- **Smart Calculators**: Gold, currency, and Zakat calculators
- **Market Intelligence**: Charts, trends, and analytics
- **Mobile-First**: Native mobile experience with offline support
- **Bilingual**: Full Arabic and English support with RTL layout

### Key Differentiators
- Push notifications for price alerts
- Offline data caching for uninterrupted access
- Native mobile performance
- Biometric authentication
- Widget support for home screen
- Dark mode support

---

## 💼 Business Requirements

### Primary Business Goals

1. **Market Expansion**: Reach mobile-first users who prefer native apps
2. **User Engagement**: Increase daily active users through push notifications
3. **Data Accessibility**: Provide real-time market data anywhere, anytime
4. **User Retention**: Offline capabilities and personalized alerts
5. **Monetization Ready**: Prepare for premium features and subscriptions

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Daily Active Users (DAU) | 10,000+ | Analytics |
| App Store Rating | 4.5+ stars | App Store/Play Store |
| Session Duration | 5+ minutes | Analytics |
| User Retention (30-day) | 40%+ | Analytics |
| Crash-Free Rate | 99.5%+ | Firebase/Crashlytics |
| API Response Time | <1 second | Monitoring |

### User Personas

#### Persona 1: Gold Investor
- **Name**: Ahmed, 35 years old
- **Goal**: Track gold prices throughout the day
- **Needs**: Real-time price alerts, calculator for investment decisions
- **Behavior**: Checks app 5-10 times per day

#### Persona 2: Currency Trader
- **Name**: Fatma, 28 years old
- **Goal**: Find best exchange rates across banks
- **Needs**: Bank comparison, currency converter, rate alerts
- **Behavior**: Uses app before making currency exchanges

#### Persona 3: Financial Analyst
- **Name**: Mohamed, 42 years old
- **Goal**: Analyze market trends and predictions
- **Needs**: Historical charts, analytics, data export
- **Behavior**: Weekly deep analysis sessions

---

## 🎯 App Features & Functionality

### Core Features (Must Have)

#### 1. Real-Time Gold Prices
- **24K, 21K, 18K Gold**: Live prices per gram
- **Gold Pound**: Egyptian gold pound pricing
- **Gold Ounce**: International ounce (USD)
- **Buy/Sell Spread**: Display bid-ask spread
- **24h Change**: Percentage and absolute change
- **Trend Indicators**: Up/down arrows with color coding
- **Auto-Refresh**: 60-second interval updates
- **Pull-to-Refresh**: Manual refresh capability

**UI Components:**
- Price cards with large, readable numbers
- Trend charts (mini sparklines)
- Last updated timestamp
- Refresh indicator

#### 2. Currency Exchange Rates
- **Major Currencies**: USD, EUR, GBP, SAR, KWD, AED, QAR
- **Bank Rates**: All Egyptian banks (10-15 banks)
- **Parallel Market**: Black market rates
- **Buy/Sell Prices**: Both directions for each bank
- **Best Rate Finder**: Highlight best buy/sell rates
- **Rate Comparison**: Side-by-side bank comparison
- **Historical Data**: 7-day, 30-day, 90-day charts

**UI Components:**
- Currency cards with flag icons
- Bank rate tables with sort/filter
- Comparison view
- Rate trend charts

#### 3. Cryptocurrency Prices
- **Major Cryptos**: BTC, ETH, USDT, BNB, XRP, ADA, SOL, DOGE
- **Live Prices**: Real-time crypto data
- **24h Stats**: Volume, market cap, change %
- **Market Overview**: Total market cap, dominance

**UI Components:**
- Crypto price cards
- Market stats bar
- Price comparison table

#### 4. Smart Calculators

**Gold Calculator:**
- Input: Weight (grams), Karat (24k/21k/18k)
- Output: Total value in EGP
- Real-time calculation
- History of calculations (localStorage)

**Currency Converter:**
- Input: Amount, From Currency, To Currency
- Output: 3 scenarios
  - Bank average rate
  - Parallel market rate
  - Credit card rate (+10% markup)
- Swap currencies button
- History of conversions

**Zakat Calculator:**
- Input: Gold weight, Karat
- Output: Zakat amount (2.5%)
- Nisab threshold indicator
- Islamic date display

**UI Components:**
- Number pad for inputs
- Dropdown selectors
- Result cards with copy functionality
- Calculation history list

#### 5. Price Charts
- **Time Periods**: 24h, 7d, 30d, 90d, 1y
- **Chart Types**: Line, candlestick
- **Zoom/Pan**: Pinch to zoom, swipe to navigate
- **Crosshair**: Tap to see exact values
- **Comparison Mode**: Compare multiple assets

**UI Components:**
- Interactive charts (recharts or Victory Native)
- Period selector buttons
- Chart controls (type, indicators)

#### 6. Price Alerts (User Dashboard)
- **Alert Types**: Price above, price below, % change
- **Assets**: Gold (all karats), currencies, crypto
- **Notification**: Push notifications when triggered
- **Management**: Create, edit, delete, enable/disable alerts

**UI Components:**
- Alert list with status indicators
- Alert creation form
- Notification settings

#### 7. Bank Rate Comparison
- **All Banks**: NBE, CIB, Banque Misr, etc.
- **Sort Options**: Best buy, best sell, bank name
- **Filter**: By currency
- **Pin Favorites**: Mark preferred banks
- **Historical Charts**: Per-bank rate history

**UI Components:**
- Bank cards with logos
- Sort/filter bar
- Pin/unpin toggle
- Detailed bank view

### Secondary Features (Should Have)

#### 8. Market Analytics
- **Market Pulse**: Current market sentiment
- **Price Trends**: Up/down/stable indicators
- **Predictions**: AI-based predictions (if available)
- **News Feed**: Market news and updates (future)

#### 9. Dealers Directory (Gold)
- **Gold Dealers**: List of verified gold dealers
- **Contact Info**: Phone, location, hours
- **Ratings**: User ratings and reviews (future)

#### 10. User Profile
- **Account Settings**: Name, email, phone
- **Preferences**: Default currency, language, notifications
- **Alert Management**: Manage price alerts
- **Calculation History**: Past calculations

#### 11. Dark Mode
- **Theme Toggle**: Light/dark mode
- **System Default**: Follow device theme
- **Persist Preference**: Save in local storage

### Nice-to-Have Features (Future)

- **Widgets**: Home screen widgets for quick glance
- **Watch App**: Apple Watch companion app
- **Biometric Lock**: Face ID/Touch ID for app lock
- **Data Export**: Export price history to CSV/Excel
- **Social Sharing**: Share prices on social media
- **Portfolio Tracking**: Track personal gold/currency holdings
- **Price Predictions**: ML-based price forecasting
- **Community**: User forums and discussions

---

## 🛠 Technical Stack

### Core Framework
```json
{
  "framework": "React Native",
  "version": "0.76+",
  "typescript": "^5.0.0",
  "platform": "iOS 13+, Android 8+"
}
```

### Navigation
- **React Navigation v7**: Native stack navigation
- **Bottom Tabs**: Main navigation
- **Stack Navigation**: Nested screens
- **Deep Linking**: Support for web/notification links

### State Management
- **TanStack Query v5** (React Query): Server state, caching
- **Zustand v5**: Client state management (lightweight)
- **AsyncStorage**: Persistent local storage
- **MMKV** (optional): High-performance storage

### API & Networking
- **Axios**: HTTP client
- **TanStack Query**: Data fetching, caching, refetching
- **NetInfo**: Network status monitoring

### UI Component Library
- **React Native Paper v5**: Material Design components
- **React Native Elements** (alternative)
- **Custom Components**: Tailored to brand design

### Charts & Visualizations
- **Victory Native**: Chart library
- **React Native Chart Kit** (alternative)
- **React Native SVG**: Vector graphics

### Form Handling
- **React Hook Form**: Form state management
- **Zod**: Schema validation

### Styling
- **NativeWind** (Tailwind for React Native)
- **StyleSheet API**: Native styles
- **React Native Reanimated**: Animations
- **React Native Gesture Handler**: Touch interactions

### Localization
- **i18next**: Translation management
- **react-i18next**: React bindings
- **expo-localization**: Locale detection

### Push Notifications
- **Firebase Cloud Messaging (FCM)**: Android
- **Apple Push Notification (APN)**: iOS
- **React Native Firebase**: Unified interface
- **Notifee**: Local notifications

### Analytics & Monitoring
- **Firebase Analytics**: User behavior tracking
- **Crashlytics**: Crash reporting
- **Sentry** (optional): Error tracking

### Authentication
- **Firebase Auth**: Authentication service
- **React Native Biometrics**: Face ID/Touch ID
- **AsyncStorage**: Token storage

### Testing
- **Jest**: Unit testing
- **React Native Testing Library**: Component testing
- **Detox**: E2E testing
- **Maestro** (alternative): Mobile UI testing

### Development Tools
- **Expo** (optional): Development workflow
- **React Native Debugger**: Debugging
- **Flipper**: Mobile app debugger
- **EAS Build**: Cloud build service

### Performance
- **React Native Performance**: Monitoring
- **Hermes**: JavaScript engine
- **Code Splitting**: Lazy loading
- **Image Caching**: Fast Image

---

## 📁 Project Structure

```
odamak-mobile/
├── src/
│   ├── api/                          # API client and endpoints
│   │   ├── client.ts                 # Axios instance
│   │   ├── endpoints/
│   │   │   ├── gold.ts               # Gold API endpoints
│   │   │   ├── currency.ts           # Currency API endpoints
│   │   │   └── crypto.ts             # Crypto API endpoints
│   │   └── types.ts                  # API response types
│   │
│   ├── components/                   # Reusable components
│   │   ├── common/                   # Common UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── gold/                     # Gold-specific components
│   │   │   ├── GoldPriceCard.tsx
│   │   │   ├── GoldCalculator.tsx
│   │   │   └── KaratSelector.tsx
│   │   ├── currency/                 # Currency components
│   │   │   ├── CurrencyCard.tsx
│   │   │   ├── BankRateTable.tsx
│   │   │   ├── CurrencyConverter.tsx
│   │   │   └── RateComparisonChart.tsx
│   │   ├── crypto/                   # Crypto components
│   │   │   ├── CryptoPriceCard.tsx
│   │   │   └── CryptoStatsBar.tsx
│   │   ├── charts/                   # Chart components
│   │   │   ├── PriceChart.tsx
│   │   │   ├── ComparisonChart.tsx
│   │   │   └── SparklineChart.tsx
│   │   └── layout/                   # Layout components
│   │       ├── Header.tsx
│   │       ├── BottomTabBar.tsx
│   │       └── DrawerMenu.tsx
│   │
│   ├── screens/                      # Screen components
│   │   ├── home/
│   │   │   └── HomeScreen.tsx        # Main dashboard
│   │   ├── gold/
│   │   │   ├── GoldPricesScreen.tsx
│   │   │   ├── GoldCalculatorScreen.tsx
│   │   │   ├── ZakatCalculatorScreen.tsx
│   │   │   └── GoldDealersScreen.tsx
│   │   ├── currency/
│   │   │   ├── CurrencyRatesScreen.tsx
│   │   │   ├── CurrencyConverterScreen.tsx
│   │   │   ├── BankComparisonScreen.tsx
│   │   │   └── CurrencyChartsScreen.tsx
│   │   ├── crypto/
│   │   │   ├── CryptoPricesScreen.tsx
│   │   │   └── CryptoChartsScreen.tsx
│   │   ├── charts/
│   │   │   ├── PriceChartsScreen.tsx
│   │   │   └── ComparisonScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── AlertsScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   └── HistoryScreen.tsx
│   │   └── auth/
│   │       ├── LoginScreen.tsx
│   │       ├── RegisterScreen.tsx
│   │       └── ForgotPasswordScreen.tsx
│   │
│   ├── navigation/                   # Navigation configuration
│   │   ├── RootNavigator.tsx         # Root navigator
│   │   ├── MainTabNavigator.tsx      # Bottom tabs
│   │   ├── GoldStackNavigator.tsx    # Gold stack
│   │   ├── CurrencyStackNavigator.tsx
│   │   ├── CryptoStackNavigator.tsx
│   │   ├── ProfileStackNavigator.tsx
│   │   └── linking.ts                # Deep linking config
│   │
│   ├── hooks/                        # Custom hooks
│   │   ├── useGoldPrices.ts          # Gold data hooks
│   │   ├── useCurrencyRates.ts       # Currency hooks
│   │   ├── useCryptoPrices.ts        # Crypto hooks
│   │   ├── usePriceAlerts.ts         # Alert management
│   │   ├── useTheme.ts               # Theme hook
│   │   ├── useLocale.ts              # Language hook
│   │   └── useNetworkStatus.ts       # Network monitoring
│   │
│   ├── store/                        # State management
│   │   ├── authStore.ts              # Auth state (Zustand)
│   │   ├── themeStore.ts             # Theme state
│   │   ├── alertStore.ts             # Alerts state
│   │   └── settingsStore.ts          # App settings
│   │
│   ├── utils/                        # Utility functions
│   │   ├── format.ts                 # Formatting utilities
│   │   ├── validation.ts             # Validation helpers
│   │   ├── storage.ts                # Storage helpers
│   │   ├── constants.ts              # App constants
│   │   ├── permissions.ts            # Permission helpers
│   │   └── analytics.ts              # Analytics helpers
│   │
│   ├── services/                     # Business logic services
│   │   ├── notificationService.ts    # Push notifications
│   │   ├── alertService.ts           # Price alert logic
│   │   ├── analyticsService.ts       # Analytics tracking
│   │   ├── authService.ts            # Authentication
│   │   └── storageService.ts         # Data persistence
│   │
│   ├── types/                        # TypeScript types
│   │   ├── gold.ts                   # Gold types
│   │   ├── currency.ts               # Currency types
│   │   ├── crypto.ts                 # Crypto types
│   │   ├── alert.ts                  # Alert types
│   │   ├── navigation.ts             # Navigation types
│   │   └── index.ts                  # Type exports
│   │
│   ├── config/                       # Configuration
│   │   ├── api.ts                    # API configuration
│   │   ├── firebase.ts               # Firebase config
│   │   ├── theme.ts                  # Theme configuration
│   │   └── i18n.ts                   # i18n configuration
│   │
│   ├── locales/                      # Translation files
│   │   ├── ar/
│   │   │   ├── common.json
│   │   │   ├── gold.json
│   │   │   ├── currency.json
│   │   │   └── crypto.json
│   │   └── en/
│   │       ├── common.json
│   │       ├── gold.json
│   │       ├── currency.json
│   │       └── crypto.json
│   │
│   ├── assets/                       # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── lottie/                   # Lottie animations
│   │
│   └── App.tsx                       # Root component
│
├── android/                          # Android native code
├── ios/                              # iOS native code
│
├── __tests__/                        # Test files
│   ├── components/
│   ├── screens/
│   ├── hooks/
│   └── utils/
│
├── .env.development                  # Dev environment vars
├── .env.production                   # Prod environment vars
├── .eslintrc.js                      # ESLint config
├── .prettierrc                       # Prettier config
├── tsconfig.json                     # TypeScript config
├── jest.config.js                    # Jest config
├── babel.config.js                   # Babel config
├── metro.config.js                   # Metro bundler config
├── app.json                          # App configuration
├── package.json                      # Dependencies
└── README.md                         # Project documentation
```

---

## 🎨 UI/UX Design Guidelines

### Design Principles

1. **Arabic-First Design**: RTL layout as primary design
2. **Information Density**: Balance data richness with clarity
3. **Visual Hierarchy**: Clear prioritization of important data
4. **Touch-Friendly**: Large touch targets (44x44pt minimum)
5. **Accessibility**: WCAG 2.1 AA compliance
6. **Performance**: Smooth 60fps animations
7. **Consistency**: Unified design language across screens

### Color Palette

```javascript
// Light Mode
const lightTheme = {
  primary: '#D4AF37',        // Gold
  primaryDark: '#B8941E',    // Dark gold
  primaryLight: '#F0E68C',   // Light gold

  success: '#10B981',        // Green (price up)
  error: '#EF4444',          // Red (price down)
  warning: '#F59E0B',        // Orange
  info: '#3B82F6',           // Blue

  background: '#FFFFFF',     // White
  surface: '#F9FAFB',        // Light gray
  surfaceVariant: '#F3F4F6', // Lighter gray

  text: '#111827',           // Dark gray
  textSecondary: '#6B7280',  // Medium gray
  textDisabled: '#9CA3AF',   // Light gray

  border: '#E5E7EB',         // Border gray
  divider: '#F3F4F6',        // Divider gray
};

// Dark Mode
const darkTheme = {
  primary: '#FFD700',        // Bright gold
  primaryDark: '#D4AF37',    // Medium gold
  primaryLight: '#FFF8DC',   // Cream

  success: '#34D399',        // Light green
  error: '#F87171',          // Light red
  warning: '#FBBF24',        // Light orange
  info: '#60A5FA',           // Light blue

  background: '#111827',     // Dark gray
  surface: '#1F2937',        // Medium dark gray
  surfaceVariant: '#374151', // Lighter dark gray

  text: '#F9FAFB',           // White
  textSecondary: '#D1D5DB',  // Light gray
  textDisabled: '#9CA3AF',   // Medium gray

  border: '#374151',         // Border dark gray
  divider: '#1F2937',        // Divider dark gray
};
```

### Typography

```javascript
// Font Families
const fonts = {
  primary: 'Cairo',          // Arabic/Latin
  secondary: 'Roboto',       // Latin fallback
  monospace: 'Courier New',  // Numbers
};

// Font Sizes (React Native uses pt, not rem)
const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// Font Weights
const fontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};
```

### Spacing Scale

```javascript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};
```

### Component Specifications

#### Price Card
```
┌────────────────────────────────────┐
│  24K Gold                    ↑     │ <- Header
│  سعر الذهب عيار 24                 │
├────────────────────────────────────┤
│  EGP 4,520.00                      │ <- Price (large)
│  +25.50 (+0.57%)                   │ <- Change (colored)
│  Last updated: 2 min ago           │ <- Timestamp
└────────────────────────────────────┘

Height: 120pt
Padding: 16pt
Border Radius: 12pt
Shadow: elevation 2
```

#### Bank Rate Row
```
┌────────────────────────────────────┐
│ [Logo] National Bank of Egypt  ⭐  │ <- Bank name + pin
│        البنك الأهلي المصري         │
│        Buy: 50.25  Sell: 50.75     │ <- Rates
│        [Chart miniature]           │ <- Trend
└────────────────────────────────────┘

Height: 80pt
```

#### Calculator Input
```
┌────────────────────────────────────┐
│  Weight (grams)                    │ <- Label
│  ┌──────────────────────────────┐  │
│  │ 100                          │  │ <- Input
│  └──────────────────────────────┘  │
│                                    │
│  Karat                             │
│  ┌──────────────────────────────┐  │
│  │ 21K ▼                        │  │ <- Dropdown
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Calculate                    │  │ <- Button
│  └──────────────────────────────┘  │
│                                    │
│  Result: EGP 9,450.00              │ <- Result
└────────────────────────────────────┘
```

### Screen Layouts

#### Home Screen Layout
```
┌────────────────────────────────────┐
│  [Header: Logo, Notifications]     │ <- 60pt height
├────────────────────────────────────┤
│  Scroll View:                      │
│  ┌──────────────────────────────┐  │
│  │ Market Pulse Banner          │  │ <- Hero section
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 24K Gold   21K Gold   18K    │  │ <- Gold prices
│  │ [Card]     [Card]     [Card] │  │    (horizontal scroll)
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ Currencies                   │  │ <- Currency section
│  │ USD [Card]  EUR [Card]       │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ Quick Calculator             │  │ <- Calculator widget
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ Crypto Market                │  │ <- Crypto section
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
│  [Bottom Tab Bar]                  │ <- 60pt height
└────────────────────────────────────┘
```

### Animations & Transitions

#### Pull-to-Refresh
- **Duration**: 300ms
- **Easing**: ease-out
- **Indicator**: Spinning gold icon

#### Card Entrance
- **Type**: Fade + slide up
- **Duration**: 200ms
- **Stagger**: 50ms between cards

#### Price Update
- **Type**: Flash + scale
- **Duration**: 400ms
- **Color**: Green (up) / Red (down)

#### Screen Transitions
- **Type**: Slide from right (RTL: left)
- **Duration**: 300ms
- **Easing**: ease-in-out

### Accessibility Requirements

1. **VoiceOver/TalkBack Support**
   - All interactive elements labeled
   - Proper heading hierarchy
   - Announcement of price changes

2. **Text Scaling**
   - Support 200% text scaling
   - Flexible layouts

3. **Color Contrast**
   - WCAG AA: 4.5:1 for normal text
   - WCAG AA: 3:1 for large text

4. **Touch Targets**
   - Minimum 44x44pt
   - Adequate spacing between targets

5. **Keyboard Navigation** (iOS/Android external keyboards)
   - Tab order logical
   - Focus indicators visible

---

## 🔌 API Integration

### API Configuration

**Base URL**: `http://api.odamak.test/api` (development)
**Production URL**: `https://api.odamak.com` (to be configured)

### Authentication Headers

```javascript
const headers = {
  'Accept': 'application/json',
  'Accept-Language': 'ar', // or 'en'
  'Authorization': 'Bearer {token}', // if authenticated
  'Content-Type': 'application/json',
};
```

### API Endpoints Reference

#### Gold Endpoints

| Endpoint | Method | Description | Response Type |
|----------|--------|-------------|---------------|
| `/gold/get-overview` | GET | All gold karats (home page) | `GoldOverviewResponse` |
| `/gold/get-all-prices` | GET | All gold prices with filters | `GoldPricesResponse` |
| `/gold/calculate` | GET | Calculate gold value | `GoldCalculationResponse` |

**Query Parameters:**
- `currency`: `EGP` (default), `USD`
- `period`: `24h`, `7d`, `30d`, `90d`, `1y`
- `grams`: number (for calculate)
- `karat`: `24k`, `21k`, `18k`

#### Currency Endpoints

| Endpoint | Method | Description | Response Type |
|----------|--------|-------------|---------------|
| `/currency/highest-buy-price` | GET | Best buy rate | `HighestBuyPriceResponse` |
| `/currency/highest-sell-price` | GET | Best sell rate | `HighestSellPriceResponse` |
| `/currency/averages` | GET | Bank & parallel averages | `CurrencyAveragesResponse` |
| `/currency/banks` | GET | All bank rates with charts | `CurrencyBanksResponse` |

**Query Parameters:**
- `from_currency`: `USD`, `EUR`, `GBP`, etc.
- `to_currency`: `EGP` (usually)
- `period`: `7d`, `30d`, `90d`

#### Cryptocurrency Endpoints

| Endpoint | Method | Description | Response Type |
|----------|--------|-------------|---------------|
| `/crypto/prices` | GET | All crypto prices | `CryptoPricesResponse` |
| `/crypto/market-stats` | GET | Market statistics | `CryptoMarketStatsResponse` |

**Query Parameters:**
- `symbols`: comma-separated (e.g., `BTC,ETH,USDT`)

### API Response Types

```typescript
// Gold Overview Response
interface GoldOverviewResponse {
  success: boolean;
  data: {
    gold_24k: GoldPrice;
    gold_21k: GoldPrice;
    gold_18k: GoldPrice;
    gold_pound: GoldPrice;
    gold_ounce: GoldPrice;
    last_updated: string;
  };
}

interface GoldPrice {
  buy: number;
  sell: number;
  change_24h: number;
  change_percent_24h: number;
  chart_data?: ChartDataPoint[];
}

// Currency Banks Response
interface CurrencyBanksResponse {
  success: boolean;
  data: {
    banks: Bank[];
    parallel_market: ParallelMarket;
    best_buy: BestRate;
    best_sell: BestRate;
    last_updated: string;
  };
}

interface Bank {
  id: string;
  name: string;
  name_ar: string;
  logo_url: string;
  buy_price: number;
  sell_price: number;
  spread: number;
  chart_data?: ChartDataPoint[];
}

// Crypto Prices Response
interface CryptoPricesResponse {
  success: boolean;
  data: {
    coins: CryptoCoin[];
    market_stats: MarketStats;
    last_updated: string;
  };
}

interface CryptoCoin {
  symbol: string;
  name: string;
  price_usd: number;
  change_24h: number;
  change_percent_24h: number;
  volume_24h: number;
  market_cap: number;
}

// Chart Data Point
interface ChartDataPoint {
  timestamp: string; // ISO 8601
  value: number;
}
```

### API Client Implementation

```typescript
// src/api/client.ts
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Accept-Language': 'ar',
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (error handling)
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (logout)
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### TanStack Query Configuration

```typescript
// src/config/reactQuery.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,        // 30 seconds
      gcTime: 300000,          // 5 minutes (formerly cacheTime)
      refetchInterval: 60000,  // Auto-refetch every 60s
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### Custom Hooks Example

```typescript
// src/hooks/useGoldPrices.ts
import { useQuery } from '@tanstack/react-query';
import { fetchGoldOverview } from '@/api/endpoints/gold';

export function useGoldOverview() {
  return useQuery({
    queryKey: ['gold', 'overview'],
    queryFn: fetchGoldOverview,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useGoldCalculator(grams: number, karat: string, enabled: boolean) {
  return useQuery({
    queryKey: ['gold', 'calculate', grams, karat],
    queryFn: () => calculateGold(grams, karat),
    enabled: enabled && grams > 0,
    staleTime: 30000,
  });
}
```

### Error Handling

```typescript
// src/components/common/ApiError.tsx
export function ApiError({ error, onRetry }: Props) {
  const errorMessage = getErrorMessage(error);

  return (
    <View style={styles.container}>
      <Icon name="alert-circle" size={48} color="#EF4444" />
      <Text style={styles.message}>{errorMessage}</Text>
      <Button onPress={onRetry}>إعادة المحاولة</Button>
    </View>
  );
}

function getErrorMessage(error: any): string {
  if (error.response?.status === 404) {
    return 'البيانات غير متوفرة';
  }
  if (error.response?.status >= 500) {
    return 'خطأ في الخادم. حاول مرة أخرى';
  }
  if (error.message === 'Network Error') {
    return 'لا يوجد اتصال بالإنترنت';
  }
  return 'حدث خطأ. حاول مرة أخرى';
}
```

---

## 📱 Mobile-Specific Features

### 1. Push Notifications

#### Notification Types
- **Price Alerts**: When user-set price thresholds are reached
- **Daily Summary**: Morning market summary
- **Breaking News**: Significant market movements
- **Promotional**: New features, updates (opt-in)

#### Notification Structure
```json
{
  "title": "تنبيه سعر الذهب",
  "body": "وصل سعر الذهب عيار 21 إلى 4,200 جنيه",
  "data": {
    "type": "price_alert",
    "asset": "gold_21k",
    "price": 4200,
    "screen": "GoldPricesScreen"
  }
}
```

#### Implementation
```typescript
// src/services/notificationService.ts
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

export async function requestNotificationPermission() {
  const authStatus = await messaging().requestPermission();
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
}

export async function displayLocalNotification(notification: Notification) {
  await notifee.displayNotification({
    title: notification.title,
    body: notification.body,
    android: {
      channelId: 'price-alerts',
      smallIcon: 'ic_notification',
      color: '#D4AF37',
    },
    ios: {
      sound: 'default',
    },
  });
}
```

### 2. Offline Support

#### Cached Data
- Last fetched gold prices
- Last fetched currency rates
- User settings and preferences
- Calculation history
- Favorite banks

#### Implementation Strategy
```typescript
// src/services/storageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function cacheGoldPrices(data: GoldOverviewResponse) {
  await AsyncStorage.setItem('cached_gold_prices', JSON.stringify(data));
  await AsyncStorage.setItem('cached_gold_prices_timestamp', Date.now().toString());
}

export async function getCachedGoldPrices(): Promise<GoldOverviewResponse | null> {
  const cached = await AsyncStorage.getItem('cached_gold_prices');
  if (!cached) return null;

  const timestamp = await AsyncStorage.getItem('cached_gold_prices_timestamp');
  const age = Date.now() - parseInt(timestamp || '0');

  // Cache valid for 10 minutes
  if (age > 600000) return null;

  return JSON.parse(cached);
}
```

#### Offline Indicator
```typescript
// src/hooks/useNetworkStatus.ts
import NetInfo from '@react-native-community/netinfo';
import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  return { isOnline };
}
```

### 3. Biometric Authentication

#### Use Cases
- Lock app on launch (optional)
- Confirm sensitive actions (large transactions)
- Secure access to profile/settings

#### Implementation
```typescript
// src/services/biometricsService.ts
import ReactNativeBiometrics from 'react-native-biometrics';

export async function authenticateWithBiometrics(): Promise<boolean> {
  const rnBiometrics = new ReactNativeBiometrics();

  const { available, biometryType } = await rnBiometrics.isSensorAvailable();

  if (!available) {
    return false;
  }

  const { success } = await rnBiometrics.simplePrompt({
    promptMessage: 'قم بتأكيد هويتك',
  });

  return success;
}
```

### 4. Home Screen Widgets (Future)

#### iOS Widget
- Today's gold prices (24k, 21k, 18k)
- Small, Medium, Large sizes
- Tappable to open app

#### Android Widget
- Gold prices + USD/EUR rates
- Resizable widget
- Auto-refresh

### 5. Share Functionality

#### Shareable Content
- Current gold prices (as image)
- Calculation results
- Charts (as image)

#### Implementation
```typescript
// src/utils/share.ts
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';

export async function shareGoldPrices(componentRef: any) {
  const uri = await ViewShot.captureRef(componentRef, {
    format: 'png',
    quality: 0.8,
  });

  await Share.open({
    url: uri,
    message: 'أسعار الذهب اليوم من تطبيق مرصادنا',
  });
}
```

### 6. App Rating Prompt

#### Trigger Conditions
- After 10 successful app launches
- After using calculator 5 times
- After 7 days of usage

#### Implementation
```typescript
// src/services/ratingService.ts
import Rate from 'react-native-rate';

export async function promptForRating() {
  const launches = await getAppLaunchCount();

  if (launches === 10) {
    Rate.rate({
      AppleAppID: '1234567890',
      GooglePackageName: 'com.odamak.gold',
      preferInApp: true,
    });
  }
}
```

---

## 🗂 State Management

### Architecture Overview

```
┌─────────────────────────────────────┐
│     TanStack Query (Server State)   │ <- API data, caching
├─────────────────────────────────────┤
│     Zustand (Client State)          │ <- UI state, settings
├─────────────────────────────────────┤
│     AsyncStorage (Persistence)      │ <- Long-term storage
└─────────────────────────────────────┘
```

### Server State (TanStack Query)

**Managed by TanStack Query:**
- Gold prices
- Currency rates
- Crypto prices
- Bank rates
- Historical charts
- User alerts (from server)

### Client State (Zustand)

```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const response = await loginApi(email, password);
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

```typescript
// src/store/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  mode: 'light' | 'dark' | 'auto';
  setTheme: (mode: 'light' | 'dark' | 'auto') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'auto',
      setTheme: (mode) => set({ mode }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
```

```typescript
// src/store/settingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  language: 'ar' | 'en';
  currency: 'EGP' | 'USD';
  notifications: {
    priceAlerts: boolean;
    dailySummary: boolean;
    news: boolean;
  };
  pinnedBanks: string[];
  setLanguage: (lang: 'ar' | 'en') => void;
  setCurrency: (currency: 'EGP' | 'USD') => void;
  toggleNotification: (type: string) => void;
  togglePinnedBank: (bankId: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'ar',
      currency: 'EGP',
      notifications: {
        priceAlerts: true,
        dailySummary: true,
        news: false,
      },
      pinnedBanks: [],

      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),

      toggleNotification: (type) => set((state) => ({
        notifications: {
          ...state.notifications,
          [type]: !state.notifications[type],
        },
      })),

      togglePinnedBank: (bankId) => set((state) => {
        const pinned = state.pinnedBanks.includes(bankId)
          ? state.pinnedBanks.filter(id => id !== bankId)
          : [...state.pinnedBanks, bankId];
        return { pinnedBanks: pinned };
      }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
```

---

## 🧭 Navigation Structure

### Navigation Hierarchy

```
RootNavigator (Stack)
├─ MainTabNavigator (Bottom Tabs)
│  ├─ HomeTab
│  │  └─ HomeScreen
│  ├─ GoldTab (Stack)
│  │  ├─ GoldPricesScreen
│  │  ├─ GoldCalculatorScreen
│  │  ├─ ZakatCalculatorScreen
│  │  └─ GoldDealersScreen
│  ├─ CurrencyTab (Stack)
│  │  ├─ CurrencyRatesScreen
│  │  ├─ CurrencyConverterScreen
│  │  ├─ BankComparisonScreen
│  │  └─ CurrencyChartsScreen
│  ├─ CryptoTab (Stack)
│  │  ├─ CryptoPricesScreen
│  │  └─ CryptoChartsScreen
│  └─ ProfileTab (Stack)
│     ├─ ProfileScreen
│     ├─ AlertsScreen
│     ├─ SettingsScreen
│     └─ HistoryScreen
└─ AuthModal (Modal)
   ├─ LoginScreen
   ├─ RegisterScreen
   └─ ForgotPasswordScreen
```

### Bottom Tab Configuration

```typescript
// src/navigation/MainTabNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Gold"
        component={GoldStackNavigator}
        options={{
          title: 'الذهب',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="diamond" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Currency"
        component={CurrencyStackNavigator}
        options={{
          title: 'العملات',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Crypto"
        component={CryptoStackNavigator}
        options={{
          title: 'الكريبتو',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="logo-bitcoin" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          title: 'حسابي',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

### Deep Linking

```typescript
// src/navigation/linking.ts
export const linking = {
  prefixes: ['odamak://', 'https://odamak.com'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: 'home',
          Gold: {
            screens: {
              GoldPricesScreen: 'gold',
              GoldCalculatorScreen: 'gold/calculator',
              ZakatCalculatorScreen: 'gold/zakat',
            },
          },
          Currency: {
            screens: {
              CurrencyRatesScreen: 'currency',
              CurrencyConverterScreen: 'currency/converter',
              BankComparisonScreen: 'currency/banks',
            },
          },
          Crypto: {
            screens: {
              CryptoPricesScreen: 'crypto',
            },
          },
          Profile: {
            screens: {
              ProfileScreen: 'profile',
              AlertsScreen: 'profile/alerts',
              SettingsScreen: 'profile/settings',
            },
          },
        },
      },
      Auth: {
        screens: {
          LoginScreen: 'login',
          RegisterScreen: 'register',
        },
      },
    },
  },
};
```

---

## 📊 Data Flow Architecture

### Data Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Screen    │────>│    Hook     │────>│  API Client │
│ (Component) │     │ (useQuery)  │     │  (Axios)    │
└─────────────┘     └─────────────┘     └─────────────┘
      ↑                    ↑                    │
      │                    │                    ↓
      │                    │              ┌─────────────┐
      │                    └──────────────│   Server    │
      │                                   │  (Backend)  │
      │                                   └─────────────┘
      │                    ┌─────────────┐
      └────────────────────│ Query Cache │
                           │  (TanStack) │
                           └─────────────┘
```

### Data Fetching Flow

1. **Screen renders** → Calls custom hook
2. **Hook calls useQuery** → Checks cache
3. **If cached & fresh** → Return cached data
4. **If stale** → Return cached + fetch new
5. **If no cache** → Show loading + fetch
6. **API response** → Update cache
7. **Screen re-renders** → Show new data

### Example Flow

```typescript
// 1. Screen Component
function GoldPricesScreen() {
  const { data, isLoading, error, refetch } = useGoldOverview();

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ApiError error={error} onRetry={refetch} />;

  return <GoldPriceList data={data} />;
}

// 2. Custom Hook
function useGoldOverview() {
  return useQuery({
    queryKey: ['gold', 'overview'],
    queryFn: fetchGoldOverview,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

// 3. API Function
async function fetchGoldOverview(): Promise<GoldOverviewResponse> {
  const response = await apiClient.get('/gold/get-overview');
  return response.data;
}

// 4. Query Cache
// Managed automatically by TanStack Query
// - Stores data under queryKey ['gold', 'overview']
// - Invalidates after 30s (staleTime)
// - Auto-refetches every 60s
```

---

## ⚡ Performance Requirements

### Performance Targets

| Metric | Target | Critical Threshold |
|--------|--------|--------------------|
| App Launch Time | <2s | <3s |
| Screen Transition | <300ms | <500ms |
| API Response | <1s | <2s |
| Frame Rate | 60fps | 30fps |
| Memory Usage | <150MB | <200MB |
| App Size | <50MB | <80MB |
| Crash-Free Rate | >99.5% | >99% |

### Optimization Strategies

#### 1. Code Splitting & Lazy Loading
```typescript
// Lazy load screens
const GoldCalculatorScreen = React.lazy(() => import('./screens/gold/GoldCalculatorScreen'));
```

#### 2. Image Optimization
```typescript
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: bank.logo_url }}
  style={styles.logo}
  resizeMode={FastImage.resizeMode.contain}
/>
```

#### 3. List Virtualization
```typescript
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={banks}
  renderItem={({ item }) => <BankCard bank={item} />}
  estimatedItemSize={80}
/>
```

#### 4. Memoization
```typescript
const GoldPriceCard = React.memo(({ price }) => {
  // Component logic
}, (prevProps, nextProps) => {
  return prevProps.price === nextProps.price;
});
```

#### 5. Debouncing User Input
```typescript
import { useDebouncedCallback } from 'use-debounce';

const handleSearch = useDebouncedCallback((text) => {
  // Search logic
}, 300);
```

---

## 🔐 Security Requirements

### Data Security

1. **Authentication Token Storage**
   - Store in secure storage (Keychain/Keystore)
   - Never in AsyncStorage for sensitive tokens
   - Use `react-native-keychain`

2. **API Communication**
   - HTTPS only
   - Certificate pinning (optional)
   - Request signing (if required)

3. **Sensitive Data**
   - Never log sensitive data
   - Mask prices in screenshots (optional)
   - Secure TextInput for passwords

### Code Security

1. **Code Obfuscation**
   - ProGuard (Android)
   - Strip symbols (iOS)

2. **API Keys**
   - Use environment variables
   - Never commit to version control
   - Use `.env` files

3. **Jailbreak/Root Detection**
   - Detect jailbroken/rooted devices
   - Show warning (don't block)

### User Privacy

1. **Permissions**
   - Request only necessary permissions
   - Explain why permissions are needed
   - Graceful degradation if denied

2. **Analytics**
   - Anonymize user data
   - GDPR compliance
   - Opt-out option

3. **Data Retention**
   - Clear cache on logout
   - Delete user data on account deletion

---

## 💾 Offline Capabilities

### Offline Features

#### What Works Offline
- View last cached prices (gold, currency, crypto)
- Use calculators (with cached prices)
- View calculation history
- Browse pinned banks
- View settings

#### What Requires Online
- Fetch new prices
- Update historical charts
- Create/manage alerts
- Authentication
- Push notifications

### Caching Strategy

```typescript
// Cache keys and TTL
const CACHE_CONFIG = {
  gold_prices: {
    key: 'cached_gold_prices',
    ttl: 600000, // 10 minutes
  },
  currency_rates: {
    key: 'cached_currency_rates',
    ttl: 600000,
  },
  crypto_prices: {
    key: 'cached_crypto_prices',
    ttl: 300000, // 5 minutes
  },
};

// Fallback to cache if offline
async function fetchWithOfflineSupport<T>(
  fetchFn: () => Promise<T>,
  cacheKey: string,
  ttl: number
): Promise<T> {
  try {
    const data = await fetchFn();
    await cacheData(cacheKey, data, ttl);
    return data;
  } catch (error) {
    const cached = await getCachedData<T>(cacheKey);
    if (cached) {
      return cached;
    }
    throw error;
  }
}
```

### Offline Indicator

```typescript
// Show banner when offline
function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <View style={styles.offlineBanner}>
      <Icon name="wifi-off" />
      <Text>لا يوجد اتصال بالإنترنت. يتم عرض البيانات المحفوظة.</Text>
    </View>
  );
}
```

---

## 🔔 Push Notifications

### Notification Channels (Android)

```typescript
// src/config/notifications.ts
export const NOTIFICATION_CHANNELS = [
  {
    id: 'price-alerts',
    name: 'تنبيهات الأسعار',
    description: 'إشعارات عند وصول الأسعار للحد المطلوب',
    importance: 4, // High
  },
  {
    id: 'daily-summary',
    name: 'الملخص اليومي',
    description: 'ملخص الأسعار الصباحي',
    importance: 3, // Medium
  },
  {
    id: 'news',
    name: 'الأخبار',
    description: 'أخبار السوق العاجلة',
    importance: 3,
  },
];
```

### Notification Handling

```typescript
// src/services/notificationService.ts
import messaging from '@react-native-firebase/messaging';
import { navigate } from '@/navigation/RootNavigator';

// Background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Background message:', remoteMessage);

  // Process notification
  await processNotification(remoteMessage);
});

// Foreground handler
export function setupForegroundNotifications() {
  return messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground message:', remoteMessage);

    // Display local notification
    await displayLocalNotification(remoteMessage);
  });
}

// Notification press handler
export function setupNotificationPressHandler() {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    handleNotificationPress(remoteMessage);
  });

  // Check if app opened from notification
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        handleNotificationPress(remoteMessage);
      }
    });
}

function handleNotificationPress(notification: any) {
  const { data } = notification;

  if (data.type === 'price_alert' && data.screen) {
    navigate(data.screen, { asset: data.asset });
  }
}
```

### User Notification Preferences

```typescript
// Settings Screen
function NotificationSettings() {
  const { notifications, toggleNotification } = useSettingsStore();

  return (
    <View>
      <Switch
        value={notifications.priceAlerts}
        onValueChange={() => toggleNotification('priceAlerts')}
        label="تنبيهات الأسعار"
      />
      <Switch
        value={notifications.dailySummary}
        onValueChange={() => toggleNotification('dailySummary')}
        label="الملخص اليومي"
      />
      <Switch
        value={notifications.news}
        onValueChange={() => toggleNotification('news')}
        label="الأخبار"
      />
    </View>
  );
}
```

---

## 🌐 Localization

### Supported Languages
- **Arabic (ar)**: Primary language, RTL layout
- **English (en)**: Secondary language, LTR layout

### i18n Configuration

```typescript
// src/config/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import ar from '@/locales/ar';
import en from '@/locales/en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: Localization.locale.startsWith('ar') ? 'ar' : 'en',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

### Translation Files Structure

```json
// src/locales/ar/common.json
{
  "app_name": "مرصادنا",
  "loading": "جاري التحميل...",
  "error": "حدث خطأ",
  "retry": "إعادة المحاولة",
  "save": "حفظ",
  "cancel": "إلغاء",
  "search": "بحث",
  "filter": "تصفية"
}

// src/locales/ar/gold.json
{
  "title": "أسعار الذهب",
  "karat_24": "عيار 24",
  "karat_21": "عيار 21",
  "karat_18": "عيار 18",
  "gold_pound": "جنيه ذهب",
  "gold_ounce": "أونصة ذهب",
  "calculator": {
    "title": "حاسبة الذهب",
    "weight": "الوزن (جرام)",
    "karat": "العيار",
    "result": "النتيجة"
  }
}
```

### Usage in Components

```typescript
import { useTranslation } from 'react-i18next';

function GoldPricesScreen() {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('gold.title')}</Text>
      <Text>{t('gold.karat_24')}</Text>
    </View>
  );
}
```

### RTL Support

```typescript
// src/utils/rtl.ts
import { I18nManager } from 'react-native';

export function setupRTL(language: string) {
  const isRTL = language === 'ar';

  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
    // Requires app restart on Android
  }
}
```

---

## 🧪 Testing Strategy

### Testing Levels

#### 1. Unit Tests (Jest)
- Utility functions
- Data formatters
- Validation logic
- Store actions

```typescript
// __tests__/utils/format.test.ts
import { formatPrice, formatPercentage } from '@/utils/format';

describe('formatPrice', () => {
  it('formats price with currency', () => {
    expect(formatPrice(4500.5, 'EGP')).toBe('4,500.50 جنيه');
  });

  it('handles zero', () => {
    expect(formatPrice(0, 'EGP')).toBe('0.00 جنيه');
  });
});
```

#### 2. Component Tests (React Native Testing Library)
- Component rendering
- User interactions
- Conditional rendering

```typescript
// __tests__/components/GoldPriceCard.test.tsx
import { render, screen } from '@testing-library/react-native';
import { GoldPriceCard } from '@/components/gold/GoldPriceCard';

describe('GoldPriceCard', () => {
  it('renders price correctly', () => {
    const price = { buy: 4500, sell: 4550, change_24h: 25 };
    render(<GoldPriceCard price={price} karat="24k" />);

    expect(screen.getByText('4,500.00')).toBeTruthy();
    expect(screen.getByText('+25.00')).toBeTruthy();
  });
});
```

#### 3. Integration Tests
- API integration
- Navigation flows
- Data fetching

```typescript
// __tests__/integration/goldFlow.test.tsx
import { renderWithProviders } from '@/test-utils';
import { GoldPricesScreen } from '@/screens/gold/GoldPricesScreen';

describe('Gold Prices Flow', () => {
  it('fetches and displays gold prices', async () => {
    const { findByText } = renderWithProviders(<GoldPricesScreen />);

    // Wait for data to load
    expect(await findByText('عيار 24')).toBeTruthy();
  });
});
```

#### 4. E2E Tests (Detox/Maestro)
- Critical user journeys
- Cross-screen flows
- Real device testing

```yaml
# maestro/gold-calculator.yaml
appId: com.odamak.gold
---
- launchApp
- tapOn: "حاسبة الذهب"
- inputText: "100"
- tapOn: "عيار 21"
- tapOn: "احسب"
- assertVisible: "النتيجة: 9,450.00 جنيه"
```

### Testing Coverage Goals
- **Unit Tests**: 80%+ coverage
- **Component Tests**: 70%+ coverage
- **Integration Tests**: Critical flows covered
- **E2E Tests**: 5-10 critical user journeys

---

## 🚀 Deployment

### Build Configuration

#### iOS Build
```bash
# Development build
npx react-native run-ios

# Release build
cd ios
pod install
xcodebuild -workspace Odamak.xcworkspace \
  -scheme Odamak \
  -configuration Release \
  -archivePath build/Odamak.xcarchive \
  archive
```

#### Android Build
```bash
# Development build
npx react-native run-android

# Release build (AAB for Play Store)
cd android
./gradlew bundleRelease

# Release build (APK)
./gradlew assembleRelease
```

### Environment Configuration

```bash
# .env.development
API_BASE_URL=http://api.odamak.test/api
ENVIRONMENT=development
FIREBASE_APP_ID=xxx
SENTRY_DSN=xxx

# .env.production
API_BASE_URL=https://api.odamak.com
ENVIRONMENT=production
FIREBASE_APP_ID=xxx
SENTRY_DSN=xxx
```

### App Store Requirements

#### iOS (App Store)
- **Bundle ID**: `com.odamak.gold`
- **Min iOS Version**: 13.0
- **App Icons**: 1024x1024 (all sizes generated)
- **Screenshots**: Required sizes for iPhone/iPad
- **Privacy Policy**: Required URL
- **App Description**: Arabic & English

#### Android (Play Store)
- **Package Name**: `com.odamak.gold`
- **Min SDK**: 26 (Android 8.0)
- **Target SDK**: 34 (Android 14)
- **App Icons**: Adaptive icons
- **Screenshots**: Required sizes
- **Privacy Policy**: Required URL
- **Content Rating**: Everyone

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/build-ios.yml
name: Build iOS
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: cd ios && pod install
      - run: npx react-native build-ios
```

### Release Checklist

- [ ] Update version number (package.json, iOS, Android)
- [ ] Update CHANGELOG.md
- [ ] Run all tests
- [ ] Test on physical devices (iOS & Android)
- [ ] Update screenshots
- [ ] Update app descriptions
- [ ] Build release bundles (AAB/IPA)
- [ ] Submit to stores
- [ ] Monitor crash reports
- [ ] Monitor user feedback

---

## 📝 Phase 1 MVP Scope

### MVP Features (4-6 weeks)

#### Week 1-2: Foundation
- [ ] Project setup (React Native, TypeScript, navigation)
- [ ] API client implementation
- [ ] Authentication screens (login/register)
- [ ] Main navigation (bottom tabs)
- [ ] Home screen layout
- [ ] Theme system (light/dark)
- [ ] i18n setup (Arabic/English)

#### Week 3-4: Core Features
- [ ] Gold prices screen
- [ ] Currency rates screen
- [ ] Crypto prices screen
- [ ] Gold calculator
- [ ] Currency converter
- [ ] Pull-to-refresh
- [ ] Loading states
- [ ] Error handling

#### Week 5: Charts & Details
- [ ] Price charts (gold, currency)
- [ ] Bank comparison screen
- [ ] Historical data views
- [ ] Sparkline charts

#### Week 6: Polish & Testing
- [ ] Offline caching
- [ ] Push notification setup
- [ ] User settings screen
- [ ] App icons & splash screen
- [ ] Testing (unit, integration)
- [ ] Bug fixes
- [ ] Performance optimization

### MVP Out of Scope (Post-Launch)
- Price alerts management
- Biometric authentication
- Widgets
- Social sharing
- Advanced analytics
- Zakat calculator
- Dealers directory
- User portfolio tracking

---

## 🔮 Future Enhancements

### Phase 2 (Post-MVP)
- Price alert creation and management
- Biometric authentication (Face ID/Touch ID)
- Calculation history
- Favorite banks persistence
- App rating prompt
- In-app feedback form

### Phase 3 (6 months+)
- Home screen widgets (iOS/Android)
- Apple Watch app
- Zakat calculator
- Gold dealers directory
- Social sharing (charts, prices)
- Advanced charting (technical indicators)
- Comparison mode (multiple assets)

### Phase 4 (1 year+)
- User portfolio tracking
- Price predictions (AI/ML)
- News feed integration
- Community features (forums, discussions)
- Premium subscription tier
- Data export (CSV/Excel)
- Web dashboard sync
- WhatsApp/Telegram bot integration

---

## 📚 Documentation & Resources

### Developer Documentation
- [React Native Docs](https://reactnative.dev/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Navigation Docs](https://reactnavigation.org/)
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)

### Design Resources
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Material Design Icons](https://materialdesignicons.com/)
- [Lottie Animations](https://lottiefiles.com/)

### API Documentation
- Refer to existing `API_INTEGRATION.md` from web project
- Endpoint reference: `API_ENDPOINTS.md`

### Code Quality Tools
- ESLint configuration
- Prettier configuration
- TypeScript strict mode
- Husky pre-commit hooks

---

## 🤝 Development Guidelines

### Code Style
- Use TypeScript strictly (no `any` types)
- Follow Airbnb React/React Native style guide
- Use functional components with hooks
- Prefer const over let
- Use arrow functions
- Extract reusable logic to hooks

### Git Workflow
```bash
# Feature branch
git checkout -b feature/gold-calculator

# Commit with conventional commits
git commit -m "feat: add gold calculator screen"

# Push and create PR
git push origin feature/gold-calculator
```

### Commit Convention
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `style:` - Code style changes
- `docs:` - Documentation
- `test:` - Tests
- `chore:` - Build/config changes

### Code Review Checklist
- [ ] Code follows style guide
- [ ] TypeScript types are correct
- [ ] Components are tested
- [ ] No console.logs in production code
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] i18n strings are used (no hardcoded text)
- [ ] Performance is considered
- [ ] Accessibility is addressed

---

## 📞 Support & Contact

- **Project Lead**: [Name]
- **Backend API**: http://api.odamak.test/api
- **Backend Documentation**: See `CLAUDE.md` in web project
- **Design Files**: [Figma/Sketch link]
- **Issue Tracker**: [GitHub/Jira link]

---

## 📄 License

Private project - All rights reserved.

---

**End of React Native App Specification**

> This document serves as a comprehensive guide for AI assistants and developers to build the Odamak mobile app. It covers business requirements, technical architecture, UI/UX guidelines, and implementation details.

**Last Updated**: January 28, 2026
**Document Version**: 1.0.0

