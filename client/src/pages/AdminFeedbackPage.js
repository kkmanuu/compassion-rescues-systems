// src/pages/AdminFeedbackPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, Paper, Box, Chip } from '@mui/material';
import { getCases, approveCase } from '../services/api';

const AdminFeedbackPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackText, setFeedbackText] = useState({});

  useEffect(() => {
    const fetchPendingCases = async () => {
      try {
        const response = await getCases();
        const pendingCases = response.data.filter(c => c.status === 'pending');
        setCases(pendingCases);
        setError(null);
      } catch (error) {
        setError('Failed to load cases: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCases();
  }, []);

  // src/pages/AdminFeedbackPage.js
const handleApprove = async (caseId, isApproved) => {
  try {
    const requestData = {
      approved: isApproved,
      feedback: feedbackText[caseId] || ""
    };

    await approveCase(caseId, requestData);
    setCases(prevCases => prevCases.filter(c => c.id !== caseId));
    setError(null);
  } catch (error) {
    console.error("Approval Error:", error.response?.data || error.message);
    setError("Failed to update case: " + (error.response?.data?.message || error.message));
  }
};

  if (loading) return <Container>Loading...</Container>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Case Approval Dashboard</Typography>
      {error && <Typography color="error">{error}</Typography>}
      
      {cases.length === 0 ? (
        <Typography>No pending cases for approval</Typography>
      ) : (
        <List>
          {cases.map(c => (
            <ListItem key={c.id} sx={{ mb: 3 }}>
              <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
                <Typography variant="h6">{c.victim_name} - {c.case_type}</Typography>
                <Typography variant="body2" color="textSecondary">Status: 
                  <Chip label={c.status} color="warning" size="small" sx={{ ml: 1 }} />
                </Typography>
                <Typography sx={{ mt: 1 }}>{c.description}</Typography>
                
                <TextField
                  label="Feedback (optional)"
                  multiline
                  rows={3}
                  fullWidth
                  sx={{ mt: 2 }}
                  value={feedbackText[c.id] || ''}
                  onChange={(e) => setFeedbackText({...feedbackText, [c.id]: e.target.value})}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="error"
                    onClick={() => handleApprove(c.id, false)}
                  >
                    Reject
                  </Button>
                  <Button 
                    variant="contained" 
                    color="success"
                    onClick={() => handleApprove(c.id, true)}
                  >
                    Approve
                  </Button>
                </Box>
              </Paper>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default AdminFeedbackPage;