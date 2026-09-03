# News API Integration Guide

> **Last Updated:** January 29, 2026
> **Status:** ✅ Integrated with Real API

---

## Overview

The news section has been successfully integrated with the Odamak backend API. News articles are now fetched from the `/api/news/scraped` endpoint instead of using mock data.

---

## API Endpoints

### 1. List News (Paginated)
```
GET /api/news/scraped
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `search` - Search in title (optional, Arabic)
- `source_name` - Filter by source (optional, e.g., "economyplusme")
- `sort_by` - Sort order: "latest" | "oldest" (default: "latest")

**Response:**
```json
{
  "status": 200,
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "الطلب العالمي على الذهب يسجل رقماً قياسياً",
      "image_url": "https://...",
      "source_name": "economyplusme",
      "source_url": "https://...",
      "published_at": "2026-01-29T11:54:07.000000Z",
      "created_at": "2026-01-29T12:00:00.000000Z"
    }
  ],
  "pagination": {
    "count": 2,
    "total": 18,
    "perPage": 20,
    "currentPage": 1,
    "totalPages": 1
  }
}
```

### 2. Get Single News Article
```
GET /api/news/scraped/:id
```

**Response:**
```json
{
  "status": 200,
  "success": true,
  "data": {
    "id": 1,
    "title": "الطلب العالمي على الذهب يسجل رقماً قياسياً",
    "image_url": "https://...",
    "source_name": "economyplusme",
    "source_url": "https://...",
    "published_at": "2026-01-29T11:54:07.000000Z",
    "created_at": "2026-01-29T12:00:00.000000Z",
    "content": "Full HTML content..."
  }
}
```

---

## Implementation Details

### Type System

**API Types** (`types/news.ts`):
- `ScrapedNewsItem` - Raw API response format
- `ScrapedNewsPagination` - API pagination format
- `ScrapedNewsListResponse` - List endpoint response
- `ScrapedNewsDetailResponse` - Detail endpoint response

**Frontend Types** (existing):
- `NewsItem` - Frontend-friendly format with bilingual support
- `NewsPagination` - Frontend pagination format
- `NewsCategory` - Categories: gold, politics, silver, currencies, economy, crypto

### Data Transformation

**Adapter Functions** (`lib/news-adapters.ts`):

1. **`adaptScrapedNewsToNewsItem()`** - Transforms API data to frontend format
   - Generates slug from title and ID
   - Extracts excerpt from content (first 200 chars)
   - Determines category from title/content keywords
   - Estimates reading time (200 words/minute)
   - Creates NewsSource object from source name

2. **`adaptScrapedPagination()`** - Transforms pagination format
   - Converts API pagination to frontend format
   - Calculates hasNextPage/hasPreviousPage flags

### Category Detection

The adapter uses keyword-based heuristics to determine categories from Arabic/English content:

| Category | Keywords |
|----------|----------|
| gold | ذهب, gold |
| silver | فضة, silver |
| currencies | دولار, يورو, عملة, currency |
| crypto | بيتكوين, كريبتو, bitcoin, crypto |
| politics | سياسة, حكومة, politics |
| economy | (default) |

### API Functions

**Updated Functions** (`lib/api.ts`):

1. **`fetchNewsList()`**
   - Calls `/api/news/scraped`
   - Supports pagination, search, source filtering
   - Transforms API response to frontend format
   - Applies category filter on frontend (API doesn't support it yet)

2. **`fetchNewsDetail()`**
   - Calls `/api/news/scraped/:id`
   - Extracts ID from slug (format: "title-123")
   - Returns full article with content
   - Note: Related news not yet implemented (returns empty array)

3. **`fetchFeaturedNews()`**
   - Fetches latest news from API
   - Marks first 3 items as "featured"
   - Marks first item as "breaking"
   - Used for homepage/hero sections

---

## React Query Hooks

Hooks remain unchanged (`hooks/use-news.ts`):

```typescript
// List news with filters
useNewsList(category?, search?, page?)

// Infinite scroll
useInfiniteNewsList(category?, search?)

// Single article
useNewsDetail(slug, enabled?)

// Featured/breaking news
useFeaturedNews()

