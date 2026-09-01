import { ImageResponse } from 'next/og';

export const alt = 'مرصادنا | أسعار الذهب والعملات في مصر';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          color: '#fffaf0',
          background: 'linear-gradient(135deg, #17120a 0%, #6b4308 52%, #c7831c 100%)',
          direction: 'rtl',
        }}
      >
        <div style={{ fontSize: 54, fontWeight: 700, marginBottom: 24 }}>MERSADNA</div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.2 }}>Egypt market prices</div>
        <div style={{ fontSize: 32, marginTop: 30, color: '#f9dc9c' }}>Gold, currencies, calculators, and market updates</div>
      </div>
    ),
    size,
  );
}
