import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Compassion Rescue
        </Typography>
        {isAuthenticated ? (
          <Box>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/emergency">Emergency</Button>
            <Button color="inherit" component={Link} to="/admin/feedback">Admin Feedback</Button>
            {/* Only show Reports button if user is admin */}
            {localStorage.getItem('role') === 'admin' && (
              <Button color="inherit" component={Link} to="/admin/feedback">Admin Feedback</Button>
            )}
            {/* Only show Reports button if user is admin */}
            <Button color="inherit" component={Link} to="/report">Reports</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
            {/* Optionally keep Emergency accessible to all */}
            {/* <Button color="inherit" component={Link} to="/emergency">Emergency</Button> */}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;