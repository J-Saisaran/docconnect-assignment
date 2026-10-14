// DocConnect Design System tokens matching Developer Handoff & Figma Specs

export const COLORS = {
  // Primary - Teal
  primaryDark: '#027878', // Headings, accents, active tabs, brand logo
  primary: '#02B6B6', // Buttons, CTA, active states, links
  primaryLight: '#F1FAFA', // Subtle backgrounds, card hover, pill tags

  // Neutrals
  textPrimary: '#29292B', // Body text, headings
  textSecondary: '#7F7F80', // Subtitles, placeholders, timestamps
  border: '#EEEEEF', // Dividers, card borders, input borders
  backgroundLight: '#F8F8F9', // Page backgrounds, screen container
  white: '#FFFFFF', // Card backgrounds, overlays

  // Accent / Surface
  surfaceWarm: '#F0F0E8', // Card background variant, search bar fill
  surfaceCream: '#F5F5F0', // Content card fills
  cardBg: '#FFFFFF',
  
  // Status
  success: '#10B981',
  error: '#EF4444',
  requestedBg: '#F1FAFA',
  requestedBorder: '#02B6B6',
  requestedText: '#027878',
};

export const FONTS = {
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  bold: 'DMSans_700Bold',
};

export const LOGGED_IN_USER_ID = '65f000000000000000000001';

// Default backend API URL. Supports localhost for web/iOS and 10.0.2.2 for Android emulator
export const DEFAULT_API_BASE_URL = 'http://localhost:5000';
