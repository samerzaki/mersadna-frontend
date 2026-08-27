'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Country } from '@/types';
import { COUNTRIES } from '@/lib/constants';

export function CountrySwitcher() {
  const [selectedCountry, setSelectedCountry] = React.useState<Country>(COUNTRIES[1]); // Default to Egypt

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    // Store in localStorage for persistence
    localStorage.setItem('selectedCountry', country.code);
    // You can add additional logic here to update the app state/context
  };

  // Load saved country on mount
  React.useEffect(() => {
    const savedCountryCode = localStorage.getItem('selectedCountry');
    if (savedCountryCode) {
      const country = COUNTRIES.find((c) => c.code === savedCountryCode);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, []);

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
          <img
            src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
            alt={selectedCountry.nameAr}
            className="h-5 w-5 rounded-sm object-cover"
          />
          <span className="sr-only">{selectedCountry.nameAr}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {COUNTRIES.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onSelect={(e) => {
              e.preventDefault();
              handleCountryChange(country);
            }}
            className="flex items-center justify-between cursor-pointer py-2"
          >
            <div className="flex items-center gap-2">
              <img
                src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                alt={country.nameAr}
                className="h-5 w-5 rounded-sm object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{country.nameAr}</span>
                <span className="text-xs text-muted-foreground">{country.name}</span>
              </div>
            </div>
            {selectedCountry.code === country.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
