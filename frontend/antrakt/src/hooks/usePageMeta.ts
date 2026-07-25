import { useEffect } from 'react';

export const SITE_NAME = 'Норильский народный театр';

export const DEFAULT_META_DESCRIPTION =
  'Норильский народный театр — афиша, спектакли, команда и новости. Официальный сайт театра в Норильске.';

/** Обрезать описание для meta description (~160 символов). */
export function truncateMeta(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return DEFAULT_META_DESCRIPTION;
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Установить document.title и meta description для текущей страницы.
 * title без суффикса сайта — суффикс «— Норильский народный театр» добавляется сам.
 */
export function usePageMeta(title?: string | null, description?: string | null): void {
  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute('content') ?? '';

    const pageTitle = (title || '').trim();
    document.title = pageTitle ? `${pageTitle} — ${SITE_NAME}` : SITE_NAME;

    if (meta) {
      const desc = (description || '').trim();
      meta.setAttribute('content', desc || DEFAULT_META_DESCRIPTION);
    }

    return () => {
      document.title = prevTitle;
      if (meta) {
        meta.setAttribute('content', prevDescription);
      }
    };
  }, [title, description]);
}
