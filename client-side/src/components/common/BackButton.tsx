import { ArrowBack } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, useTheme } from '@mui/material';

export default function BackButton() {
  const theme = useTheme();

  return (
    <Box
      component={RouterLink}
      to="/blogs"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        color: theme.palette.text.secondary,
        textDecoration: 'none',
        transition: 'color 0.2s',
        '&:hover': {
          color: theme.palette.primary.main,
        },
      }}
    >
      <ArrowBack fontSize="small" />
      <Typography variant="body2">Back to blogs</Typography>
    </Box>
  );
}
