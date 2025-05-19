import { Outlet } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
export default function AppLayout() {
  return (
    <div>
      <AppNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
