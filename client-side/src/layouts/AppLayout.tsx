import { Outlet } from 'react-router-dom';
import AppNavbar from '../components/layout/AppNavbar';
import AppFooter from '../components/layout/AppFooter';
import { Box } from '@mui/material';
export default function AppLayout() {
  return (
    <div>
      <AppNavbar />
      <Box component={'main'}>
        <Outlet />
      </Box>
      <AppFooter />
    </div>
  );
}
