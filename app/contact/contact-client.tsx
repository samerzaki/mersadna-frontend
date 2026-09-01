'use client';

import { FormEvent, useCallback, useState } from 'react';
import { Facebook, Instagram, Linkedin, Mail, Send, Twitter } from 'lucide-react';
import { Turnstile } from '@/components/auth/turnstile';
import { API_BASE_URL } from '@/lib/constants';
import { SEO_CONFIG } from '@/lib/seo-config';

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
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold text-primary">فريق مرصادنا</p>
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">اتصل بنا</h1>
        <p className="text-lg text-muted-foreground">أرسل استفسارك أو اقتراحك، وسنراجع رسالتك في أقرب وقت.</p>
      </header>
      <div className="mb-8 rounded-2xl border bg-card p-6"><div className="flex items-start gap-3"><Mail className="mt-1 h-5 w-5 text-primary" /><div><h2 className="font-semibold">البريد الإلكتروني</h2><a href="mailto:info@mersadna.com" className="mt-1 inline-block text-primary hover:underline">info@mersadna.com</a></div></div></div>
      <form onSubmit={handleSubmit} className="rounded-2xl border bg-card p-6 md:p-8">
        <h2 className="mb-6 text-2xl font-semibold">أرسل لنا رسالة</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">الاسم الأول<input required name="first_name" autoComplete="given-name" className="rounded-md border bg-background px-4 py-2.5" /></label>
          <label className="grid gap-2 text-sm font-medium">اسم العائلة<input required name="last_name" autoComplete="family-name" className="rounded-md border bg-background px-4 py-2.5" /></label>
          <label className="grid gap-2 text-sm font-medium">البريد الإلكتروني<input required name="email" type="email" autoComplete="email" className="rounded-md border bg-background px-4 py-2.5" /></label>
        </div>
        <label className="mt-4 grid gap-2 text-sm font-medium">الموضوع<input required name="subject" className="rounded-md border bg-background px-4 py-2.5" /></label>
        <label className="mt-4 grid gap-2 text-sm font-medium">الرسالة<textarea required name="message" rows={6} className="resize-y rounded-md border bg-background px-4 py-2.5" /></label>
        <div className="mt-6"><Turnstile key={turnstileKey} onVerify={handleTurnstileVerify} onExpire={handleTurnstileExpire} language="ar" /></div>
        <button disabled={status === 'submitting'} className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-60"><Send className="h-4 w-4" />{status === 'submitting' ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}</button>
        {message && <p role="status" className={`mt-4 text-sm ${status === 'success' ? 'text-emerald-700' : 'text-destructive'}`}>{message}</p>}
      </form>
      {socialLinks.length > 0 && <section className="mt-8 text-center"><h2 className="mb-4 text-lg font-semibold">تابع مرصادنا</h2><div className="flex justify-center gap-3">{socialLinks.map(({ label, url, icon: Icon }) => <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="rounded-full border p-3 hover:bg-accent"><Icon className="h-5 w-5" /></a>)}</div></section>}
    </div>
  );
}
