"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";

export type ClientLanguage = "en" | "de";

const COOKIE_NAME = "googtrans";

export function useClientLanguage(defaultLanguage: ClientLanguage = "de") {
  const [language, setLanguage] = useState<ClientLanguage>(defaultLanguage);

  useEffect(() => {
    const cookieValue = parseCookies()[COOKIE_NAME];
    const nextLanguage = cookieValue?.split("/")?.[2];

    if (nextLanguage === "en" || nextLanguage === "de") {
      setLanguage(nextLanguage);
    }
  }, []);

  return language;
}