// Bookmarks (localStorage)
useNewsBookmarks()
```

---

## Frontend Pages

### News List Page
**Path:** `/news`
**File:** `app/news/page.tsx`

Features:
- Category filtering (frontend-side)
- Search functionality
- Pagination
- Source filtering (if implemented in UI)

### News Detail Page
**Path:** `/news/[slug]`
**File:** `app/news/[slug]/page.tsx`

Features:
- Full article view
- Reading time estimate
- Source attribution
- Related news (placeholder - empty for now)

---

## Known Limitations & TODOs

### Current Limitations

1. **No Category Field in API**
   - API doesn't return category
   - Using keyword-based detection (may be inaccurate)
   - Consider adding `category` field to backend

2. **No Related News**
   - API doesn't provide related articles
   - `relatedNews` always returns empty array
   - Consider implementing backend logic or frontend recommendation

3. **Arabic-Only Content**
   - API returns Arabic content only
   - Frontend expects bilingual (en/ar)
   - Currently duplicating Arabic to both fields

4. **No Featured/Breaking Flags**
   - API doesn't mark articles as featured/breaking
   - Frontend simulates by taking latest articles
   - Consider adding flags to backend

5. **No Tags**
   - API doesn't return tags
   - Adapter generates minimal tags from category
   - Consider adding tags to backend

6. **No View Count**
   - API doesn't track/return view counts
   - Frontend expects this for "trending" features

### Recommended Backend Improvements

```sql
-- Suggested database additions:
ALTER TABLE news ADD COLUMN category VARCHAR(50);
ALTER TABLE news ADD COLUMN tags JSON;
ALTER TABLE news ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE news ADD COLUMN is_breaking BOOLEAN DEFAULT FALSE;
ALTER TABLE news ADD COLUMN view_count INT DEFAULT 0;
ALTER TABLE news ADD COLUMN reading_time_minutes INT;
```

### Frontend TODOs

- [ ] Implement related news recommendation algorithm
- [ ] Add view count tracking
- [ ] Improve category detection accuracy
- [ ] Add more sources to source name mapping
- [ ] Implement analytics tracking
- [ ] Add share functionality
- [ ] Add print-friendly view
- [ ] Implement RSS feed generation

---

## Testing

### Manual Testing

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test news list page:**
   ```
   http://localhost:3000/news
   ```

3. **Test category filtering:**
   ```
   http://localhost:3000/news?category=gold
   ```

4. **Test search:**
   ```
   http://localhost:3000/news?search=ذهب
   ```

5. **Test news detail:**
   ```
   http://localhost:3000/news/[slug-from-list]
   ```

### API Testing

```bash
# List news
curl -H "Accept: application/json" \
     -H "Accept-Language: ar" \
     "http://api.odamak.test/api/news/scraped?page=1"

# Get single news
curl -H "Accept: application/json" \
     -H "Accept-Language: ar" \
     "http://api.odamak.test/api/news/scraped/1"

# Search
curl -H "Accept: application/json" \
     -H "Accept-Language: ar" \
     "http://api.odamak.test/api/news/scraped?search=ذهب"
```

---

## Migration Notes

### What Changed

1. ✅ Added API types for scraped news (`ScrapedNewsItem`, etc.)
2. ✅ Created adapter functions (`lib/news-adapters.ts`)
3. ✅ Updated `fetchNewsList()` to call real API
4. ✅ Updated `fetchNewsDetail()` to call real API
5. ✅ Updated `fetchFeaturedNews()` to call real API
6. ✅ Removed mock data imports from `lib/api.ts`
7. ✅ All React Query hooks remain compatible

### What Stayed the Same

- Frontend components (no changes needed)
- React Query hooks (no changes needed)
- Type system for frontend (NewsItem, etc.)
- Page structure and routing
- UI/UX remains identical

### Backwards Compatibility

The integration is fully backwards compatible. If you need to revert to mock data temporarily:

1. Restore old `lib/api.ts` from git history
2. Mock data still exists in `lib/mock-news-data.ts`
3. No component changes needed

---

## Performance Considerations

### Caching Strategy

```typescript
// React Query configuration
staleTime: 120000,        // 2 minutes
gcTime: 300000,          // 5 minutes
refetchInterval: 300000, // 5 minutes (featured news only)
```

### Pagination

- Default page size: 12 items (defined in `NEWS_PER_PAGE`)
- API returns 20 items per page by default
- Pagination handled by API (efficient)

### Image Loading

- All images from external sources (economyplusme.com, etc.)
- Consider adding Next.js Image optimization
- Consider implementing CDN/image proxy

---

## Troubleshooting

### "News article not found" Error

**Cause:** Slug format doesn't match or article deleted
**Solution:** Check slug format (should contain numeric ID at end)

### Category filtering not working

**Cause:** API doesn't support category filtering yet
**Solution:** Filtering done on frontend - works but less efficient

### Images not loading

**Cause:** External image sources may have CORS issues
**Solution:** Configure Next.js image domains in `next.config.ts`

### API connection failed

**Cause:** Backend API not running or wrong URL
**Solution:** Check `NEXT_PUBLIC_API_URL` in `.env.local`

---

## Related Documentation

- [CLAUDE.md](./CLAUDE.md) - Main project documentation
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - All API endpoints
- [API_INTEGRATION.md](./API_INTEGRATION.md) - General API integration guide

---

**End of News API Integration Guide**

