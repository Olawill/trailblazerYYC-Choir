import { extractFontFamily, getDefaultWeights } from "@/utils/fonts";
import { loadGoogleFont } from "@/utils/fonts/google-fonts";
import { create } from "zustand";

type ThemeMode = "dark" | "light";

interface ThemeState {
  mode: ThemeMode;
  font: string;
  setFont: (font: string) => void;

  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;

  applyTheme: () => void;

  hydrated: boolean;
  setHydrated: () => void;

  currentFonts: {
    sans: string;
  };
}

const getInitialSetting = (): {
  mode: ThemeMode;
  fonts: Record<string, string>;
} => {
  if (typeof window === "undefined") {
    return { mode: "light", fonts: { sans: "" } };
  }

  try {
    const stored = localStorage.getItem("editor-storage");

    if (!stored) return { mode: "light", fonts: { sans: "" } };

    const parsed = stored ? JSON.parse(stored) : null;
    const themeState = parsed?.state?.themeState;

    if (themeState?.mode) {
      return { mode: themeState.mode, fonts: themeState.fonts };
    }
  } catch (error) {
    console.error("Failed to parse stored theme:", error);
  }

  return { mode: "light", fonts: { sans: "" } };
};

export const useFontStore = create<ThemeState>((set, get) => {
  const { mode, fonts } = getInitialSetting();
  return {
    mode: mode || "light",
    hydrated: false,
    font: fonts.sans || "Default",
    currentFonts: {
      sans: "",
    },

    setHydrated: () => {
      set({
        mode,
        font: fonts.sans,
        hydrated: true,
      });
      get().applyTheme();
    },

    setMode: (mode) => {
      set({ mode });
      if (get().hydrated) get().applyTheme();
    },

    setFont: (font) => {
      set({ font });
      if (get().hydrated) get().applyTheme();
    },

    toggleMode: () => {
      const newMode = get().mode === "light" ? "dark" : "light";
      set({ mode: newMode });
      if (get().hydrated) get().applyTheme();
    },

    applyTheme: () => {
      if (!get().hydrated) return;

      const { mode, font } = get();
      const root = document.documentElement;

      const currentFonts = { sans: font };
      set({ currentFonts });

      Object.values(currentFonts).forEach((fontValue) => {
        if (fontValue.toLowerCase() === "default") {
          root.style.removeProperty("--font-sans");
          return;
        }
        const fontFamily = extractFontFamily(fontValue);
        if (fontFamily) {
          // Set CSS variable safely
          root.style.setProperty(
            "--font-sans",
            `${fontFamily}, ui-sans-serif, system-ui, sans-serif`,
          );
          // Load font
          const weights = getDefaultWeights(["400", "500", "600", "700"]);
          loadGoogleFont(fontFamily, weights);
        }
      });

      // Persist to localstorage
      localStorage.setItem(
        "editor-storage",
        JSON.stringify({
          state: {
            themeState: {
              mode,
              fonts: currentFonts,
            },
          },
        }),
      );
    },
  };
});
