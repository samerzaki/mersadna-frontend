'use client';

import { useLanguage } from '@/contexts/language-context';
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          {isRTL ? 'اتصل بنا' : 'Contact Us'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isRTL
            ? 'نحن هنا للمساعدة والإجابة على استفساراتك'
            : "We're here to help and answer your questions"}
        </p>
      </div>

      {/* Contact Methods */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {/* Email */}
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-500">
              <Mail className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">
              {isRTL ? 'البريد الإلكتروني' : 'Email'}
            </h3>
          </div>
          <p className="mb-2 text-muted-foreground">
            {isRTL
              ? 'راسلنا عبر البريد الإلكتروني:'
              : 'Send us an email:'}
          </p>
          <a
            href="mailto:info@nezzel.com"
            className="text-gold-500 underline-offset-4 hover:underline"
          >
            info@nezzel.com
          </a>
        </div>

        {/* Support */}
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-1">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">
              {isRTL ? 'الدعم الفني' : 'Technical Support'}
            </h3>
          </div>
          <p className="mb-2 text-muted-foreground">
            {isRTL
              ? 'للمساعدة التقنية والدعم:'
              : 'For technical help and support:'}
          </p>
          <a
            href="mailto:support@nezzel.com"
            className="text-gold-500 underline-offset-4 hover:underline"
          >
            support@nezzel.com
          </a>
        </div>

        {/* Phone */}
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-2">
              <Phone className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">
              {isRTL ? 'الهاتف' : 'Phone'}
            </h3>
          </div>
          <p className="text-muted-foreground">
            {isRTL ? 'قريباً' : 'Coming soon'}
          </p>
        </div>

        {/* Location */}
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-4">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">
              {isRTL ? 'الموقع' : 'Location'}
            </h3>
          </div>
          <p className="text-muted-foreground">
            {isRTL ? 'القاهرة، مصر' : 'Cairo, Egypt'}
          </p>
        </div>
      </div>

      {/* Contact Form Placeholder */}
      <div className="rounded-lg border bg-card p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          {isRTL ? 'أرسل لنا رسالة' : 'Send us a message'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              {isRTL ? 'الاسم' : 'Name'}
            </label>
            <input
              type="text"
              className="w-full rounded-md border bg-background px-4 py-2 text-foreground"
              placeholder={isRTL ? 'أدخل اسمك' : 'Enter your name'}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {isRTL ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <input
              type="email"
              className="w-full rounded-md border bg-background px-4 py-2 text-foreground"
              placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {isRTL ? 'الموضوع' : 'Subject'}
            </label>
            <input
              type="text"
              className="w-full rounded-md border bg-background px-4 py-2 text-foreground"
              placeholder={isRTL ? 'أدخل الموضوع' : 'Enter subject'}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {isRTL ? 'الرسالة' : 'Message'}
            </label>
            <textarea
              rows={5}
              className="w-full rounded-md border bg-background px-4 py-2 text-foreground"
              placeholder={isRTL ? 'أدخل رسالتك' : 'Enter your message'}
            />
          </div>

          <button className="w-full rounded-md bg-gold-500 px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-gold-600">
            {isRTL ? 'إرسال' : 'Send'}
          </button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {isRTL
            ? '* هذا النموذج تحت الإنشاء. يرجى استخدام البريد الإلكتروني للتواصل حالياً.'
            : '* This form is under construction. Please use email for contact currently.'}
        </p>
      </div>

      {/* Social Links */}
      <div className="mt-8 text-center">
        <p className="mb-4 text-muted-foreground">
          {isRTL ? 'تابعنا على وسائل التواصل الاجتماعي:' : 'Follow us on social media:'}
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://twitter.com/nezzelgold"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-500 underline-offset-4 hover:underline"
          >
            Twitter
          </a>
          <a
            href="https://facebook.com/nezzelgold"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-500 underline-offset-4 hover:underline"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com/nezzelgold"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-500 underline-offset-4 hover:underline"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
