import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  // Background image URL (replace with your own image URL)
  const backgroundImageUrl = 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1350&q=80';

  return (
    <Box
      sx={{
        width: '100vw', // Full screen width
        height: '100vh', // Full screen height
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better text visibility
          zIndex: 1,
        },
      }}
    >
      {/* Content wrapper */}
      <Box sx={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}
        >
          Welcome to Compassion Rescue
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ maxWidth: '600px', mx: 'auto', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)' }}
        >
          Supporting victims of gender-based violence with immediate assistance and management
        </Typography>

        <Box sx={{ mt: 4 }}>
          {isAuthenticated ? (
            <>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 'medium', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)' }}
              >
               
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
                sx={{
                  m: 1,
                  px: 3,
                  py: 1.5,
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#115293' },
                  borderRadius: '20px',
                }}
              >
                View Case Dashboard
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/report')}
                sx={{
                  m: 1,
                  px: 3,
                  py: 1.5,
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#115293' },
                  borderRadius: '20px',
                }}
              >
                View Reports
              </Button>
            </>
          ) : (
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 'medium', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)' }}
            >
              Please login to manage cases
            </Typography>
          )}

          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 'medium', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)' }}
            >
              Need Help?
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => navigate('/emergency')}
              sx={{
                m: 1,
                px: 3,
                py: 1.5,
                '&:hover': { backgroundColor: '#d32f2f' },
                borderRadius: '20px',
              }}
            >
              Send Emergency Request
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
