import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      {!isLandingPage && <Footer />}
    </>
  );
}
