import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeSwitcher = () => {
  const { currentTheme, switchTheme, themes } = useTheme();

  return (
    <div className="fixed top-8 right-8 z-50 flex gap-3">
      {Object.keys(themes).map((themeName) => (
        <motion.button
          key={themeName}
          onClick={() => switchTheme(themeName)}
          className={`w-12 h-12 rounded-full border-2 transition-all ${
            currentTheme === themeName ? 'border-white scale-110' : 'border-white/30'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: themeName === 'red' ? '#ef4444' :
                       themeName === 'blue' ? '#3b82f6' :
                       themeName === 'green' ? '#10b981' :
                       '#a855f7'
          }}
        >
          <span className="sr-only">{themeName} theme</span>
        </motion.button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;