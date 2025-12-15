import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const themes = {
  crimson: {
    name: 'Crimson Blade',
    primary: '#dc2626',
    secondary: '#450a0a', 
    glow: '#ef4444',
    icon: '🔥',
    gradient: 'from-red-950/40 via-red-900/30 to-black/20',
    accent: 'text-red-400',
    glowClass: 'bg-red-500/20',
    glowOverlay: 'bg-red-500/10',
    textColor: 'text-red-100/80',
    avatar: '/av-red.png',
    size: { maxWidth: '737px', maxHeight: '678px'},
    position: {  bottom: '0',  lgBottom: '300px',lgRight: '5%' }
    },
  midnight: {
    name: 'Midnight Steel',
    primary: '#1e40af',
    secondary: '#1e3a8a',
    glow: '#60a5fa',
    icon: '💀',
    gradient: 'from-blue-950/40 via-blue-900/30 to-black/20',
    accent: 'text-blue-400',
    glowClass: 'bg-blue-500/20',
    glowOverlay: 'bg-blue-500/10',
    textColor: 'text-blue-100/80',
    avatar: '/av-blue.png',
    size: { maxWidth: '570px', maxHeight: '500px'},
    position: {  bottom: '0',  lgBottom: '300px',lgRight: '1%' }
    
  },
  shadow: {
    name: 'Shadow Realm',
    primary: '#7c3aed',
    secondary: '#2e1065',
    glow: '#a78bfa',
    icon: '🌙',
    gradient: 'from-purple-950/40 via-purple-900/30 to-black/20',
    accent: 'text-purple-400',
    glowClass: 'bg-purple-500/20',
    glowOverlay: 'bg-purple-500/10',
    textColor: 'text-purple-100/80',
    avatar: '/av-purple.png',
    size: { maxWidth: '737px', maxHeight: '678px'},
    position: {  bottom: '0',  lgBottom: '300px',lgRight: '10%' }
  },
  emerald: {
    name: 'Emerald Assassin',
    primary: '#059669',
    secondary: '#064e3b',
    glow: '#34d399',
    icon: '🗡️',
    gradient: 'from-green-950/40 via-green-900/30 to-black/20',
    accent: 'text-green-400',
    glowClass: 'bg-green-500/20',
    glowOverlay: 'bg-green-500/10',
    textColor: 'text-green-100/80',
    avatar: '/av-green.png',
    size: { maxWidth: '737px', maxHeight: '678px'},
    position: {  bottom: '0',  lgBottom: '300px',lgRight: '10%' }
  },
   obsidian: {
      name: 'Obsidian Void',
      primary: '#18181b',
      secondary: '#09090b',
      accent: '#27272a',
      glow: '#71717a',
      icon: '⚔️',
      gradient: 'linear-gradient(135deg, #000000 0%, #27272a 50%, #3f3f46 100%)',
      size: { maxWidth: '737px', maxHeight: '678px'},
      position: {  bottom: '0',  lgBottom: '300px',lgRight: '10%' }
    },
    phoenix: {
      name: 'Phoenix Fire',
      primary: '#ea580c',
      secondary: '#7c2d12',
      accent: '#9a3412',
      glow: '#fb923c',
      icon: '⚡',
      gradient: 'linear-gradient(135deg, #431407 0%, #c2410c 50%, #ea580c 100%)',
      size: { maxWidth: '737px', maxHeight: '678px'},
      position: {  bottom: '0',  lgBottom: '300px',lgRight: '10%' }
    }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('midnight');

  const switchTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, theme: themes[currentTheme], switchTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};  