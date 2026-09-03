'use client';

import { FormEvent, useCallback, useState } from 'react';
import { Facebook, Instagram, Linkedin, Mail, Send, Twitter } from 'lucide-react';
import { Turnstile } from '@/components/auth/turnstile';
import { API_BASE_URL } from '@/lib/constants';
import { SEO_CONFIG } from '@/lib/seo-config';
import { ArticleLayout } from '@/components/ui/article-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const socialLinks = [
  { label: 'X', url: SEO_CONFIG.social.x, icon: Twitter },
  { label: 'Facebook', url: SEO_CONFIG.social.facebook, icon: Facebook },
  { label: 'Instagram', url: SEO_CONFIG.social.instagram, icon: Instagram },
  { label: 'LinkedIn', url: SEO_CONFIG.social.linkedin, icon: Linkedin },
].filter((item) => /^https:\/\//.test(item.url));

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);
  const handleTurnstileVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleTurnstileExpire = useCallback(() => setTurnstileToken(''), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    if (!turnstileToken) {
      setStatus('error');
      setMessage('يرجى إكمال التحقق الأمني قبل إرسال رسالتك.');
      return;
    }
    setStatus('submitting');
    const form = new FormData(event.currentTarget);
    for (const field of ['first_name', 'last_name', 'email', 'subject', 'message']) {
      form.set(field, String(form.get(field) || '').trim());
    }
    form.set('cf-turnstile-response', turnstileToken);

    try {
      const response = await fetch(`${API_BASE_URL}/contactUs`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Accept-Language': 'ar' },
        body: form,
      });
      const body = await response.json().catch(() => null) as { message?: string; meta?: { message?: string }; success?: boolean } | null;
      if (!response.ok || body?.success === false) throw new Error(body?.meta?.message || body?.message || 'تعذر إرسال رسالتك حالياً.');
      event.currentTarget.reset();
      setTurnstileToken('');
      setTurnstileKey((key) => key + 1);
      setStatus('success');
      setMessage(body?.meta?.message || body?.message || 'تم استلام رسالتك. سنرد عليك في أقرب وقت.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'تعذر إرسال رسالتك حالياً.');
    }
  }

  return (
    <ArticleLayout eyebrow="فريق قدامك" title="اتصل بنا" lead="أرسل استفسارك أو اقتراحك، وسنراجع رسالتك في أقرب وقت.">
      <div className="flex items-start gap-3">
        <Mail className="mt-1 h-5 w-5 text-gold" />
        <div>
          <h2 className="font-heading text-[16px] font-semibold text-text">البريد الإلكتروني</h2>
          <a href="mailto:info@odamak.com" className="mt-1 inline-block text-gold hover:underline">
            info@odamak.com
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-line pt-6">
        <h2 className="mb-6 font-heading text-[18px] font-semibold text-text">أرسل لنا رسالة</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="first_name">الاسم الأول</Label>
            <Input id="first_name" required name="first_name" autoComplete="given-name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last_name">اسم العائلة</Label>
            <Input id="last_name" required name="last_name" autoComplete="family-name" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" required name="email" type="email" autoComplete="email" />
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          <Label htmlFor="subject">الموضوع</Label>
          <Input id="subject" required name="subject" />
        </div>
        <div className="mt-4 grid gap-2">
          <Label htmlFor="message">الرسالة</Label>
          <textarea
            id="message"
            required
            name="message"
            rows={6}
            className="resize-y rounded-[11px] border border-line bg-bg px-3.5 py-2.5 text-[14px] transition-colors placeholder:text-dim focus-visible:outline-none focus-visible:border-gold disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="mt-6">
          <Turnstile key={turnstileKey} onVerify={handleTurnstileVerify} onExpire={handleTurnstileExpire} language="ar" />
        </div>
        <Button type="submit" disabled={status === 'submitting'} className="mt-6">
          <Send className="h-4 w-4" />
          {status === 'submitting' ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}
        </Button>
        {message && (
          <p role="status" className={`mt-4 text-sm ${status === 'success' ? 'text-emerald-600' : 'text-destructive'}`}>
            {message}
          </p>
        )}
      </form>

      {socialLinks.length > 0 && (
        <section className="border-t border-line pt-6 text-center">
          <h2 className="mb-4 font-heading text-[16px] font-semibold text-text">تابع قدامك</h2>
          <div className="flex justify-center gap-3">
            {socialLinks.map(({ label, url, icon: Icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-full border border-line p-3 text-muted hover:border-gold hover:text-gold transition-colors"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </section>
      )}
    </ArticleLayout>
  );
}
