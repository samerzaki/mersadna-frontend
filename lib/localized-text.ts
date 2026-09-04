export function localizedText(value: unknown, language: 'ar' | 'en', fallback = '—'): string {
  if (typeof value === 'string') return value;

  if (value && typeof value === 'object') {
    const translations = value as { ar?: unknown; en?: unknown };
    const preferred = translations[language];
    const alternative = translations[language === 'ar' ? 'en' : 'ar'];
    if (typeof preferred === 'string') return preferred;
    if (typeof alternative === 'string') return alternative;
  }

  return fallback;
}
