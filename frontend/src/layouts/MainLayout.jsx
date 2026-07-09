import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from '../components/ScrollToTop';
import { SettingsProvider } from '../context/SettingsContext';

const MainLayout = () => (
  <SettingsProvider>
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  </SettingsProvider>
);

export default MainLayout;
