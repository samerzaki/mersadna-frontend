# Mersadna API Endpoints Reference

## Base URL
```
http://nezzel.test/api
```

## Endpoints

### 1. Get Overview (Home Page)
**Endpoint:** `GET /gold/get-overview`

**Description:** Get gold prices overview for the home page. Returns prices for the 5 main products.

**Headers:**
```http
Accept: application/json
Accept-Language: ar
```

**Response:**
```json
{
  "status": 200,
  "success": true,
  "data": {
    "gold": {
      "21": {
        "currency": "EGP",
        "sell_price": 0,
        "buy_price": 0,
        "spread_egp": 0,
        "spread_percent": 0,
        "chart_points": [],
        "chart_color": "gray",
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

**Implementation:**
```typescript
import { useGoldOverview } from '@/hooks/use-gold-prices';

function MyComponent() {
  const { data, isLoading, error } = useGoldOverview();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* Use data.data.gold */}</div>;
}
```

---

### 2. Get All Prices
**Endpoint:** `GET /gold/get-all-prices`

**Description:** Get overview-style details for all gold products with optional filtering.

**Query Parameters:**
- `currency` (optional): Currency code (default: "EGP")
- `period` (optional): Time period - "24h" | "7d" | "30d" (default: "30d")

**Headers:**
```http
Accept: application/json
Accept-Language: ar
```

**Example Request:**
```
GET /gold/get-all-prices?currency=EGP&period=30d
```

**Response:**
```json
{
  "status": 200,
  "success": true,
  "data": {
    "gold": {
      "1": {
        "currency": "EGP",
        "sell_price": 0,
        "buy_price": 0,
        "spread_egp": 0,
        "spread_percent": 0,
        "chart_points": [],
        "chart_color": "gray",
        "recorded_at": "2026-01-26T00:00:00.000000Z"
      },
      "2": { /* ... */ }
      // More products...
    }
  }
}
```

**Implementation:**
```typescript
import { useAllGoldPrices } from '@/hooks/use-gold-prices';

function MyComponent() {
  const { data, isLoading, error } = useAllGoldPrices('EGP', '30d');
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* Use data.data.gold */}</div>;
}
```

---

## Response Fields

### GoldOverviewItem
| Field | Type | Description |
|-------|------|-------------|
| `currency` | string | Currency code (EGP, USD) |
| `sell_price` | number | Selling price |
| `buy_price` | number | Buying price |
| `spread_egp` | number | Spread in EGP |
| `spread_percent` | number | Spread percentage |
| `chart_points` | number[] | Historical price points for chart |
| `chart_color` | string | Suggested chart color |
| `recorded_at` | string | ISO 8601 timestamp |

---

## Product Keys

### Overview Endpoint Products
| Key | Description |
|-----|-------------|
| `21` | Gold 21 karat |
| `24` | Gold 24 karat |
| `18` | Gold 18 karat |
| `gold_pound` | Egyptian gold pound |
| `ounce` | Gold ounce (USD) |

### All Prices Endpoint
Returns all products with numeric keys (1, 2, 3, etc.)

---

## Error Handling

All endpoints return standard error responses:

```json
{
  "status": 4xx/5xx,
  "success": false,
  "message": "Error description"
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found
- `500` - Internal Server Error

---

## Auto-Refresh Configuration

The React Query hooks are configured to:
- **Refetch Interval:** 60 seconds (1 minute)
- **Stale Time:** 30 seconds
- **Retry:** 3 attempts on failure
- **Cache:** Automatic deduplication

Configured in `lib/constants.ts`:
```typescript
export const REFRESH_INTERVAL = 60000; // 1 minute
```

---

## Testing Endpoints

### Using curl:
```bash
# Get overview
curl -H "Accept: application/json" \
     -H "Accept-Language: ar" \
     http://nezzel.test/api/gold/get-overview

# Get all prices with filters
curl -H "Accept: application/json" \
     -H "Accept-Language: ar" \
     "http://nezzel.test/api/gold/get-all-prices?currency=EGP&period=7d"
```

### Using browser:
```
http://nezzel.test/api/gold/get-overview
http://nezzel.test/api/gold/get-all-prices?currency=EGP&period=30d
```

---

## Notes

1. All prices are in the currency specified in the response
2. `chart_points` array contains historical prices for sparkline charts
3. `spread_percent` can be positive (price increase) or negative (price decrease)
4. `recorded_at` shows when the price was last updated
5. Empty `chart_points` arrays are handled gracefully in the UI (shows single point)

---

## Future Endpoints to Integrate

Based on common patterns, you might want to add:
- Individual product details
- Historical price data
- Price alerts
- Dealer information
- Zakat calculations
