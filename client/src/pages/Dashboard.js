import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Box, CircularProgress, Alert } from '@mui/material';
import { List, ListItem } from '@mui/material';
import { getCases, updateCaseStatus } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));

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

  const handleStatusUpdate = async (caseId, status) => {
    if (userRole !== 'admin') {
      setError('Only admins can update case status.');
      return;
    }
    try {
      await updateCaseStatus(caseId, status);
      setCases(cases.map(c => c.id === caseId ? { ...c, status } : c));
      setError(null);
    } catch (error) {
      setError('Status update failed: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  if (loading) return <Container><CircularProgress /></Container>;
  if (error) return (
    <Container>
      <Alert severity="error">{error}</Alert>
      <Button onClick={fetchCases} variant="contained" sx={{ mt: 2 }}>Retry</Button>
    </Container>
  );

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Case Dashboard</Typography>
        <Button onClick={fetchCases} variant="contained">Refresh</Button>
      </Box>
      {cases.length === 0 ? (
        <Typography>No cases found</Typography>
      ) : (
        <List>
          {cases.map(c => (
            <ListItem key={c.id} sx={{ mb: 2 }}>
              <Card sx={{ width: '100%', boxShadow: 3, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6">{c.victim_name} - {c.case_type}</Typography>
                  <Typography variant="body2" color="textSecondary">Status: {c.status}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button onClick={() => navigate(`/case/${c.id}`)} variant="contained" sx={{ backgroundColor: '#0288D1' }}>
                    View Details
                  </Button>
                  {userRole === 'admin' && (
                    <Box>
                      <Button onClick={() => handleStatusUpdate(c.id, 'in_progress')} disabled={c.status === 'in_progress'} variant="outlined">
                        In Progress
                      </Button>
                      <Button onClick={() => handleStatusUpdate(c.id, 'resolved')} disabled={c.status === 'resolved'} variant="contained" sx={{ backgroundColor: '#2E7D32' }}>
                        Resolve
                      </Button>
                    </Box>
                  )}
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
