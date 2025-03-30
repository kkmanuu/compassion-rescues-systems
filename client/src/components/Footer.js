import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  // Hide footer on the Home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        py: 4,
        mt: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {/* Column 1 */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Compassion Rescue
            </Typography>
            <Typography variant="body2">
              Providing support for victims of gender-based violence.
            </Typography>
          </Grid>

          {/* Column 2 */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Typography variant="body2">
              <a href="/" style={{ color: '#bbb', textDecoration: 'none' }}>home</a>
            </Typography>
            <Typography variant="body2">
              <a href="/dashboard" style={{ color: '#bbb', textDecoration: 'none' }}>dashboard</a>
            </Typography>
            <Typography variant="body2">
              <a href="/Report" style={{ color: '#bbb', textDecoration: 'none' }}>report</a>
            </Typography>
            <Typography variant="body2">
              <a href="/Emergency" style={{ color: '#bbb', textDecoration: 'none' }}>EmergencyForm</a>
            </Typography>
          </Grid>

          {/* Column 3 */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography variant="body2">📍 Nairobi, Kenya</Typography>
            <Typography variant="body2">📞 +254 700 123 456</Typography>
            <Typography variant="body2">📧 info@compassionrescue.com</Typography>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: '#bbb' }}>
            &copy; {new Date().getFullYear()} Compassion Rescue. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
