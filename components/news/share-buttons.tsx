'use client';

import { useState } from 'react';
import { Share2, Twitter, Facebook, MessageCircle, Send, Link2, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  variant?: 'icons' | 'buttons';
  className?: string;
}

export function ShareButtons({ url, title, description, variant = 'icons', className }: ShareButtonsProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = [
    {
      name: 'Twitter',
      nameAr: 'تويتر',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-sky-500 hover:text-white',
    },
    {
      name: 'Facebook',
      nameAr: 'فيسبوك',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-primary-600 hover:text-white',
    },
    {
      name: 'WhatsApp',
      nameAr: 'واتساب',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:bg-green-500 hover:text-white',
    },
    {
      name: 'Telegram',
      nameAr: 'تيليجرام',
      icon: Send,
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-sky-600 hover:text-white',
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  if (variant === 'buttons') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {/* Native share button (mobile) */}
        {'share' in navigator && (
          <Button variant="outline" size="sm" onClick={handleNativeShare} className="gap-2">
            <Share2 className="w-4 h-4" />
            {isRTL ? 'مشاركة' : 'Share'}
          </Button>
        )}

        {shareLinks.map((link) => (
          <Button
            key={link.name}
            variant="outline"
            size="sm"
            asChild
            className="gap-2"
          >
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <link.icon className="w-4 h-4" />
              {isRTL ? link.nameAr : link.name}
            </a>
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              {isRTL ? 'تم النسخ!' : 'Copied!'}
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              {isRTL ? 'نسخ الرابط' : 'Copy Link'}
            </>
          )}
        </Button>
      </div>
    );
  }

  // Icons variant
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* Native share button (mobile) */}
      {'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}

      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors',
            link.color
          )}
          aria-label={`Share on ${link.name}`}
        >
          <link.icon className="w-4 h-4" />
        </a>
      ))}

      <button
        onClick={handleCopyLink}
        className={cn(
          'p-2 rounded-full transition-colors',
          copied
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        )}
        aria-label={copied ? 'Link copied' : 'Copy link'}
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
