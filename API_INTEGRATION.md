# API Integration - Home Page

## Summary
Successfully integrated the Mersadna API with the home page UI. The application now fetches real-time gold prices from the backend API.

## Changes Made

### 1. API Base URL Configuration
**Files Updated:**
- `lib/constants.ts` - Changed default API_BASE_URL from `http://gold.test/api` to `http://api.mersadna.test/api`
- `.env.local` - Set `NEXT_PUBLIC_API_URL=http://api.mersadna.test/api`
- `env.local.example` - Updated example to use `http://api.mersadna.test/api`
- `lib/api.ts` - Updated fallback baseUrl for bank logos

**Current Configuration:**
```env
NEXT_PUBLIC_API_URL=http://api.mersadna.test/api
```

### 2. Type Definitions
**File: `types/gold.ts`**

Added new types to match the API response structure from the Postman collection:

```typescript
// New types for API responses
export type GoldProductType = '21' | '24' | '18' | 'gold_pound' | 'ounce';

export interface GoldOverviewItem {
  currency: string;
  sell_price: number;
  buy_price: number;
  spread_egp: number;
  spread_percent: number;
  chart_points: number[];
  chart_color: string;
  recorded_at: string;
}

export interface GoldOverviewResponse {
  status: number;
  success: boolean;
  data: {
    gold: {
      '21': GoldOverviewItem;
      gold_pound: GoldOverviewItem;
      '24': GoldOverviewItem;
      '18': GoldOverviewItem;
      ounce: GoldOverviewItem;
    };
  };
}

export interface GoldAllPricesResponse {
  status: number;
  success: boolean;
  data: {
    gold: Record<string, GoldOverviewItem>;
  };
}
```

### 3. API Client Functions
**File: `lib/api.ts`**

Added two new API functions matching the Postman collection:

#### `fetchGoldOverview()`
- **Endpoint:** `GET /api/gold/get-overview`
- **Headers:** `Accept: application/json`, `Accept-Language: ar`
- **Returns:** Complete overview of all gold products for the home page
- **Usage:** Fetches gold prices for: 21k, 24k, 18k, gold pound, and ounce

#### `fetchAllGoldPrices(currency, period)`
- **Endpoint:** `GET /api/gold/get-all-prices`
- **Parameters:**
  - `currency` (optional): Default "EGP"
  - `period` (optional): "24h" | "7d" | "30d", Default "30d"
- **Headers:** `Accept: application/json`, `Accept-Language: ar`
- **Returns:** All gold product prices with chart data for specified period

### 4. React Query Hooks
**File: `hooks/use-gold-prices.ts`**

Added new hooks for fetching gold overview data:

```typescript
// Fetch gold overview for home page
export function useGoldOverview()

// Fetch all gold prices with filters
export function useAllGoldPrices(currency = 'EGP', period = '30d')
```

**Features:**
- Auto-refresh every 60 seconds (REFRESH_INTERVAL)
- Stale time: 30 seconds
- React Query caching and deduplication
- Loading and error states

### 5. UI Component Updates
**File: `components/dashboard/modern-gold-prices.tsx`**

Completely refactored to use real API data:

**New Features:**
- Fetches data from `useGoldOverview()` hook
- Loading skeleton states with `LoadingSkeleton` component
- Error handling with user-friendly error messages
- Dynamic data transformation from API to UI format
- Currency display (USD for ounce, EGP for others)
- Real-time chart points from API

**Data Transformation:**
The component includes a `transformApiDataToGoldDataItem()` function that:
- Maps API keys ('21', '24', '18', 'gold_pound', 'ounce') to UI format
- Converts snake_case API fields to camelCase
- Determines trend direction (up/down/neutral) based on spread_percent
- Handles empty chart_points arrays

**Component States:**
1. **Loading:** Shows skeleton placeholders
2. **Error:** Displays error message with retry capability
3. **Success:** Renders gold price cards with live data

## API Response Example

Based on the Postman collection, the API returns:

```json
{
  "status": 200,
  "success": true,
  "data": {
    "gold": {
      "21": {
        "currency": "EGP",
        "sell_price": 3200,
        "buy_price": 3150,
        "spread_egp": 50,
        "spread_percent": 1.59,
        "chart_points": [3175, 3180, 3185, 3190, 3195, 3200],
        "chart_color": "green",
        "recorded_at": "2026-01-26T00:00:00.000000Z"
      },
      "gold_pound": { /* ... */ },
      "24": { /* ... */ },
      "18": { /* ... */ },
      "ounce": { 
        "currency": "USD",
        /* ... */
      }
    }
  }
}
```

## How It Works

