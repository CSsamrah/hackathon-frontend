import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TeacherNavbar from '../components/TeacherNavbar';
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

const AssignmentsPage = ({ teacherId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`https://glowquester-backend.vercel.app/api/studentsSubmitted/${teacherId}`);
        const result = await response.json();

        if (response.ok) {
          setAssignments(result);
        } else {
          setError(result.message || 'Failed to fetch assignments');
        }
      } catch (error) {
        setError('An unexpected error occurred.');
      }
    };

    fetchAssignments();
  }, [teacherId]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMarksChange = async (submissionId, value) => {
    console.log("Updating marks for ID:", submissionId); // Debugging log
    try {
      const response = await fetch(`https://glowquester-backend.vercel.app/api/marks/${submissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ marks: value }),
      });

      const result = await response.json();

      if (response.ok) {
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.submissionId === submissionId ? { ...assignment, marks: value } : assignment
          )
        );
      } else {
        setError(result.message || 'Failed to update marks');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };

  const handleStatusChange = async (submissionId, value) => {
    console.log("Updating remarks for ID:", submissionId); // Debugging log
    try {
      const response = await fetch(`https://glowquester-backend.vercel.app/api/remarks/${submissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ remarks: value }),
      });

      const result = await response.json();

      if (response.ok) {
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.submissionId === submissionId ? { ...assignment, remarks: value } : assignment
          )
        );
      } else {
        setError(result.message || 'Failed to update remarks');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };

  const handleViewAssignment = async (submissionId) => {
    console.log("Viewing assignment for submission ID:", submissionId); // Debugging log
    if (!submissionId) {
      setError('Submission ID is not defined');
      return;
    }

    try {
      const response = await fetch(`https://glowquester-backend.vercel.app/api/getAssignment/${submissionId}`);
      const result = await response.json();

      if (response.ok) {
        const encodedUrl = encodeURI(result.url);
        window.open(encodedUrl, '_blank');
      } else {
        setError(result.message || 'Failed to fetch assignment URL');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bolder', padding: '10px 20px' }}>
        Submitted Assignment
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="outlined" startIcon={<FilterList />} sx={{ border: 'none', padding: '10px 20px' }}>
          Filters
        </Button>
        <Button variant="outlined" startIcon={<GetApp />} sx={{ border: 'none', padding: '10px 20px' }}>
          Export
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ ml: 'auto', padding: '10px 20px' }}
        />
      </Stack>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#bfd3e0' }}>
              <TableCell>No.</TableCell>
              <TableCell>Students</TableCell>
              <TableCell>Assignment</TableCell>
              <TableCell>Total Marks</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>View Assignment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.map((assignment,index) => (
              <TableRow key={assignment.submissionId}>
                <TableCell>{index + 1}</TableCell> 
                <TableCell>{assignment.studentName}</TableCell>
                <TableCell>{assignment.assignmentTitle}</TableCell>
                <TableCell>{assignment.totalMarks}</TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    value={assignment.marks}
                    onChange={(e) => handleMarksChange(assignment.submissionId, e.target.value)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    value={assignment.remarks}
                    onChange={(e) => handleStatusChange(assignment.submissionId, e.target.value)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    style={{ background: "white", color: "#0D6DB7", border: "none", boxShadow: "none", fontWeight: "bold" }}
                    onClick={() => handleViewAssignment(assignment.submissionId)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const TeacherDashboard = () => {
  const { teacherId } = useParams();

  return (
    <div className='TeacherDashboard'>
      <TeacherNavbar />
      <AssignmentsPage teacherId={teacherId} />
    </div>
  );
};

export default TeacherDashboard;
