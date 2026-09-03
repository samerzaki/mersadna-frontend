'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface NewsImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
}

export function NewsImage({ src, alt, className, sizes = '100vw' }: NewsImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className={cn('stripes flex items-center justify-center', className)}>
        <span className="num text-[11px] text-dim">صورة الخبر</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image src={src} alt={alt} fill unoptimized sizes={sizes} className="object-cover" onError={() => setErrored(true)} />
    </div>
  );
}
