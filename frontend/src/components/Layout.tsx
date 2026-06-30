import { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import { motion } from 'framer-motion';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    window.requestAnimationFrame(resetScroll);
    const timer = window.setTimeout(resetScroll, 0);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <Header />
      {/* sitewide decorative blobs */}
      <div className="floating-blob blob-1 pointer-events-none fixed -left-40 -top-24 z-0" />
      <div className="floating-blob blob-2 pointer-events-none fixed -right-40 -bottom-24 z-0" />
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
        <Outlet />
      </motion.main>
      {!isLandingPage && <Footer />}
    </>
  );
}
