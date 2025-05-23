import { Outlet } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import AppFooter from '../components/AppFooter';
export default function AppLayout() {
  return (
    <div>
      <AppNavbar />
      <main>
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
