"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useFontStore } from "@/store/font-store";
import { extractFontFamily, getDefaultWeights } from "@/utils/fonts";
import { loadGoogleFont } from "@/utils/fonts/google-fonts";
import { useEffect } from "react";

export const DynamicFontLoader = () => {
  const { currentFonts } = useFontStore();
  const isMounted = useMounted();

  useEffect(() => {
    if (!isMounted) return;

    try {
      Object.values(currentFonts).forEach((fontValue) => {
        if (fontValue.toLowerCase() === "default") return;
        const fontFamily = extractFontFamily(fontValue);
        if (fontFamily) {
          const weights = getDefaultWeights(["400", "500", "600", "700"]);
          loadGoogleFont(fontFamily, weights);
        }
      });
    } catch (error) {
      console.warn("DynamicFontLoader: Failed to load Google fonts:", error);
    }
  }, [isMounted, currentFonts]);

  return null;
};
