# API Cleanup Summary

## Overview
Cleaned up all old/deprecated API endpoints and kept only those from the Nezzel Postman collection.

## Active API Endpoints (From Postman Collection)

### ✅ Gold Endpoints
These are the **ONLY** active endpoints now:

1. **Get Overview** - `GET /api/gold/get-overview`
   - Returns prices for 5 main products (21k, 24k, 18k, gold pound, ounce)
   - Used on home page
   - Hook: `useGoldOverview()`

2. **Get All Prices** - `GET /api/gold/get-all-prices`
   - Optional filters: currency, period
   - Returns all gold products with chart data
   - Hook: `useAllGoldPrices(currency, period)`

## Files Cleaned Up

### 1. `lib/api.ts` ✅
**Removed:**
- `fetchCurrentPrices()` 
- `fetchKaratPrice(karat)`
- `fetchPriceHistory()`
- `fetchChartData()`
- `getCurrencyPrices()`
- `getBankPrices()`
- All mock data imports and USE_MOCK_DATA flag

**Kept:**
- `fetchGoldOverview()` ✅
- `fetchAllGoldPrices(currency, period)` ✅

**File size:** Reduced from 231 lines to ~60 lines

### 2. `hooks/use-gold-prices.ts` ✅
**Active Hooks:**
- `useGoldOverview()` ✅
- `useAllGoldPrices(currency, period)` ✅

**Deprecated (Empty Data):**
- `useGoldPrices()` - Returns empty array, logs warning
- `useKaratPrice(karat)` - Returns undefined, logs warning

### 3. `hooks/use-currency-prices.ts` ✅
**Deprecated:**
- `useCurrencyPrices()` - Returns empty array, logs warning
- Removed `getCurrencyPrices` import

### 4. `hooks/use-price-history.ts` ✅
**Deprecated:**
- `usePriceHistory()` - Returns empty array, logs warning
- `useChartData()` - Returns empty array, logs warning
- Removed all old API imports

## Why Deprecated Hooks Still Exist

To prevent breaking existing components, deprecated hooks were kept with these changes:
1. Return empty data (empty arrays or undefined)
2. Log console warnings when called
3. Marked with `@deprecated` JSDoc tags
4. Include migration instructions in warnings

## Components Affected (Need Migration)

The following components use deprecated hooks and will need to be updated:

### Using `useGoldPrices()`:
- `app/gold/page.tsx`
- `app/me/portfolio/page.tsx`
- `components/home/market-insights.tsx`
- `components/home/hero-stats-banner.tsx`
- `components/home/gold-calculator.tsx`

### Using `useKaratPrice()`:
- `app/karat/[karat]/page.tsx`

### Using `useChartData()`:
- `app/karat/[karat]/page.tsx`
- `app/chart/page.tsx`
- `app/gold/page.tsx`

### Using `usePriceHistory()`:
- `app/history/page.tsx`
- `components/home/recent-activity.tsx`

### Using `useCurrencyPrices()`:
- `components/currency/currency-section.tsx`
- `app/me/portfolio/page.tsx`
- `components/home/market-insights.tsx`
- `components/home/hero-stats-banner.tsx`

## Migration Examples

### Example 1: Migrate useGoldPrices()

**Before:**
```typescript
const { data: prices } = useGoldPrices();
const gold24 = prices?.find(p => p.karat === 'k24');
const gold21 = prices?.find(p => p.karat === 'k21');
```

**After:**
```typescript
const { data: overview } = useGoldOverview();
const gold24 = overview?.data.gold['24'];
const gold21 = overview?.data.gold['21'];
```

### Example 2: Migrate useKaratPrice()

**Before:**
```typescript
const { data: price, isLoading } = useKaratPrice('k21');
```

**After:**
```typescript
const { data: overview, isLoading } = useGoldOverview();
const price = overview?.data.gold['21'];
```

### Example 3: Migrate useChartData()

**Before:**
```typescript
const { data: chartData } = useChartData(30, ['k24', 'k21']);
```

**After:**
```typescript
const { data: overview } = useGoldOverview();
const chart24 = overview?.data.gold['24'].chart_points;
const chart21 = overview?.data.gold['21'].chart_points;
```

## Data Structure Changes

### Old Structure (useGoldPrices):
```typescript
[
  {
    karat: 'k24',
    name: 'عيار 24',
    buyPrice: 3600,
    sellPrice: 3650,
    change: 15,
    changePercent: 0.41,
    updatedAt: '2026-01-26T...'
  }
]
```

### New Structure (useGoldOverview):
```typescript
{
  status: 200,
  success: true,
  data: {
    gold: {
      '24': {
        currency: 'EGP',
        sell_price: 3650,
        buy_price: 3600,
        spread_egp: 50,
        spread_percent: 1.37,
        chart_points: [3635, 3640, 3645, 3650],
        chart_color: 'green',
        recorded_at: '2026-01-26T00:00:00.000000Z'
      },
      '21': { /* ... */ },
      '18': { /* ... */ },
      'gold_pound': { /* ... */ },
      'ounce': { 
        currency: 'USD',
        /* ... */
      }
    }
  }
}
```

## Field Mapping

| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `buyPrice` | `buy_price` | Snake case |
| `sellPrice` | `sell_price` | Snake case |
| `change` | `spread_egp` | Now EGP spread |
| `changePercent` | `spread_percent` | Now spread % |
| `updatedAt` | `recorded_at` | Renamed |
| N/A | `chart_points` | New: Array of historical prices |
| N/A | `chart_color` | New: Suggested chart color |
| N/A | `currency` | New: Currency code |

## Next Steps

1. **Update Components:** Migrate all components using deprecated hooks
2. **Remove Deprecated Hooks:** After migration, remove deprecated hooks entirely
3. **Add New Endpoints:** When new endpoints are added to Postman collection, add them to `lib/api.ts`
4. **Test Migration:** Test each page to ensure data displays correctly

## Benefits of Cleanup

✅ Removed ~170 lines of dead code
✅ Clearer API structure matching backend
✅ Single source of truth (Postman collection)
✅ Better type safety with new response structures
✅ Improved maintainability
✅ Easier to add new endpoints

## Console Warnings

When using deprecated hooks, you'll see:
```
⚠️ useGoldPrices: This hook is deprecated. Use useGoldOverview() instead.
⚠️ useKaratPrice: This hook is deprecated. Use useGoldOverview() instead.
⚠️ useCurrencyPrices: This endpoint is deprecated and not in the new API.
⚠️ usePriceHistory: This endpoint is deprecated. Use useGoldOverview() instead.
⚠️ useChartData: This endpoint is deprecated. Use useGoldOverview() for chart data instead.
```

These warnings help identify which components need migration.
