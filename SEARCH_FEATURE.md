# Quick Search Feature

## Overview
A comprehensive search feature has been added to the header that provides instant access to news articles and all navigation items from the sidebar.

## Features

### 🔍 Search Functionality
- **Search Input**: Text input with search icon
- **Live Filtering**: Real-time filtering as you type
- **Cross-Language Search**: Search in Arabic or English to find results in both languages
  - Example: Search "حاسبة الأسعار" finds "Calculator"
  - Example: Search "calculator" finds "حاسبة البيع و الشراء"
- **Smart Search**: Searches:
  - News titles, excerpts, and tags
  - Navigation item titles
  - Group/category names
- **Keyboard Shortcut**: `Ctrl+K` (or `Cmd+K` on Mac) to focus search
- **Escape to Close**: Press `Esc` to close dropdown

### 📱 Responsive Design
- **Desktop**: Full search bar displayed in header between logo and utility buttons
- **Mobile**: Search icon button that expands to full search bar when clicked

### 📰 News Section (Priority)
- **First Priority**: News results appear first
- Shows up to 4 matching news articles
- Each result displays:
  - News icon
  - Article title (bilingual)
  - Excerpt/summary
  - "BREAKING" badge for breaking news (عاجل in Arabic)
- Links to full article at `/news/{slug}`
- **"Show More" Button**:
  - Appears when there are more than 4 results
  - Shows total count of results
  - Navigates to `/news?search={query}` with the search query

### 🎯 Quick Access Section
- **Second Priority**: Appears after news results
- Shows matching navigation items with:
  - Item icon
  - Item title
  - Group/category name
  - PRO badge for premium features

### ⚡ User Experience
- Click outside to close dropdown
- Automatic focus management
- Smooth animations
- Loading states handled gracefully

## Files Modified/Created

### New Files
- **[components/layout/quick-search.tsx](components/layout/quick-search.tsx)** - Main search component

### Modified Files
- **[components/layout/header.tsx](components/layout/header.tsx)** - Added search component to header

## Implementation Details

### QuickSearch Component
```typescript
// Location: components/layout/quick-search.tsx
- Uses navigation data from lib/navigation.ts
- Filters based on search query
- Displays results in dropdown
- Handles keyboard shortcuts
- Supports RTL layout
```

### Header Integration
```typescript
// Desktop: Search bar between logo and utility buttons
<div className="hidden md:flex md:flex-1 md:max-w-md">
  <QuickSearch />
</div>

// Mobile: Button that toggles search bar
<Button variant="outline" size="icon" className="md:hidden">
  <Search className="h-4 w-4" />
</Button>
```

## Usage

### For Users
1. **Desktop**:
   - Click search bar or press `Ctrl+K`
   - Type to search (in Arabic or English)
   - Results show in two sections:
     - **News** (priority): Up to 4 news articles
     - **Quick Access**: Navigation items
   - Click any result to navigate
   - Click "Show More" to see all news results

2. **Mobile**:
   - Tap search icon in header
   - Search bar expands below header
   - Type and select result

### Search Examples
- Search "ذهب" finds both gold news and gold calculator
- Search "calculator" finds "حاسبة البيع و الشراء"
- Search "bitcoin" finds crypto news and crypto dashboard

### For Developers
The search automatically includes any navigation items added to `lib/navigation.ts`:

```typescript
// Navigation items are automatically searchable
export const navigation: NavGroup[] = [
  {
    id: "gold-market",
    groupTitleEn: "Gold Market",
    groupTitleAr: "سوق الذهب",
    items: [
      {
        titleEn: "Live Prices",
        titleAr: "اسعار الذهب",
        href: "/gold",
        icon: LineChart,
      },
      // ... more items
    ],
  },
  // ... more groups
];
```

## Searchable Items

All sidebar navigation items are searchable:

### Gold Market (سوق الذهب)
- Live Prices (اسعار الذهب)
- Calculator (حاسبة البيع و الشراء)
- Zakat Calc (حاسبة الزكاة)
- Dealers (التجار) - PRO

### Currency Exchange (سوق العملات)
- Dashboard (أسعار العملات)
- Calculator (حاسبة العملات)
- Charts (المؤشرات) - PRO

### Silver Market (الفضة)
- Live Prices (اسعار الفضة)
- Calculator (حاسبة البيع و الشراء)
- Charts (المؤشرات) - PRO

### Cryptocurrencies (العملات الرقمية)
- Dashboard (العملات الرقمية)
- Calculator (حاسبة التحويل)
- Charts (المؤشرات) - PRO

### News Center (مركز الأخبار)
- Latest News (آخر الأخبار)

### My Zone (مساحتي)
- Portfolio (المحفظة)
- Alerts (التنبيهات) - PRO
- Saved News (المحفوظات)

## Technical Notes

### Dependencies
- Uses existing UI components (Input, Button)
- Integrates with language context for RTL support
- No additional packages required

### Performance
- Efficient filtering using array methods
- Minimal re-renders
- Click outside handled with event listeners
- Cleanup on unmount

### Accessibility
- Keyboard navigation support
- Focus management
- Screen reader friendly
- ARIA labels where needed

## Future Enhancements

Potential improvements:
- [ ] Recent searches history
- [ ] Keyboard navigation through results (arrow keys)
- [ ] Search suggestions/autocomplete
- [ ] Search analytics
- [ ] Fuzzy search for typo tolerance
- [ ] Command palette with actions (not just navigation)

## Browser Support
- All modern browsers
- IE11 not supported (uses modern JavaScript features)
- Mobile browsers fully supported

---

**Last Updated**: January 28, 2026
