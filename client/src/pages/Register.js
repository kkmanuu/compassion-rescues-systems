import React, { useState } from 'react';
import { TextField, Button, Container, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api'; // API call

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' // Default role is 'user'
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields based on role
    if (!credentials.username || !credentials.password || (credentials.role === 'admin' && !credentials.email)) {
      setError("All required fields must be filled.");
      return;
    }

    try {
      const response = await register(credentials);
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>Register</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />

        {/* Email Field (Only for Admins) */}
        {credentials.role === 'admin' && (
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          />
        )}

        {/* Password Field */}
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />

        {/* Role Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={credentials.role}
            onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
        <Button onClick={() => navigate('/login')} variant="text" fullWidth sx={{ mt: 1 }}>
          Already have an account? Login
        </Button>
      </form>
    </Container>
  );
};

export default Register;