1. **App loads** → `app/page.tsx` renders home page
2. **ModernGoldPrices component** → Calls `useGoldOverview()` hook
3. **React Query** → Fetches from `/api/gold/get-overview`
4. **API responds** → Returns gold prices for all products
5. **Data transformation** → Converts API format to UI format
6. **Render** → Displays price cards with live data
7. **Auto-refresh** → Refetches every 60 seconds

## Testing

To test the integration:

1. **Ensure API is running:**
   ```bash
   # Visit in browser
   http://api.mersadna.test/api/gold/get-overview
   ```

2. **Start Next.js dev server:**
   ```bash
   npm run dev
   ```

3. **Visit home page:**
   ```
   http://localhost:3000
   ```

4. **Check for:**
   - Loading skeletons appear briefly
   - Real gold prices display
   - Live badge shows on each card
   - Charts render with real data
   - Prices auto-refresh every minute

## Error Handling

The component handles various error scenarios:

1. **Network errors:** Shows error message with details
2. **API errors:** Displays fetch error message
3. **Empty data:** Handles missing chart_points gracefully
4. **Invalid responses:** Type-safe with TypeScript

## Next Steps

To integrate other API endpoints:

1. Add type definitions in `types/gold.ts`
2. Create API function in `lib/api.ts`
3. Add React Query hook in `hooks/use-gold-prices.ts`
4. Update UI component to use the hook
5. Handle loading, error, and success states

## Environment Variables

Make sure `.env.local` exists with:

```env
NEXT_PUBLIC_API_URL=http://api.mersadna.test/api
NODE_ENV=development
```

**Note:** The `.env.local` file is gitignored for security. Copy from `env.local.example` if needed.

## Files Modified

1. ✅ `lib/constants.ts` - Updated default API URL
2. ✅ `.env.local` - Set API base URL
3. ✅ `env.local.example` - Updated example
4. ✅ `lib/api.ts` - Added fetchGoldOverview() and fetchAllGoldPrices()
5. ✅ `types/gold.ts` - Added API response types
6. ✅ `hooks/use-gold-prices.ts` - Added useGoldOverview() and useAllGoldPrices()
7. ✅ `components/dashboard/modern-gold-prices.tsx` - Integrated with API

## Dependencies

No new dependencies were added. The integration uses existing packages:
- `@tanstack/react-query` - For data fetching and caching
- `lucide-react` - For icons
- Native `fetch` API - For HTTP requests

## Deprecated Endpoints (Removed)

The following old API endpoints have been removed as they are not in the Postman collection:

### Removed from `lib/api.ts`:
- ❌ `fetchCurrentPrices()` - Was: `GET /api/prices`
- ❌ `fetchKaratPrice(karat)` - Was: `GET /api/prices/{karat}`
- ❌ `fetchPriceHistory()` - Was: `GET /api/history`
- ❌ `fetchChartData()` - Was: `GET /api/chart-data`
- ❌ `getCurrencyPrices()` - Was: `GET /api/currencies`
- ❌ `getBankPrices()` - Was: `GET /api/mock_bank_prices.php`

### Deprecated Hooks (Return Empty Data):
For backward compatibility, these hooks still exist but return empty data and log warnings:

**In `hooks/use-gold-prices.ts`:**
- ⚠️ `useGoldPrices()` - Deprecated, use `useGoldOverview()` instead
- ⚠️ `useKaratPrice(karat)` - Deprecated, use `useGoldOverview()` instead

**In `hooks/use-currency-prices.ts`:**
- ⚠️ `useCurrencyPrices()` - Deprecated, endpoint not in new API

**In `hooks/use-price-history.ts`:**
- ⚠️ `usePriceHistory()` - Deprecated, endpoint not in new API
- ⚠️ `useChartData()` - Deprecated, use `chart_points` from `useGoldOverview()` instead

### Migration Guide

If you're using deprecated hooks, update them as follows:

**Old:**
```typescript
const { data: prices } = useGoldPrices();
const gold24 = prices?.find(p => p.karat === 'k24');
```

**New:**
```typescript
const { data: overview } = useGoldOverview();
const gold24 = overview?.data.gold['24'];
```

**Old:**
```typescript
const { data: price } = useKaratPrice('k21');
```

**New:**
```typescript
const { data: overview } = useGoldOverview();
const price = overview?.data.gold['21'];
```

**Old:**
```typescript
const { data: chartData } = useChartData(30, ['k24', 'k21']);
```

**New:**
```typescript
const { data: overview } = useGoldOverview();
const chartPoints24 = overview?.data.gold['24'].chart_points;
const chartPoints21 = overview?.data.gold['21'].chart_points;
```

