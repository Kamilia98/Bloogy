import { motion } from 'framer-motion';
import { Box, Stack, Typography, useTheme } from '@mui/material';

export default function Hero() {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        height: '100vh',
        position: 'relative',
        p: 6,
      }}
    >
      {/* Background div */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: "url('/images/header.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
        }}
      />
      {/* Content */}
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
            backgroundColor: theme.palette.primary.main+'50',
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
