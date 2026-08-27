"use client";

import { useState, useCallback } from "react";
import { PhoneInput as IntlPhoneInput, getActiveFormattingMask } from "react-international-phone";
import type { ParsedCountry } from "react-international-phone";
import "react-international-phone/style.css";
import "./phone-input.css";
import { cn } from "@/lib/utils";

export interface PhoneInputValue {
  /** Phone number in E.164 format (e.g., +201234567890) */
  phone: string;
  /** Whether the phone number is valid (correct length for the country) */
  isValid: boolean;
  /** The selected country object */
  country: ParsedCountry | null;
  /** Formatted input value displayed to user */
  inputValue: string;
}

interface PhoneInputProps {
  /** Current phone value in E.164 format */
  value?: string;
  /** Called when the phone value changes */
  onChange?: (data: PhoneInputValue) => void;
  /** Default country ISO2 code */
  defaultCountry?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Auto focus */
  autoFocus?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Additional className for container */
  className?: string;
  /** Show validation error styling */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
}

/**
 * Known phone number lengths (digits after dial code) per country.
 * Used when react-international-phone doesn't provide a country-specific mask.
 */
const COUNTRY_PHONE_LENGTHS: Record<string, number | number[]> = {
  eg: 10, // Egypt: +20 followed by 10 digits
  jo: 9,  // Jordan: +962 followed by 9 digits
  iq: 10, // Iraq: +964 followed by 10 digits
  sy: 9,  // Syria: +963 followed by 9 digits
  ly: 9,  // Libya: +218 followed by 9 digits
  sd: 9,  // Sudan: +249 followed by 9 digits
  ye: 9,  // Yemen: +967 followed by 9 digits
  dz: 9,  // Algeria: +213 followed by 9 digits
  tn: 8,  // Tunisia: +216 followed by 8 digits
  ma: 9,  // Morocco: +212 followed by 9 digits
  ps: [9, 10], // Palestine: +970 followed by 9-10 digits
};

/** Minimum phone digits (after dial code) to consider any number potentially valid */
const MIN_PHONE_DIGITS = 7;

/**
 * Validates phone number length against country mask or known lengths.
 */
function validatePhoneLength(phone: string, country: ParsedCountry): boolean {
  if (!phone || !country) return false;

  const dialCode = country.dialCode;
  const phoneWithoutPrefix = phone.startsWith("+") ? phone.slice(1) : phone;
  const phoneWithoutDialCode = phoneWithoutPrefix.startsWith(dialCode)
    ? phoneWithoutPrefix.slice(dialCode.length)
    : phoneWithoutPrefix;

  const actualDigits = phoneWithoutDialCode.replace(/\D/g, "").length;
  if (actualDigits === 0) return false;

  // Get the expected mask for this country
  const mask = getActiveFormattingMask({ phone, country });

  // Check if country has a specific mask (not the default 12-dot fallback)
  const isDefaultMask = !country.format;

  if (!isDefaultMask && mask) {
    // Country has a specific mask — use it
    const expectedDigits = (mask.match(/\./g) || []).length;
    return actualDigits >= expectedDigits;
  }

  // No specific mask — use known lengths or minimum threshold
  const knownLength = COUNTRY_PHONE_LENGTHS[country.iso2];
  if (knownLength) {
    if (Array.isArray(knownLength)) {
      return actualDigits >= knownLength[0] && actualDigits <= knownLength[1];
    }
    return actualDigits === knownLength;
  }

  // Fallback: any number with at least MIN_PHONE_DIGITS digits is considered valid
  return actualDigits >= MIN_PHONE_DIGITS;
}

export function PhoneInputField({
  value = "",
  onChange,
  defaultCountry = "eg",
  disabled = false,
  autoFocus = false,
  placeholder,
  className,
  error = false,
  errorMessage,
}: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback(
    (phone: string, meta: { country: ParsedCountry; inputValue: string }) => {
      const isValid = validatePhoneLength(phone, meta.country);

      onChange?.({
        phone,
        isValid,
        country: meta.country,
        inputValue: meta.inputValue,
      });
    },
    [onChange]
  );

  return (
    <div className={cn("space-y-1.5", className)}>
      <div
        className={cn(
          "phone-input-wrapper",
          isFocused && "phone-input-focused",
          error && "phone-input-error",
          disabled && "phone-input-disabled"
        )}
      >
        <IntlPhoneInput
          defaultCountry={defaultCountry}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder={placeholder}
          preferredCountries={["eg", "sa", "ae", "kw", "qa", "bh", "om", "iq", "jo", "lb", "ps", "sy"]}
          forceDialCode
          inputClassName="phone-input-field"
          className="phone-input-container"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      {errorMessage && (
        <p className="text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
