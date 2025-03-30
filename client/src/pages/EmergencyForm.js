import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import navigation
import { createCase } from '../services/api';

const EmergencyForm = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', age: '', gender: '',
    location: '', case_type: '', description: '', severity: 'high'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createCase(formData);
      alert(`Emergency request sent successfully. Case ID: ${response.data.caseId}`);
      setFormData({ ...formData, description: '' });

      // Navigate to Report page after submission
      navigate('/report');
    } catch (error) {
      console.error('Error submitting case:', error.response?.data || error.message);
      alert('Error submitting case: ' + (error.response?.data.message || 'Unknown error'));
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Emergency Help Request</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" fullWidth margin="normal" 
          value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <TextField label="Phone" fullWidth margin="normal"
          value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        <TextField label="Email" fullWidth margin="normal"
          value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <TextField label="Age" type="number" fullWidth margin="normal"
          value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
        <TextField label="Gender" fullWidth margin="normal"
          value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
        <TextField label="Location" fullWidth margin="normal"
          value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
        <TextField label="Case Type" fullWidth margin="normal"
          value={formData.case_type} onChange={(e) => setFormData({ ...formData, case_type: e.target.value })} />
        <TextField label="Description" multiline rows={4} fullWidth margin="normal"
          value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        <Button type="submit" variant="contained" color="error" fullWidth>
          Send Emergency Request
        </Button>
      </form>
    </Container>
  );
};

export default EmergencyForm;
