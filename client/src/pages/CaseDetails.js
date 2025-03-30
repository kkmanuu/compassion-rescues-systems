import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getCaseDetails, getMessages, sendMessage, deleteCase } from '../services/api';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

const CaseDetails = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseDetails, setCaseDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
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
      ...updatedData, // Merge new data with existing details
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
      navigate('/cases'); // Redirect after deletion
    } catch (error) {
      console.error('Error deleting case:', error.response?.data || error.message);
      setError('Failed to delete case.');
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
      <Typography variant="h4">Case Details</Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography><strong>Name:</strong> {caseDetails.victim_name}</Typography>
        <Typography><strong>Type:</strong> {caseDetails.case_type}</Typography>
        <Typography><strong>Status:</strong> {caseDetails.status}</Typography>
        <Typography><strong>Description:</strong> {caseDetails.description}</Typography>
      </Paper>

      {userRole === 'admin' && (
        <>
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

          <Typography variant="h6" sx={{ mt: 2 }}>Messages</Typography>
          <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <ListItem key={index}>
                <Paper sx={{ p: 1.5, bgcolor: msg.sender_type === 'admin' ? 'lightblue' : 'lightgray' }}>
                  <Typography variant="body2">
                    <strong>[{msg.sender_type}]</strong> {msg.message}
                  </Typography>
                </Paper>
              </ListItem>
            ))}
          </List>

          <TextField
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            fullWidth
            margin="normal"
            label="Type your message..."
          />
          <Button onClick={handleSendMessage} variant="contained">Send</Button>
        </>
      )}
    </Container>
  );
};

export default CaseDetails;
