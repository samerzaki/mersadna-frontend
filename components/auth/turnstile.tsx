"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  language?: "ar" | "en";
}

const SCRIPT_ID = "cloudflare-turnstile-script";
const DEVELOPMENT_SITE_KEY = "1x00000000000000000000AA";

export function Turnstile({ onVerify, onExpire, language = "ar" }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const [loadError, setLoadError] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    (process.env.NODE_ENV === "development" ? DEVELOPMENT_SITE_KEY : "");

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    const render = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "auto",
        language,
        callback: onVerify,
        "expired-callback": onExpire,
        "error-callback": () => setLoadError(true),
      });
    };

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (window.turnstile) {
      render();
    } else if (existingScript) {
      existingScript.addEventListener("load", render);
      existingScript.addEventListener("error", () => setLoadError(true));
    } else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", render);
      script.addEventListener("error", () => setLoadError(true));
      document.head.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = undefined;
    };
  }, [language, onExpire, onVerify, siteKey]);

  if (!siteKey) {
    return <p className="text-sm text-red-600 dark:text-red-400">Cloudflare Turnstile is not configured.</p>;
  }

  if (loadError) {
    return <p className="text-sm text-red-600 dark:text-red-400">Unable to load the security check. Please refresh and try again.</p>;
  }

  return <div ref={containerRef} className="flex justify-center" />;
}
