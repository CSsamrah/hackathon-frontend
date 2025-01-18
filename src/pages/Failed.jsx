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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`https://glowquester-backend.vercel.app/api/failed/${studentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch assignments');
        }
        const data = await response.json();
        setAssignments(data);
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
    const courseName = assignment.courseName?.toLowerCase() || '';
    const title = assignment.title?.toLowerCase() || '';
    const searchTermLower = searchTerm.toLowerCase();
    return courseName.includes(searchTermLower) || title.includes(searchTermLower);
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 'bolder', padding: '10px 20px' }}>
        Failed Assignment
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
              <TableCell>Deadline</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.map((assignment, index) => (
              <TableRow key={assignment._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{assignment.courseName}</TableCell>
                <TableCell>{assignment.title}</TableCell>
                <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className="failed">Failed</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const Failed = () => {
  const { studentId } = useParams();
  return (
    <>
      <div className='Failed'>
        <Header className='header' />
        <AssignmentsPage studentId={studentId} />
      </div>
    </>
  );
};

export default Failed;
