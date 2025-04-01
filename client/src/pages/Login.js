// src/pages/Login.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ 
        identifier, 
        password,
        loginType // Send login type to backend
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      
      // Redirect based on role
      if (response.data.role === 'admin') {
        navigate('/admin/dashboard'); // Redirect admin to feedback page
      } else {
        navigate('/'); // Redirect user to user dashboard
      }

      if (response.data.role === 'user') {
        navigate('/'); // Redirect user to feedback page
      } else {
        navigate('/user/dashboard'); // Redirect user to user dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">Login As</FormLabel>
          <RadioGroup
            row
            value={loginType}
            onChange={(e) => setLoginType(e.target.value)}
          >
            <FormControlLabel value="user" control={<Radio />} label="User" />
            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
          </RadioGroup>
        </FormControl>

        <TextField
          label={loginType === 'admin' ? 'Email' : 'Username'}
          fullWidth
          margin="normal"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
