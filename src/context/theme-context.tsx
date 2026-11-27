"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "noir" | "midnight" | "ocean" | "forest" | "daylight" | "sunset";

export const themeOptions: {
  id: Theme;
  name: string;
  description: string;
  mode: "dark" | "light";
  accentColor: string;
}[] = [
  {
    id: "noir",
    name: "Noir",
    description: "A clean, minimal theme with charcoal tones.",
    mode: "dark",
    accentColor: "#b4b4bd",
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "A comfortable dark theme with purple accents.",
    mode: "dark",
    accentColor: "#a78bfa",
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "A cool dark theme inspired by the ocean.",
    mode: "dark",
    accentColor: "#38bdf8",
  },
  {
    id: "forest",
    name: "Forest",
    description: "A natural dark theme with green accents.",
    mode: "dark",
    accentColor: "#6ee7b7",
  },
  {
    id: "daylight",
    name: "Daylight",
    description: "A clean, bright theme with purple accents.",
    mode: "light",
    accentColor: "#7c3aed",
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "A warm light theme with orange accents.",
    mode: "light",
    accentColor: "#f07850",
  },
];

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "orbit_theme";

function isValidTheme(value: string | null): value is Theme {
  return themeOptions.some((option) => option.id === value);
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>("noir");

  // Restore the saved theme when the app loads.
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (isValidTheme(savedTheme)) {
      setThemeState(savedTheme);
      document.documentElement.dataset.theme = savedTheme;
    }
  }, []);

  // Update the theme and persist the selection.
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
