import { motion } from 'framer-motion';
import { Box, Stack, Typography, useTheme } from '@mui/material';

export default function Hero() {
  const theme = useTheme();

  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      sx={{
        height: '100vh',
        backgroundColor: 'white',
        backgroundImage: "url('/images/header.png')",
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'top',
        backgroundRepeat: 'no-repeat',
        p: 6,
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            maxWidth: 700,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 3,
            p: 6,
            backgroundColor: theme.palette.primary.main + '20',
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            color="text.primary"
          >
            Bloogy Platform
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to Bloogy — your space to express, explore, and inspire.
            <br />
            <br />
            Create your own blog, share your voice with the world, and connect
            with a community of readers and writers.
          </Typography>
        </Box>
      </motion.div>
    </Stack>
  );
}
