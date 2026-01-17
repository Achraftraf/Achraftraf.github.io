import Link from 'next/link';
import Socials from '../components/Socials';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Header = () => {
  const { theme } = useTheme();

  return (
    <header className='absolute z-30 w-full flex items-center px-6 sm:px-12 xl:px-0 h-[80px] lg:h-[100px]'>
      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row justify-between items-center py-6 lg:py-8'>
          {/* Logo - Pro & Fantastic */}
          <Link href={'/'}>
            <div className="group cursor-pointer relative py-2">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tighter flex items-center gap-2 font-mono">
                {/* Opening Bracket */}
                <span className={`text-2xl lg:text-3xl ${theme.accent} transition-transform duration-300 group-hover:-translate-x-1`}>
                  &lt;
                </span>

                {/* Name with animated gradient */}
                <span className="relative">
                  <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.brightGradient ? theme.brightGradient : 'from-white to-gray-400'} animate-text-shimmer bg-[length:200%_auto] font-extrabold tracking-tight`}>
                    zarouki achraf
                  </span>
                  {/* Underline Glow */}
                  <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r ${theme.brightGradient || 'from-blue-500 to-purple-500'} group-hover:w-full transition-all duration-500 ease-out`} />
                </span>

                {/* Closing Bracket */}
                <span className={`text-2xl lg:text-3xl ${theme.accent} transition-transform duration-300 group-hover:translate-x-1`}>
                  /&gt;
                </span>
              </h1>

              {/* Subtle ambient glow */}
              <div className={`absolute -inset-4 bg-gradient-to-r ${theme.brightGradient} rounded-full opacity-0 group-hover:opacity-15 blur-2xl transition-all duration-700 -z-10`} />
            </div>
          </Link>

          {/* Socials */}
          <Socials />
        </div>
      </div>
    </header>
  );
};

export default Header;
