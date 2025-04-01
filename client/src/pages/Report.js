import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, 
  Button, Paper, Box, CircularProgress, Divider, Stack 
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import { getReport } from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6384'];

const Report = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await getReport();
      console.log('Fetched Report:', response.data);
      setReport(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching report:', error.response?.status, error.response?.data);
      setError('Failed to load report: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) return (
    <Container sx={{ textAlign: 'center', mt: 5 }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>Loading Report...</Typography>
    </Container>
  );

  if (error) return (
    <Container sx={{ textAlign: 'center', mt: 5 }}>
      <Typography color="error" variant="h6">{error}</Typography>
      <Button onClick={fetchReport} variant="contained" color="primary" sx={{ mt: 2 }}>Retry</Button>
    </Container>
  );

  return (
    <Container sx={{ mt: 4, pb: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Case Statistics Report</Typography>
        <Button onClick={fetchReport} variant="contained" color="secondary" sx={{ borderRadius: '8px' }}>Refresh</Button>
      </Stack>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Cases by Type */}
      <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Cases by Type</Typography>
      <Paper sx={{ overflow: 'hidden', boxShadow: 3, p: 2, borderRadius: 2 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={report.caseTypes} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="case_type" tick={{ fontSize: 14 }} />
            <YAxis tick={{ fontSize: 14 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Bar dataKey="count" fill="#8884d8" barSize={40} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Cases by Location */}
      <Typography variant="h6" sx={{ mt: 4, mb: 1, fontWeight: 'bold' }}>Cases by Location</Typography>
      <Paper sx={{ overflow: 'hidden', boxShadow: 3, p: 2, borderRadius: 2 }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={report.caseLocations} dataKey="count" nameKey="location" cx="50%" cy="50%" outerRadius={120} label>
              {report.caseLocations.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
};

export default Report;