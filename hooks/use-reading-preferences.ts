'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'reading-preferences';
const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 24;
const DEFAULT_FONT_SIZE = 18;
const FONT_STEP = 2;

interface ReadingPreferences {
  fontSize: number;
  isReadingMode: boolean;
}

export function useReadingPreferences() {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [isReadingMode, setIsReadingMode] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const prefs: ReadingPreferences = JSON.parse(stored);
        if (prefs.fontSize >= MIN_FONT_SIZE && prefs.fontSize <= MAX_FONT_SIZE) {
          setFontSize(prefs.fontSize);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist fontSize to localStorage
  useEffect(() => {
    try {
      const prefs: ReadingPreferences = { fontSize, isReadingMode: false };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore storage errors
    }
  }, [fontSize]);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(prev + FONT_STEP, MAX_FONT_SIZE));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(prev - FONT_STEP, MIN_FONT_SIZE));
  }, []);

  const toggleReadingMode = useCallback(() => {
    setIsReadingMode((prev) => !prev);
  }, []);

  return {
    fontSize,
    isReadingMode,
    increaseFontSize,
    decreaseFontSize,
    toggleReadingMode,
    canIncrease: fontSize < MAX_FONT_SIZE,
    canDecrease: fontSize > MIN_FONT_SIZE,
  };
}
