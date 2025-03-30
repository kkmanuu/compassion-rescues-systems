import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getReport } from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6384'];

const Report = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    try {
      const response = await getReport();
      console.log('Fetched Report:', response.data);
      setReport(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching report:', error.response?.status, error.response?.data);
      setError('Failed to load report: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (error) return (
    <Container>
      <Typography color="error" variant="h6" sx={{ mt: 2 }}>{error}</Typography>
      <Button onClick={fetchReport} variant="contained" color="primary" sx={{ mt: 2 }}>Retry</Button>
    </Container>
  );

  if (!report) return <Container><Typography variant="h6">Loading...</Typography></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Case Statistics Report</Typography>
      <Button onClick={fetchReport} variant="contained" color="secondary" sx={{ mb: 3, borderRadius: '8px' }}>Refresh</Button>
      
      {/* Cases by Type */}
      <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Cases by Type</Typography>
      <Paper sx={{ overflow: 'hidden', boxShadow: 3, p: 2 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={report.caseTypes} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="case_type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Cases by Location */}
      <Typography variant="h6" sx={{ mt: 4, mb: 1, fontWeight: 'bold' }}>Cases by Location</Typography>
      <Paper sx={{ overflow: 'hidden', boxShadow: 3, p: 2 }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={report.caseLocations} dataKey="count" nameKey="location" cx="50%" cy="50%" outerRadius={120} fill="#82ca9d" label>
              {report.caseLocations.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
};

export default Report;
