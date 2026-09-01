/** Build the canonical news detail route: /news/{id}-{slug}. */
export function newsDetailPath(id: string | number, slug?: string, title?: string): string {
  const source = slug && slug !== String(id) ? slug : title || 'article';
  const normalized = source
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
  return `/news/${id}-${normalized || 'article'}`;
}

/** Extract the article ID from a canonical {id}-{slug} route segment. */
export function newsIdFromRoute(segment: string): string {
  return /^\d+(?=-|$)/.exec(segment)?.[0] || segment;
}
