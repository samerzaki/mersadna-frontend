'use client';

import { useEffect } from 'react';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

// Inline fallback colors mirror the dark theme tokens in app/globals.css.
// global-error.tsx replaces the root layout entirely when it renders, so we
// cannot rely on the global stylesheet being present — inline styles keep
// this page legible even if Tailwind never loads.
const colors = {
  bg: '#171717',
  panel: '#212121',
  line: '#3a3a3a',
  text: '#f5f5f5',
  muted: '#b8b8b8',
  dim: '#8a8a8a',
  gold: '#8fa1e8',
  onGold: '#12142b',
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body style={{ margin: 0, background: colors.bg, color: colors.text, fontFamily: 'sans-serif' }}>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 16px',
          }}
        >
          <div
            style={{
              margin: '0 auto',
              maxWidth: 480,
              width: '100%',
              textAlign: 'center',
              background: colors.panel,
              borderRadius: 20,
              padding: 40,
              boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
              <AlertTriangle style={{ height: 56, width: 56, color: colors.gold }} />
            </div>

            <h2 style={{ marginBottom: 16, fontSize: 26, fontWeight: 600, color: colors.text }}>
              حدث خطأ خطير
            </h2>

            <p style={{ marginBottom: 32, fontSize: 16, lineHeight: 1.7, color: colors.muted }}>
              نعتذر، حدث خطأ خطير في التطبيق. يرجى تحديث الصفحة أو العودة للصفحة الرئيسية.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div
                style={{
                  marginBottom: 32,
                  borderRadius: 11,
                  border: `1px solid ${colors.line}`,
                  background: colors.bg,
                  padding: 16,
                  textAlign: 'start',
                }}
              >
                <p style={{ fontSize: 12, fontFamily: 'monospace', color: colors.muted, margin: 0 }}>
                  {error.message}
                </p>
                {error.digest && (
                  <p style={{ marginTop: 8, fontSize: 12, color: colors.dim, margin: '8px 0 0' }}>
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  borderRadius: 10,
                  background: colors.gold,
                  color: colors.onGold,
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw style={{ height: 16, width: 16 }} />
                إعادة المحاولة
              </button>

              <a
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  borderRadius: 10,
                  border: `1px solid ${colors.line}`,
                  background: 'transparent',
                  color: colors.text,
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Home style={{ height: 16, width: 16 }} />
                العودة للرئيسية
              </a>
            </div>

            <p style={{ marginTop: 32, fontSize: 13, color: colors.dim }}>
              إذا استمرت المشكلة،{' '}
              <a href="/contact" style={{ color: colors.gold, textDecoration: 'underline' }}>
                تواصل معنا
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
