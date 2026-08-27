'use client';

import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/language-context';
import { Language } from '@/lib/translations';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; countryCode: string }[] = [
    { code: 'ar', label: 'العربية', countryCode: 'sa' },
    { code: 'en', label: 'English', countryCode: 'gb' },
  ];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          type="button"
          onClick={(e) => e.preventDefault()}
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={(e) => {
              e.preventDefault();
              setLanguage(lang.code);
            }}
            className={`flex items-center gap-2 cursor-pointer ${
              language === lang.code ? 'bg-accent' : ''
            }`}
          >
            <img
              src={`https://flagcdn.com/w40/${lang.countryCode}.png`}
              alt={lang.label}
              className="h-4 w-5 rounded-sm object-cover"
            />
            <span>{lang.label}</span>
            {language === lang.code && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
