import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  useTheme,
  alpha,
  styled,
  Stack,
} from '@mui/material';
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';
import Logo from '../ui/Logo';

// Styled components
const FooterContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'classes',
})(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[50]
      : alpha(theme.palette.background.paper, 0.5),
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  width: 36,
  height: 36,
  transition: theme.transitions.create(['border-color', 'color'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

const ContactIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: '50%',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  fontSize: '0.875rem',
  transition: theme.transitions.create('color', {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const HeartIcon = styled(Heart)(({ theme }) => ({
  color: theme.palette.error.main,
  margin: '0 4px',
}));

export default function AppFooter() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Follow us on Twitter' },
    { icon: Linkedin, href: '#', label: 'Follow us on LinkedIn' },
    { icon: Github, href: '#', label: 'View our GitHub' },
  ];

  const quickLinks = [
    { title: 'About Us', to: '/about' },
    { title: 'Features', to: '/features' },
  ];

  const supportLinks = [
    { title: 'Help Center', to: '/help' },
    { title: 'Contact Us', to: '/contact' },
    { title: 'Privacy Policy', to: '/privacy' },
    { title: 'Terms of Service', to: '/terms' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'kamiliaahmed01@gmail.com' },
    { icon: Phone, text: '+20 1124529888' },
    { icon: MapPin, text: 'Cairo, Egypt' },
  ];

  const bottomLinks = [
    { title: 'Privacy', to: '/privacy' },
    { title: 'Terms', to: '/terms' },
    { title: 'Cookies', to: '/cookies' },
  ];

  return (
    <Box sx={{ backgroundColor: '#fff' }}>
      <FooterContainer as="footer">
        <Container maxWidth="lg">
          <Box sx={{ py: 6 }}>
            {/* Main Footer Content */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {/* Company Info */}
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <Stack spacing={2}>
                  <Logo />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    Building amazing experiences for our users. Connect, share,
                    and grow with our platform.
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {socialLinks.map((social, index) => (
                      <Link
                        key={index}
                        to={social.href}
                        aria-label={social.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex' }}
                      >
                        <SocialIconButton size="small">
                          <social.icon size={16} />
                        </SocialIconButton>
                      </Link>
                    ))}
                  </Stack>
                </Stack>
              </Grid>

              {/* Quick Links */}
              <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
                <Stack spacing={2}>
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{ fontSize: '1rem', fontWeight: 600 }}
                  >
                    Quick Links
                  </Typography>
                  <Stack spacing={1}>
                    {quickLinks.map((link, index) => (
                      <FooterLink key={index} to={link.to}>
                        {link.title}
                      </FooterLink>
                    ))}
                  </Stack>
                </Stack>
              </Grid>

              {/* Support */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Stack spacing={2}>
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{ fontSize: '1rem', fontWeight: 600 }}
                  >
                    Support
                  </Typography>
                  <Stack spacing={1}>
                    {supportLinks.map((link, index) => (
                      <FooterLink key={index} to={link.to}>
                        {link.title}
                      </FooterLink>
                    ))}
                  </Stack>
                </Stack>
              </Grid>

              {/* Contact Info */}
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <Stack spacing={2}>
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{ fontSize: '1rem', fontWeight: 600 }}
                  >
                    Get in Touch
                  </Typography>
                  <Stack spacing={1.5}>
                    {contactInfo.map((contact, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                      >
                        <ContactIconContainer>
                          <contact.icon
                            size={14}
                            color={theme.palette.text.secondary}
                          />
                        </ContactIconContainer>
                        <Typography variant="body2" color="text.secondary">
                          {contact.text}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>

            {/* Bottom Bar */}
            <Divider sx={{ mb: 3 }} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                © {currentYear} Bloogy Made with
                <HeartIcon size={14} fill="currentColor" />
                by Kamilia.
              </Typography>

              <Stack
                direction="row"
                spacing={3}
                sx={{
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-end' },
                }}
              >
                {bottomLinks.map((link, index) => (
                  <FooterLink key={index} to={link.to}>
                    {link.title}
                  </FooterLink>
                ))}
              </Stack>
            </Box>
          </Box>
        </Container>
      </FooterContainer>
    </Box>
  );
}
