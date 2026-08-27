"use client";

import { useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = true,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Check if OTP is complete
  useEffect(() => {
    const otp = value.join("");
    if (otp.length === length && onComplete) {
      onComplete(otp);
    }
  }, [value, length, onComplete]);

  const handleChange = (index: number, digit: string) => {
    // Only allow digits
    if (digit && !/^\d$/.test(digit)) {
      return;
    }

    const newValue = [...value];
    newValue[index] = digit;
    onChange(newValue);

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // If current is empty, focus previous
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current
        const newValue = [...value];
        newValue[index] = "";
        onChange(newValue);
      }
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Extract only digits
    const digits = pastedData.replace(/\D/g, "").slice(0, length);

    if (digits) {
      const newValue = digits.split("").concat(Array(length - digits.length).fill(""));
      onChange(newValue);

      // Focus the next empty input or the last input
      const nextIndex = Math.min(digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2" dir="ltr">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-14 text-center text-2xl font-semibold rounded-lg border-2 transition-all",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            error
              ? "border-red-500 dark:border-red-600 focus:border-red-500 focus:ring-red-500"
              : "border-slate-300 dark:border-slate-600 focus:border-amber-500 focus:ring-amber-500",
            disabled && "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800",
            value[index] && !error && "border-amber-500 dark:border-amber-600"
          )}
        />
      ))}
    </div>
  );
}
