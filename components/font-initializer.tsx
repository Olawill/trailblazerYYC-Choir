"use client";

import { useFontStore } from "@/store/font-store";
import { useEffect } from "react";

export const FontInitializer = () => {
  const setHydrated = useFontStore((state) => state.setHydrated);

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);
  return null;
};
