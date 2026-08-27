'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Crown, Newspaper } from 'lucide-react';
import { navigation } from '@/lib/navigation';
import { searchNews } from '@/lib/mock-news-data';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import type { NewsItem } from '@/types/news';

export function QuickSearch() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter news items based on search query (cross-language)
  const allFilteredNews = searchQuery.trim() ? searchNews(searchQuery) : [];
  const filteredNews = allFilteredNews.slice(0, 4); // Limit to 4 news results
  const hasMoreNews = allFilteredNews.length > 4;

  // Filter navigation items based on search query (cross-language)
  const filteredItems = searchQuery.trim()
    ? navigation.flatMap((group) =>
        group.items
          .filter((item) => {
            const query = searchQuery.toLowerCase();
            // Cross-language search: search in both Arabic and English
            const titleMatchAr = item.titleAr.toLowerCase().includes(query);
            const titleMatchEn = item.titleEn.toLowerCase().includes(query);
            const groupMatchAr = group.groupTitleAr.toLowerCase().includes(query);
            const groupMatchEn = group.groupTitleEn.toLowerCase().includes(query);
            return titleMatchAr || titleMatchEn || groupMatchAr || groupMatchEn;
          })
          .map((item) => ({
            ...item,
            groupTitleEn: group.groupTitleEn,
            groupTitleAr: group.groupTitleAr,
          }))
      )
    : [];

  const hasResults = filteredNews.length > 0 || filteredItems.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
  };

  const handleItemClick = () => {
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search
          className={cn(
            'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none',
            isRTL ? 'right-3' : 'left-3'
          )}
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder={isRTL ? 'بحث سريع... (Ctrl+K)' : 'Quick search... (Ctrl+K)'}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className={cn(
            'h-9 w-full',
            isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4',
            'bg-muted/50 border-muted-foreground/20',
            'focus-visible:ring-1 focus-visible:ring-primary',
            'placeholder:text-muted-foreground/60'
          )}
        />
      </div>

      {/* Dropdown Results */}
      {isOpen && searchQuery.trim() && (
        <div
          className={cn(
            'absolute top-full mt-2 w-full',
            'bg-popover border border-border rounded-lg shadow-lg',
            'max-h-125 overflow-y-auto',
            'z-50',
            'animate-in fade-in slide-in-from-top-2 duration-200'
          )}
        >
          {hasResults ? (
            <div className="p-2">
              {/* News Section (Priority) */}
              {filteredNews.length > 0 && (
                <div className="mb-4">
                  {/* News Header */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {isRTL ? 'الأخبار' : 'News'}
                  </div>

                  {/* News Results */}
                  <div className="space-y-1">
                    {filteredNews.map((news) => (
                      <Link
                        key={news.id}
                        href={`/news/${news.id}`}
                        onClick={handleItemClick}
                        className={cn(
                          'flex items-start gap-3 px-3 py-2.5 rounded-md',
                          'hover:bg-accent transition-colors',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                          'group'
                        )}
                      >
                        {/* Icon */}
                        <div className="shrink-0 mt-0.5">
                          <Newspaper className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium line-clamp-1">
                              {isRTL ? news.titleAr : news.title}
                            </span>
                            {news.isBreaking && (
                              <span className="inline-flex text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full border border-red-100 font-bold dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                                {isRTL ? 'عاجل' : 'BREAKING'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {isRTL ? news.excerptAr : news.excerpt}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Show More Button */}
                  {hasMoreNews && (
                    <Link
                      href={`/news?search=${encodeURIComponent(searchQuery)}`}
                      onClick={handleItemClick}
                      className={cn(
                        'flex items-center justify-center gap-2 px-3 py-2 mt-1 rounded-md',
                        'text-sm font-medium text-primary',
                        'hover:bg-accent transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                      )}
                    >
                      {isRTL ? 'عرض المزيد من النتائج' : 'Show more results'}
                      <span className="text-xs text-muted-foreground">
                        ({allFilteredNews.length})
                      </span>
                    </Link>
                  )}
                </div>
              )}

              {/* Quick Access Section */}
              {filteredItems.length > 0 && (
                <div>
                  {/* Quick Access Header */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {isRTL ? 'الوصول السريع' : 'Quick Access'}
                  </div>

                  {/* Navigation Results */}
                  <div className="space-y-1">
                    {filteredItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={`${item.href}-${index}`}
                          href={item.href}
                          onClick={handleItemClick}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-md',
                            'hover:bg-accent transition-colors',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                            'group'
                          )}
                        >
                          {/* Icon */}
                          <div className="shrink-0">
                            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">
                                {isRTL ? item.titleAr : item.titleEn}
                              </span>
                              {item.isVip && (
                                <span className="inline-flex items-center text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full border border-amber-100 font-bold dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                                  <Crown size={8} className="mr-0.5" />
                                  {isRTL ? 'برو' : 'PRO'}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {isRTL ? item.groupTitleAr : item.groupTitleEn}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'لا توجد نتائج' : 'No results found'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isRTL
                  ? 'جرب كلمة بحث أخرى'
                  : 'Try a different search term'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
