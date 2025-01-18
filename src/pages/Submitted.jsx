import React, { useState, useEffect } from 'react';
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
import { useParams } from 'react-router-dom';

const AssignmentsPage = ({ studentId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`https://glowquester-backend.vercel.app/api/submitted/${studentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch assignments');
        }
        const data = await response.json();
        console.log('Fetched Assignments:', data); // Inspect the structure of the data
        if (data.message) {
        setMessage(data.message);
        setAssignments([])
      } else {
        setAssignments(data);
      }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchAssignments();
    }
  }, [studentId]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const courseName = assignment.assignmentId?.courseName?.toLowerCase() || '';
    const title = assignment.assignmentId?.title?.toLowerCase() || '';
    const searchTermLower = searchTerm.toLowerCase();
    return courseName.includes(searchTermLower) || title.includes(searchTermLower);
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 'bolder', padding: '10px 20px' }}>
        Submitted Assignments
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="outlined" startIcon={<FilterList />} style={{ border: 'none', padding: '10px 20px' }}>
          Filters
        </Button>
        <Button variant="outlined" startIcon={<GetApp />} style={{ border: 'none', padding: '10px 20px' }}>
          Export
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ ml: 'auto' }}
          style={{ border: 'none', padding: '10px 20px' }} />
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ background: '#bfd3e0' }}>
              <TableCell>#</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Assignment</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>File</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment, index) => (
                <TableRow key={assignment._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{assignment.assignmentId.courseName}</TableCell>
                  <TableCell>{assignment.assignmentId.title}</TableCell>
                  <TableCell>{assignment.marks}</TableCell>
                  <TableCell>
                    <span className={assignment.status.toLowerCase()}>{assignment.status}</span>
                  </TableCell>
                  <TableCell>
                    <a href={assignment.file} target="_blank" rel="noopener noreferrer">View File</a>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {message || 'no submissions'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const Submitted = () => {
  const { studentId } = useParams();
  console.log('Student ID:', studentId); // Check if this logs the correct ID
  return (
    <>
      <div className='Submitted'>
        <Header className='header' />
        <AssignmentsPage studentId={studentId} />
      </div>
    </>
  );
};

export default Submitted;
