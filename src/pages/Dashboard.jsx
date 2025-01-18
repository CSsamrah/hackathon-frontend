import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Stack,
  Typography,
} from '@mui/material';
import { FilterList, GetApp } from '@mui/icons-material';

const AssignmentsPage = () => {
  const { studentId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`https://glowquester-backend.vercel.app/api/current/${studentId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Check if response contains a message or assignments
        if (data.message) {
          setMessage(data.message);
          setAssignments([]);
        } else {
          setAssignments(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [studentId]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 'bolder', padding: '10px 20px' }}>
        Current Assignments
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ ml: 'auto' }}
          style={{ border: 'none', padding: '10px 20px' }}
        />
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ background: '#bfd3e0' }}>
              <TableCell>Id</TableCell>
              <TableCell>Assignment</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Submit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment, index) => (
                <TableRow key={assignment._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Link to={`/assignmentsubmission/${studentId}/${assignment._id}`}>
                      <Button
                        variant="contained"
                        style={{
                          background: 'white',
                          color: '#0D6DB7',
                          border: 'none',
                          boxShadow: 'none',
                          fontWeight: 'bold',
                        }}
                      >
                        Submit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {message || 'No current assignments available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};


const Dashboard = () => {
  return (
    <div className='dashboard'>
      <Header className='header' />
      <AssignmentsPage />
    </div>
  );
};

export default Dashboard;
