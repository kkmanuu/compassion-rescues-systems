import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Box, 
  CircularProgress, 
  Alert, 
  Chip, 
  Divider 
} from '@mui/material';
import { List, ListItem } from '@mui/material';
import { getCases } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await getCases();
      setCases(response.data || []);
      setError(null);
    } catch (error) {
      setError('Failed to load cases: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f4f8' }}>
        <CircularProgress size={60} sx={{ color: '#0288D1' }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ backgroundColor: '#f0f4f8', minHeight: '100vh', py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2, boxShadow: 1 }}>{error}</Alert>
        <Button 
          onClick={fetchCases} 
          variant="contained" 
          sx={{ mt: 2, backgroundColor: '#0288D1', '&:hover': { backgroundColor: '#0277BD' }, borderRadius: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container 
      sx={{ 
        backgroundColor: '#f0f4f8', // Light blue-gray background
        minHeight: '100vh', 
        py: 4, 
        px: { xs: 2, sm: 3 } // Responsive padding
      }}
    >
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4} 
        sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#01579B', // Darker blue for contrast
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          {userRole === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
        </Typography>
        <Button 
          onClick={fetchCases} 
          variant="contained" 
          sx={{ 
            backgroundColor: '#0288D1', 
            '&:hover': { backgroundColor: '#0277BD' }, 
            borderRadius: 2, 
            px: 3, 
            py: 1 
          }}
        >
          Refresh
        </Button>
      </Box>

      {cases.length === 0 ? (
        <Typography 
          variant="h6" 
          sx={{ textAlign: 'center', color: '#455A64', mt: 4 }}
        >
          No cases found
        </Typography>
      ) : (
        <List>
          {cases.map(c => (
            <ListItem 
              key={c.id} 
              sx={{ 
                mb: 3, 
                display: 'flex', 
                justifyContent: 'center' 
              }}
            >
              <Card 
                sx={{ 
                  width: '100%', 
                  maxWidth: 800, // Limit card width for readability
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                  borderRadius: 3, 
                  backgroundColor: '#ffffff', 
                  transition: 'transform 0.2s', 
                  '&:hover': { transform: 'translateY(-4px)' } 
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#01579B', 
                      fontWeight: 'medium', 
                      mb: 2 
                    }}
                  >
                    {c.victim_name} - {c.case_type}
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: '#e0e0e0' }} />
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Typography 
  variant="body2" 
  sx={{ color: '#455A64' }}
>
  <strong>Status:</strong>{' '}
  <Chip
    label={c.status.charAt(0).toUpperCase() + c.status.slice(1)}
    color={
      c.status === 'approved' ? 'success' :
      c.status === 'rejected' ? 'error' :
      'warning'
    }
    size="small"
    sx={{ 
      ml: 1, 
      fontWeight: 'medium',
      ...(c.status === 'approved' && { 
        backgroundColor: '#4CAF50', // Explicit green color
        color: 'white'
      })
    }}
  />
</Typography>
                    {c.created_at && (
                      <Typography variant="body2" sx={{ color: '#455A64' }}>
                        <strong>Created On:</strong> {new Date(c.created_at).toLocaleString()}
                      </Typography>
                    )}
                    {c.status === 'approved' && c.approved_at && (
                      <Typography variant="body2" sx={{ color: '#455A64' }}>
                        <strong>Approved On:</strong> {new Date(c.approved_at).toLocaleString()}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: '#455A64' }}>
                      <strong>Phone:</strong> {c.phone || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#455A64' }}>
                      <strong>Email:</strong> {c.email || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#455A64' }}>
                      <strong>Age:</strong> {c.age || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#455A64' }}>
                      <strong>Gender:</strong> {c.gender || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#455A64' }}>
                      <strong>Location:</strong> {c.location || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#455A64' }}>
                      <strong>Severity:</strong> {c.severity || 'N/A'}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#455A64', 
                        gridColumn: { xs: 'span 1', sm: 'span 2' } // Full width for description
                      }}
                    >
                      <strong>Description:</strong> {c.description || 'N/A'}
                    </Typography>
                  </Box>
                  {c.admin_feedback && userRole !== 'admin' && (
                    <Box sx={{ mt: 3 }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ color: '#0288D1', fontWeight: 'medium' }}
                      >
                        Admin Feedback
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ color: '#455A64', mt: 1 }}
                      >
                        {c.admin_feedback}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button 
                    onClick={() => navigate(`/case/${c.id}`)} 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: '#0288D1', 
                      '&:hover': { backgroundColor: '#0277BD' }, 
                      borderRadius: 2, 
                      px: 3, 
                      py: 1, 
                      fontWeight: 'medium' 
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Dashboard;