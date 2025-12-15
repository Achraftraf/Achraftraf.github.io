import '../styles/globals.css';

import Layout from '../components/Layout';
import Transition from '../components/Transition';
import { ThemeProvider } from '../context/ThemeContext';

import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  return (
    <ThemeProvider>
      <Layout>
        <AnimatePresence mode='wait'>
          <motion.div key={router.route} className='h-full'>
            <Transition />
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </Layout>
    </ThemeProvider>
  );  
}

export default MyApp;