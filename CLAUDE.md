# CLAUDE.md - Project Documentation

> **Last Updated:** January 27, 2026
> **Project Name:** Mersadna (مرصادنا)
> **Version:** 0.1.0

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [API Integration](#api-integration)
- [Development Setup](#development-setup)
- [Architecture Patterns](#architecture-patterns)
- [Code Conventions](#code-conventions)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Key Files Reference](#key-files-reference)
- [Component Library](#component-library)
- [State Management](#state-management)
- [Styling & Design](#styling--design)
- [Performance Optimizations](#performance-optimizations)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 📖 Project Overview

**Mersadna** is a comprehensive web application for tracking real-time gold and currency prices in Egypt. The platform provides:

- **Live Gold Prices**: Real-time tracking of gold prices across all karats (24k, 21k, 18k) plus gold pound and ounce
- **Currency Exchange Rates**: Live currency exchange rates from Egyptian banks and parallel markets
- **Cryptocurrency Tracking**: Real-time crypto market data
- **Smart Calculators**: Gold calculation, currency conversion, and Zakat calculators
- **Market Analytics**: Price charts, trends, and market pulse indicators
- **Bank Comparisons**: Compare rates across multiple Egyptian banks

### Target Audience
- Gold investors and traders in Egypt
- Currency exchange seekers
- Cryptocurrency enthusiasts
- Financial analysts

### Primary Language
- **UI Language**: Arabic (RTL layout)
- **Code**: English
- **API Responses**: Bilingual support (ar/en)

---

## 🛠 Tech Stack

### Core Framework
- **[Next.js 16.1.4](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.3](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[@tailwindcss/postcss](https://tailwindcss.com/docs/using-with-preprocessors)** - PostCSS integration
- **[tw-animate-css](https://www.npmjs.com/package/tw-animate-css)** - Animation utilities
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
  - Dropdown Menu
  - Label
  - Select
  - Separator
  - Slot
- **[Lucide React](https://lucide.dev/)** - Icon library

### Data Fetching & State
- **[@tanstack/react-query 5.90.19](https://tanstack.com/query/latest)** - Server state management
  - Smart caching (30s stale, 5min cache)
  - Auto-refresh every 60s
  - Request deduplication
  - Parallel queries

### Utilities
- **[clsx](https://www.npmjs.com/package/clsx)** - Conditional className utilities
- **[class-variance-authority](https://cva.style/docs)** - Component variant management
- **[tailwind-merge](https://www.npmjs.com/package/tailwind-merge)** - Merge Tailwind classes
- **[date-fns 4.1.0](https://date-fns.org/)** - Date formatting and manipulation
- **[recharts 3.6.0](https://recharts.org/)** - Chart library

### Development Tools
- **[ESLint 9](https://eslint.org/)** - Linting
- **[eslint-config-next](https://nextjs.org/docs/app/building-your-application/configuring/eslint)** - Next.js ESLint config

### Fonts
- **[Cairo](https://fonts.google.com/specimen/Cairo)** - Arabic/Latin font (200-900 weights)
- **[Geist](https://vercel.com/font)** - Sans-serif font
- **[Geist Mono](https://vercel.com/font)** - Monospace font

---

## 📁 Project Structure

```
gold/
├── app/                        # Next.js App Router pages
│   ├── auth/                   # Authentication pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── calculator/page.tsx     # Gold calculator page
│   ├── chart/page.tsx          # Price charts page
│   ├── crypto/                 # Cryptocurrency section
│   │   ├── calculator/page.tsx
│   │   ├── charts/page.tsx
│   │   └── page.tsx
│   ├── currencies/             # Currency exchange section
│   │   ├── calculator/page.tsx
│   │   ├── charts/page.tsx
│   │   ├── currencies-client.tsx
│   │   └── page.tsx
│   ├── currency/
│   │   └── analytics/page.tsx
│   ├── gold/                   # Gold section
│   │   ├── dealers/page.tsx
│   │   ├── zakat/page.tsx
│   │   └── page.tsx
│   ├── history/page.tsx        # Price history
│   ├── home-client.tsx         # Home page client component
│   ├── karat/[karat]/page.tsx  # Dynamic karat pages
│   ├── me/                     # User dashboard
│   │   └── alerts/page.tsx
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Homepage
│   ├── providers.tsx           # Context providers wrapper
│   └── globals.css             # Global styles
│
├── components/                 # React components
│   ├── charts/                 # Chart components
│   │   ├── chart-controls.tsx
│   │   ├── comparison-chart.tsx
│   │   └── price-chart.tsx
│   ├── crypto/                 # Cryptocurrency components
│   │   ├── crypto-market-table.tsx
│   │   ├── crypto-price-card.tsx
│   │   └── crypto-stats-bar.tsx
│   ├── currency/               # Currency components
│   │   ├── bank-rates-table.tsx
│   │   ├── currency-card.tsx
│   │   ├── currency-section.tsx
│   │   ├── currency-table.tsx
│   │   ├── market-pulse-hero.tsx
│   │   ├── pulse-dashboard.tsx
│   │   ├── quick-rate-widget.tsx
│   │   ├── reality-calculator.tsx
│   │   └── smart-currency-calculator.tsx
│   ├── dashboard/              # Dashboard components
│   ├── history/                # History components
│   ├── home/                   # Homepage components
│   ├── layout/                 # Layout components
│   │   ├── app-shell.tsx
│   │   └── header.tsx
│   ├── pricing/                # Pricing components
│   └── ui/                     # Reusable UI components
│       ├── api-error.tsx       # Error display with retry
│       ├── loading-skeleton.tsx # Loading states
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...                 # Other UI primitives
│
├── hooks/                      # Custom React hooks
│   ├── use-crypto-prices.ts    # Cryptocurrency data hooks
│   ├── use-currency-prices.ts  # Currency exchange hooks
│   ├── use-gold-prices.ts      # Gold price hooks
│   └── use-price-history.ts    # Historical price hooks
│
├── contexts/                   # React Context providers
│   ├── auth-context.tsx        # Authentication state
│   └── language-context.tsx    # Language/i18n state
│
├── lib/                        # Utility functions
│   ├── api.ts                  # API client functions
│   ├── constants.ts            # App constants (API_BASE_URL, etc.)
│   ├── currency-constants.ts   # Currency-specific constants
│   ├── format.ts               # Formatting utilities
│   ├── landing/
│   │   └── constants.ts        # Landing page constants
│   ├── mock-currency-data.ts   # Mock data for development
│   ├── navigation.ts           # Navigation utilities
│   ├── translations.ts         # Translation utilities
│   └── utils.ts                # General utilities
│
├── types/                      # TypeScript type definitions
│   ├── alerts.ts               # Alert types
│   ├── api.ts                  # API response types
│   ├── country.ts              # Country types
│   ├── crypto.ts               # Cryptocurrency types
│   ├── currency.ts             # Currency types
│   ├── gold.ts                 # Gold types
│   └── index.ts                # Type exports
│
├── public/                     # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── data/                       # Static data files
├── logs/                       # Application logs
├── plans/                      # Planning documents
│
├── .env.local                  # Local environment variables (gitignored)
├── .env.local.example          # Environment template
├── .gitignore                  # Git ignore rules
├── components.json             # shadcn/ui configuration
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
├── API_CLEANUP_SUMMARY.md      # API cleanup notes
├── API_ENDPOINTS.md            # API endpoint documentation
├── API_INTEGRATION.md          # API integration guide
└── IMPLEMENTATION_SUMMARY.md   # Implementation summary
```

---

## 🎯 Key Features

### 1. Real-Time Gold Prices
- Live prices for all karats: 24k, 21k, 18k
- Gold pound and ounce (USD)
- Buy/sell spread calculations
- 24-hour trend charts
- Auto-refresh every 60 seconds

### 2. Currency Exchange Rates
- Bank rates vs parallel market
- Multi-bank comparison
- Real-time rate updates
- Best buy/sell finder
- Rate history with sparkline charts

### 3. Smart Calculators
- **Gold Calculator**: Calculate gold value by weight and karat
- **Currency Converter**: Convert between currencies with bank/parallel market rates
- **Zakat Calculator**: Calculate Islamic Zakat on gold holdings
- **Credit Card Rate Calculator**: Include 10% markup for credit card transactions

### 4. Cryptocurrency Market
- Real-time crypto prices
- Market statistics
- Price comparison tables

### 5. Bank Rate Comparison
- Sort by buy/sell prices
- Pin favorite banks (localStorage)
- Historical rate charts
- Spread calculations

### 6. Market Analytics
- Price trends and predictions
- Market pulse indicators
- Historical price charts
- Comparison charts

### 7. Responsive Design
- Mobile-first approach
- RTL (Right-to-Left) support for Arabic
- Adaptive layouts for all screen sizes

---

## 🔌 API Integration

### Base URL
```
http://api.mersadna.test/api
```

### Available Endpoints

#### Gold Endpoints

| Endpoint | Method | Description | Hook |
|----------|--------|-------------|------|
| `/gold/get-overview` | GET | Home page gold data (all karats) | `useGoldOverview()` |
| `/gold/get-all-prices` | GET | All gold prices with filters | `useAllGoldPrices(currency, period)` |
| `/gold/calculate` | GET | Calculate gold value | `useGoldCalculator(grams, karat, enabled)` |

#### Currency Endpoints

| Endpoint | Method | Description | Hook |
|----------|--------|-------------|------|
| `/currency/highest-buy-price` | GET | Best buy rate across banks | `useHighestBuyPrice(currency)` |
| `/currency/highest-sell-price` | GET | Best sell rate across banks | `useHighestSellPrice(currency)` |
| `/currency/averages` | GET | Bank & parallel market averages | `useCurrencyAverages(fromCurrency, toCurrency)` |
| `/currency/banks` | GET | All bank rates with charts | `useCurrencyBanks(fromCurrency, toCurrency, period)` |

### API Client Structure

All API calls go through `lib/api.ts`:

```typescript
import { API_BASE_URL } from './constants';

export async function fetchGoldOverview(): Promise<GoldOverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/gold/get-overview`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch gold overview');
  }

  return await response.json();
}
```

### React Query Configuration

```typescript
// hooks/use-gold-prices.ts
export function useGoldOverview() {
  return useQuery({
    queryKey: ['gold', 'overview'],
    queryFn: fetchGoldOverview,
    staleTime: 30000,        // 30 seconds
    gcTime: 300000,          // 5 minutes
    refetchInterval: 60000,  // Auto-refresh every 60s
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
```

### Common Headers
```typescript
{
  'Accept': 'application/json',
  'Accept-Language': 'ar'  // or 'en'
}
```

### Error Handling Pattern
```typescript
if (error) {
  return <ApiError error={error} onRetry={refetch} />;
}
```

---

## 🚀 Development Setup

### Prerequisites
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **Windows/Linux/macOS**: Any OS
- **Backend API**: Mersadna API running at `http://api.mersadna.test/api`

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   cd c:\laragon\www\gold
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp env.local.example .env.local
   ```

   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://api.mersadna.test/api
   NODE_ENV=development
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open browser**:
   ```
   http://localhost:3000
   ```

### Windows Setup (Laragon)

If using Laragon on Windows, use the provided batch script:

```bash
./setup-windows.bat
```

This script handles:
- Module resolution from project root
- Path configurations
- Laragon-specific settings

---

## 🏗 Architecture Patterns

### 1. App Router Architecture (Next.js 16)
- File-based routing in `app/` directory
- Server Components by default
- Client Components marked with `'use client'`
- Layouts for shared UI
- Loading states with `loading.tsx`
- Error boundaries with `error.tsx`

### 2. Component Organization
```
components/
  ├── [feature]/           # Feature-specific components
  │   ├── component.tsx    # Main component
  │   └── ...
  └── ui/                  # Reusable primitives
      ├── button.tsx
      └── ...
```

### 3. Data Fetching Pattern
```typescript
// 1. Define types (types/gold.ts)
export interface GoldOverviewResponse { ... }

// 2. Create API function (lib/api.ts)
export async function fetchGoldOverview() { ... }

// 3. Create hook (hooks/use-gold-prices.ts)
export function useGoldOverview() {
  return useQuery({
    queryKey: ['gold', 'overview'],
    queryFn: fetchGoldOverview,
    // ... config
  });
}

// 4. Use in component
function MyComponent() {
  const { data, isLoading, error } = useGoldOverview();
  // ...
}
```

### 4. Type Safety
- All API responses have TypeScript interfaces
- Strict TypeScript configuration
- Type exports from `types/index.ts`

### 5. Context Pattern
```typescript
// contexts/auth-context.tsx
export const AuthProvider = ({ children }) => {
  // Auth logic
  return <AuthContext.Provider value={...}>{children}</AuthContext.Provider>;
};

// app/providers.tsx
export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

---

## 📝 Code Conventions

### File Naming
- **Components**: `kebab-case.tsx` (e.g., `bank-rates-table.tsx`)
- **Hooks**: `use-*.ts` (e.g., `use-gold-prices.ts`)
- **Types**: `kebab-case.ts` (e.g., `currency.ts`)
- **Utils**: `kebab-case.ts` (e.g., `format.ts`)

### Component Structure
```typescript
'use client'; // If client component

import { ... } from '...';

// Types (if component-specific)
interface Props {
  title: string;
  onAction?: () => void;
}

// Main component
export function ComponentName({ title, onAction }: Props) {
  // Hooks
  const { data } = useGoldOverview();

  // Event handlers
  const handleClick = () => {
    // ...
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Import Order
1. React/Next.js imports
2. Third-party libraries
3. Local components
4. Local hooks
5. Local utilities
6. Local types
7. Assets

```typescript
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useGoldOverview } from '@/hooks/use-gold-prices';
import { formatPrice } from '@/lib/format';
import type { GoldOverviewResponse } from '@/types';
```

### TypeScript Best Practices
- Use `interface` for object types
- Use `type` for unions, primitives, etc.
- Avoid `any` - use `unknown` if needed
- Export types from `types/index.ts`

### CSS/Tailwind Best Practices
- Use Tailwind utilities first
- Extract common patterns to `utils.ts` with `cn()` helper
- Use Radix UI for complex components
- RTL-aware spacing (`ms-*` instead of `ml-*`)

---

## 🌍 Environment Variables

### Required Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://api.mersadna.test/api

# Environment
NODE_ENV=development
```

### Optional Variables

```env
# Analytics (future)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=

# Features
NEXT_PUBLIC_ENABLE_AUTH=false
```

### File Locations
- **`.env.local`**: Local development (gitignored)
- **`.env.local.example`**: Template for `.env.local`
- **`.env.production`**: Production settings (if needed)

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server (Turbopack)
npm run dev:webpack  # Start dev server (webpack, if needed)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npx tsc --noEmit     # Type checking (no script defined)

# Utilities
npm install          # Install dependencies
npm update           # Update dependencies
```

---

## 🗂 Key Files Reference

### Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration (Turbopack, webpack, images, headers) |
| `tsconfig.json` | TypeScript compiler configuration |
| `eslint.config.mjs` | ESLint rules |
| `postcss.config.mjs` | PostCSS plugins (Tailwind) |
| `components.json` | shadcn/ui component configuration |
| `package.json` | Dependencies and scripts |

### Core Application Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with metadata, fonts, providers |
| `app/page.tsx` | Homepage |
| `app/providers.tsx` | Context providers wrapper (React Query, Auth, Language) |
| `app/globals.css` | Global styles and Tailwind imports |

### Type Definitions

| File | Purpose |
|------|---------|
| `types/gold.ts` | Gold-related types |
| `types/currency.ts` | Currency-related types |
| `types/crypto.ts` | Cryptocurrency types |
| `types/api.ts` | Generic API types |
| `types/index.ts` | Type exports |

### Utilities

| File | Purpose |
|------|---------|
| `lib/api.ts` | API client functions |
| `lib/constants.ts` | App constants (API_BASE_URL, etc.) |
| `lib/format.ts` | Formatting utilities (numbers, dates, etc.) |
| `lib/utils.ts` | General utilities (cn, etc.) |
| `lib/navigation.ts` | Navigation helpers |
| `lib/translations.ts` | i18n utilities |

### Hooks

| File | Purpose |
|------|---------|
| `hooks/use-gold-prices.ts` | Gold price fetching hooks |
| `hooks/use-currency-prices.ts` | Currency rate fetching hooks |
| `hooks/use-crypto-prices.ts` | Crypto price fetching hooks |
| `hooks/use-price-history.ts` | Historical price hooks |

---

## 🎨 Component Library

### UI Primitives (`components/ui/`)
- `button.tsx` - Button component with variants
- `card.tsx` - Card container
- `input.tsx` - Form input
- `label.tsx` - Form label
- `select.tsx` - Dropdown select
- `separator.tsx` - Divider line
- `api-error.tsx` - Error display with retry button
- `loading-skeleton.tsx` - Loading state skeletons

### Feature Components
- **Gold**: Price cards, calculators, Zakat calculator
- **Currency**: Bank tables, converters, analytics
- **Crypto**: Market tables, price cards, stats bars
- **Charts**: Price charts, comparison charts, controls
- **Layout**: Header, app shell, navigation

### Radix UI Components
All complex interactive components use Radix UI:
- Dropdown Menu
- Select
- Label
- Separator

---

## 🗃 State Management

### Global State (React Context)
- **AuthContext**: User authentication state
- **LanguageContext**: Language/locale state

### Server State (TanStack Query)
- Caching with smart invalidation
- Auto-refresh every 60 seconds
- Optimistic updates
- Error handling with retries

### Local State
- `useState` for component-local state
- `localStorage` for persistence (e.g., pinned banks)

---

## 🎨 Styling & Design

### Tailwind CSS 4
- Utility-first approach
- Custom configuration in `tailwind.config.ts`
- RTL support built-in

### Design Tokens
```css
:root {
  --font-cairo: 'Cairo', sans-serif;
  --font-geist-sans: 'Geist', sans-serif;
  --font-geist-mono: 'Geist Mono', monospace;
}
```

### Color Scheme
- Primary: Gold-themed colors
- Semantic colors: success (green), error (red), warning (yellow)
- Neutral grays for text and backgrounds

### Typography
- **Primary Font**: Cairo (Arabic/Latin)
- **Secondary Font**: Geist Sans
- **Code Font**: Geist Mono

### Responsive Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## ⚡ Performance Optimizations

### 1. React Query Caching
```typescript
staleTime: 30000,        // Data fresh for 30s
gcTime: 300000,          // Cache for 5min
refetchInterval: 60000,  // Auto-refresh every 60s
```

### 2. Parallel Queries
Multiple queries execute simultaneously:
```typescript
const goldData = useGoldOverview();
const usdAvg = useCurrencyAverages('USD');
const eurAvg = useCurrencyAverages('EUR');
// All fetch in parallel!
```

### 3. Request Deduplication
TanStack Query automatically prevents duplicate requests.

### 4. Conditional Fetching
```typescript
useGoldCalculator(weight, karat, weight > 0); // Only fetch when valid
```

### 5. Image Optimization
- Next.js Image component
- WebP/AVIF formats
- Responsive images

### 6. Code Splitting
- Automatic route-based splitting
- Dynamic imports for heavy components

---

## 🧪 Testing

### Current Status
No automated tests are currently implemented.

### Recommended Testing Setup (Future)
- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **Component Tests**: Storybook

### Manual Testing Checklist
- [ ] Gold calculator calculates correctly
- [ ] Currency converter shows 3 scenarios
- [ ] Bank rates table sorts correctly
- [ ] Pin/unpin banks persists in localStorage
- [ ] Auto-refresh works (60s interval)
- [ ] Error states display properly
- [ ] Loading skeletons appear
- [ ] RTL layout works correctly
- [ ] Mobile responsive
- [ ] API errors handled gracefully

---

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Production Server
```bash
npm start
```

### Environment Setup
Ensure production environment variables are set:
```env
NEXT_PUBLIC_API_URL=https://api.mersadna.com
NODE_ENV=production
```

### Deployment Platforms
- **Vercel**: Recommended (native Next.js support)
- **Netlify**: Supported
- **Custom Server**: Node.js server with `npm start`
- **Docker**: Containerized deployment

### Static Export (if needed)
Next.js App Router with server components doesn't support static export by default. Use Vercel or Node.js server.

---

## 🐛 Troubleshooting

### Common Issues

#### 1. API Connection Failed
**Error**: `Failed to fetch gold overview`

**Solution**:
- Ensure backend API is running at `http://api.mersadna.test/api`
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Verify API endpoint is accessible (visit in browser)

#### 2. Module Resolution Errors
**Error**: `Cannot find module '@/components/...'`

**Solution**:
- Check `tsconfig.json` has paths configured:
  ```json
  "paths": { "@/*": ["./*"] }
  ```
- Restart TypeScript server in VS Code

#### 3. Tailwind Styles Not Applying
**Solution**:
- Check `app/globals.css` imports Tailwind:
  ```css
  @import "tailwindcss";
  ```
- Restart dev server

#### 4. React Query DevTools Not Showing
**Solution**:
- Install DevTools:
  ```bash
  npm install @tanstack/react-query-devtools
  ```
- Add to `app/providers.tsx`:
  ```typescript
  import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
  ```

#### 5. RTL Layout Issues
**Solution**:
- Ensure `html` tag has `dir="rtl"` in `app/layout.tsx`
- Use RTL-aware spacing (`ms-*` instead of `ml-*`)

---

## 📚 Additional Documentation

- [API_INTEGRATION.md](./API_INTEGRATION.md) - Detailed API integration guide
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API endpoint reference
- [API_CLEANUP_SUMMARY.md](./API_CLEANUP_SUMMARY.md) - API cleanup notes
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Implementation summary

---

## 🤝 Contributing

### Code Style
- Follow existing patterns
- Use TypeScript strictly
- Write meaningful commit messages
- Keep components focused and small

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/my-feature
```

### Commit Message Convention
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `style:` - Code style changes
- `docs:` - Documentation
- `test:` - Tests
- `chore:` - Maintenance

---

## 📞 Contact & Support

- **Website**: https://mersadna.com
- **Twitter**: @mersadna

---

## 📄 License

Private project - All rights reserved.

---

**End of Documentation**

> This file is intended to help AI assistants (like Claude) and developers understand the project structure, conventions, and architecture at a glance.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

