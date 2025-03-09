import type { Theme } from "@react-navigation/native";
const tintColorLight = '#111827';
const tintColorDark = '#fff';

type TColor = {
  primary: string; // main content -- buttons, views, etc
  secondary: string; // secondary content -- buttons, views, etc
  background: string; // app background styles
  border: string; // border styles
  text: string; // app text styles
  
  // tab bar styles  
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;

  destructive: string; // destructive styles
};

export const Colors: { light: TColor; dark: TColor } = {
  light: {
    primary: '#111827',
    secondary: '#e5e7eb',
    background: '#fff',
    border: '#e5e7eb',
    text: '#111827',

    tint: tintColorLight,
    tabIconDefault: '#9ca3af',
    tabIconSelected: tintColorLight,

    destructive: '#dc2626', // example destructive color
  },
  dark: {
    primary: '#fff',
    secondary: '#030712',
    background: '#111827',
    border: '#374151',
    text: '#fff',

    tint: tintColorDark,
    tabIconDefault: '#9ca3af',
    tabIconSelected: tintColorDark,

    destructive: '#ef4444', // example destructive color
  },
};

// navigation themes
export const NavLightTheme: Theme = {
  dark: false,
  colors: {
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.background,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: 'rgb(255, 59, 48)'
  }
}

export const NavDarkTheme: Theme = {
  dark: true,
  colors: {
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.secondary,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: 'rgb(255, 69, 58)'
  }
}