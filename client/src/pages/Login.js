import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    identifier: '', // Can be email (admin) or username (user)
    password: '',
    role: '' // Will be set dynamically
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine role based on input
    const userRole = credentials.identifier.includes('@') ? 'admin' : 'user';

    try {
      const response = await login({
        identifier: credentials.identifier,
        password: credentials.password,
        role: userRole
      });

      // Store token & role
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email or Username"
          fullWidth
          margin="normal"
          value={credentials.identifier}
          onChange={(e) => setCredentials({ ...credentials, identifier: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
