import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, Paper, Box, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getCaseDetails, getMessages, sendMessage, deleteCase, approveCase } from '../services/api';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

const CaseDetails = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseDetails, setCaseDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [caseRes, msgRes] = await Promise.all([
          getCaseDetails(caseId),
          getMessages(caseId),
        ]);

        setCaseDetails(caseRes.data || null);
        setMessages(msgRes.data?.messages || []);
      } catch (error) {
        console.error('Error fetching case details:', error.response?.data || error.message);
        setError('Failed to load case details. Please try again later.');
      }
    };

    fetchData();
    socket.emit('join_case', caseId);
    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off('receive_message');
  }, [caseId]);

  const handleUpdateCase = (updatedData) => {
    setCaseDetails((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const messageData = {
        caseId,
        senderType: userRole,
        message: newMessage,
      };
      await sendMessage(messageData);
      socket.emit('send_message', messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      setError('Failed to send message.');
    }
  };

  const handleDeleteCase = async () => {
    if (!window.confirm('Are you sure you want to delete this case? This action cannot be undone.')) return;

    try {
      await deleteCase(caseId);
      alert('Case deleted successfully.');
      navigate('/cases');
    } catch (error) {
      console.error('Error deleting case:', error.response?.data || error.message);
      setError('Failed to delete case.');
    }
  };

  const handleApproveCase = async (isApproved) => {
    try {
      const requestData = {
        approved: isApproved,
        feedback: feedbackText || '',
      };
      await approveCase(caseId, requestData);
      setCaseDetails((prev) => ({
        ...prev,
        status: isApproved ? 'approved' : 'rejected',
        admin_feedback: feedbackText,
        approved_at: isApproved ? new Date().toISOString() : null,
      }));
      setFeedbackText('');
      setError(null);
    } catch (error) {
      console.error('Error approving/rejecting case:', error.response?.data || error.message);
      setError('Failed to update case status.');
    }
  };

  if (!caseDetails && !error) {
    return <Container><Typography>Loading...</Typography></Container>;
  }

  if (error) {
    return <Container><Typography color="error">{error}</Typography></Container>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Case Details</Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography><strong>Name:</strong> {caseDetails.victim_name}</Typography>
        <Typography><strong>Type:</strong> {caseDetails.case_type}</Typography>
        <Typography><strong>Status:</strong> 
          <Chip 
            label={caseDetails.status.charAt(0).toUpperCase() + caseDetails.status.slice(1)} 
            color={caseDetails.status === 'approved' ? 'success' : 
                   caseDetails.status === 'rejected' ? 'error' : 'warning'} 
            size="small" 
            sx={{ ml: 1 }} 
          />
        </Typography>
        {caseDetails.created_at && (
          <Typography><strong>Created On:</strong> {new Date(caseDetails.created_at).toLocaleString()}</Typography>
        )}
        {caseDetails.status === 'approved' && caseDetails.approved_at && (
          <Typography><strong>Approved On:</strong> {new Date(caseDetails.approved_at).toLocaleString()}</Typography>
        )}
        <Typography><strong>Phone:</strong> {caseDetails.phone || 'N/A'}</Typography>
        <Typography><strong>Email:</strong> {caseDetails.email || 'N/A'}</Typography>
        <Typography><strong>Age:</strong> {caseDetails.age || 'N/A'}</Typography>
        <Typography><strong>Gender:</strong> {caseDetails.gender || 'N/A'}</Typography>
        <Typography><strong>Location:</strong> {caseDetails.location || 'N/A'}</Typography>
        <Typography><strong>Severity:</strong> {caseDetails.severity || 'N/A'}</Typography>
        <Typography><strong>Description:</strong> {caseDetails.description}</Typography>
        {caseDetails.admin_feedback && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" color="primary">Admin Feedback:</Typography>
            <Typography>{caseDetails.admin_feedback}</Typography>
          </Box>
        )}
      </Paper>

      {userRole === 'admin' && (
        <>
          {caseDetails.status === 'pending' && (
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Admin Feedback (optional)"
                multiline
                rows={3}
                fullWidth
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="success" 
                  onClick={() => handleApproveCase(true)}
                >
                  Approve
                </Button>
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={() => handleApproveCase(false)}
                >
                  Reject
                </Button>
              </Box>
            </Box>
          )}

          <Button 
            onClick={() => handleUpdateCase({ status: 'Updated', description: 'Case details modified' })} 
            variant="contained" 
            color="secondary"
          >
            Update Case
          </Button>

          <Button 
            onClick={handleDeleteCase} 
            variant="contained" 
            color="error" 
            sx={{ ml: 2 }}
          >
            Delete Case
          </Button>
        </>
      )}

      <Typography variant="h6" sx={{ mt: 2 }}></Typography>
      <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <Paper sx={{ p: 1.5, bgcolor: msg.sender_type === 'admin' ? 'lightblue' : 'lightgray', width: '100%' }}>
              <Typography variant="body2">
                <strong>[{msg.sender_type}]</strong> {msg.message}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(msg.created_at).toLocaleString()}
              </Typography>
            </Paper>
          </ListItem>
        ))}
      </List>

      {/* <TextField
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        fullWidth
        margin="normal"
        label="Type your message..."
      />
      <Button onClick={handleSendMessage} variant="contained">Send</Button> */}
    </Container>
  );
};

export default CaseDetails;