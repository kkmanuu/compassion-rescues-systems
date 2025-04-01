import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Paper 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createCase } from '../services/api';

const EmergencyForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', age: '', gender: '',
    location: '', case_type: '', description: '', severity: 'high'
  });
  const [submittedAt, setSubmittedAt] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createCase(formData);
      const createdTime = new Date(response.data.created_at).toLocaleString();
      setSubmittedAt(createdTime);
      alert(`Emergency request sent successfully. Case ID: ${response.data.caseId}\nSubmitted at: ${createdTime}`);
      setFormData({ ...formData, description: '' });
      navigate('/report'); // Redirect to user's dashboard
    } catch (error) {
      console.error('Error submitting case:', error.response?.data || error.message);
      alert('Error submitting case: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        py: 4, 
        backgroundColor: '#f5f7fa', // Light background for contrast
        minHeight: '100vh' 
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          backgroundColor: '#ffffff' 
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: '#d32f2f', // Red to emphasize emergency
            textAlign: 'center', 
            mb: 4 
          }}
        >
          Emergency Help Request
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
        >
          <TextField 
            label="Name" 
            fullWidth 
            variant="outlined"
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#d32f2f' },
                '&.Mui-focused fieldset': { borderColor: '#d32f2f' }
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#d32f2f' }
            }}
          />
          <TextField 
            label="Phone" 
            fullWidth 
            variant="outlined"
            value={formData.phone} 
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#d32f2f' },
                '&.Mui-focused fieldset': { borderColor: '#d32f2f' }
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#d32f2f' }
            }}
          />
          <TextField 
            label="Email" 
            fullWidth 
            variant="outlined"
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#d32f2f' },
                '&.Mui-focused fieldset': { borderColor: '#d32f2f' }
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#d32f2f' }
            }}
          />
          <TextField 
            label="Age" 
            type="number" 
            fullWidth 
            variant="outlined"
            value={formData.age} 
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#d32f2f' },
                '&.Mui-focused fieldset': { borderColor: '#d32f2f' }
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#d32f2f' }
            }}
          />
          <TextField 
            label="Gender" 
            fullWidth 
            variant="outlined"
            value={formData.gender} 
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#d32f2f' },
                '&.Mui-focused fieldset': { borderColor: '#d32f2f' }
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#d32f2f' }
            }}
          />
          <TextField 
            label="Location" 
            fullWidth 
            variant="outlined"
            value={formData.location} 
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#d32f2f' },
                '&.Mui-focused fieldset': { borderColor: '#d32f2f' }
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#d32f2f' }
            }}
          />
          <TextField 
            label="Case Type" 
            fullWidth 
            variant="outlined"
            value={formData.case_type} 
            onChange={(e) => setFormData({ ...formData, case_type: e.target.value })}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#d32f2f' },
                '&.Mui-focused fieldset': { borderColor: '#d32f2f' }
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#d32f2f' }
            }}
          />
          <TextField 
            label="Description" 
            multiline 
            rows={4} 
            fullWidth 
            variant="outlined"
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#d32f2f' },
                '&.Mui-focused fieldset': { borderColor: '#d32f2f' }
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#d32f2f' }
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="error" 
            fullWidth
            sx={{ 
              mt: 2, 
              py: 1.5, 
              borderRadius: 2, 
              fontWeight: 'bold', 
              textTransform: 'uppercase', 
              backgroundColor: '#d32f2f', 
              '&:hover': { backgroundColor: '#b71c1c' } 
            }}
          >
            Send Emergency Request
          </Button>
        </Box>

        {submittedAt && (
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 3, 
              textAlign: 'center', 
              color: '#455a64', 
              fontStyle: 'italic' 
            }}
          >
            <strong>Submitted At:</strong> {submittedAt}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default EmergencyForm;