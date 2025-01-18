import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Stack,
  Typography,
  Button,
  Modal,
  Box
} from '@mui/material';

const AssignmentsWithLeaderboard = ({ studentId }) => {
  const [assignments, setAssignments] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]); // Ensure initial state is an array
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssignmentTitle, setSelectedAssignmentTitle] = useState('');

  useEffect(() => {
    if (!studentId) {
      console.error('studentId is undefined');
      return;
    }

    // Fetch assignments for the student's class
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`https://hackathon-backend-gamma.vercel.app/api/studentAssignments/${studentId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setAssignments(data);
        } else {
          console.error('Unexpected data format for assignments:', data);
          setAssignments([]);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setAssignments([]);
      }
    };

    fetchAssignments();
  }, [studentId]);

  const handleViewLeaderboard = async (assignmentId, assignmentTitle) => {
    try {
      const response = await fetch(`https://hackathon-backend-gamma.vercel.app/api/leaderboard/${assignmentId}`);
      const data = await response.json();

      // Ensure `data` is an array
      if (Array.isArray(data)) {
        setLeaderboardData(data);
      } else {
        console.error('Unexpected data format for leaderboard:', data);
        setLeaderboardData([]);
      }

      setSelectedAssignmentTitle(assignmentTitle);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboardData([]); // Reset leaderboard data in case of an error
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 'bolder', padding: '10px 20px' }}>
        Assignments LeaderBoard
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
              <TableCell>#</TableCell>
              <TableCell>Assignments</TableCell>
              <TableCell>Leaderboard</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.map((assignment, index) => (
              <TableRow key={assignment._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{assignment.title}</TableCell>
                <TableCell>
                  <Button
                    sx={{
                      background: '#5e9bc1',
                      color: 'white',
                      '&:hover': { background: '#4a8ab7', color: '#e0e0e0' },
                    }}
                    onClick={() => handleViewLeaderboard(assignment._id, assignment.title)}
                  >
                    View Leaderboard
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            padding: 2,
            backgroundColor: 'white',
            margin: 'auto',
            marginTop: '10%',
            width: '50%',
            maxHeight: '80vh',
            overflow: 'auto',
          }}
        >
          <Typography variant="h6">Leaderboard for {selectedAssignmentTitle}</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Marks</TableCell>
                  <TableCell>Submission Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.studentName || 'Unknown'}</TableCell>
                      <TableCell>{entry.marks || 0}</TableCell>
                      <TableCell>
                        {entry.submissionDate
                          ? new Date(entry.submissionDate).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No leaderboard data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </div>
  );
};


const LeaderBoard = () => {
  const { studentId } = useParams();
  
  useEffect(() => {
    console.log(`Loaded Assignments component with studentId: ${studentId}`);
  }, [studentId]);

  return (
    <div className='leaderboard'>
      <Header />
      <AssignmentsWithLeaderboard studentId={studentId} />
    </div>
  );
};

export default LeaderBoard;
