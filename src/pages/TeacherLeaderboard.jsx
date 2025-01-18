import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import TeacherNavbar from '../components/TeacherNavbar';

const AssignmentsWithLeaderboard = ({ teacherId }) => {
  const [assignments, setAssignments] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]); // Ensure it's an array by default
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssignmentTitle, setSelectedAssignmentTitle] = useState('');
  const [error, setError] = useState(''); // Add an error state

  useEffect(() => {
    if (!teacherId) {
      console.error('teacherId is undefined');
      return;
    }

    const fetchAssignments = async () => {
      try {
        const response = await fetch(`https://glowquester-backend.vercel.app/api/classAssignments/${teacherId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setAssignments(data);
        } else {
          throw new Error('Invalid data format for assignments');
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setError('Failed to fetch assignments. Please try again later.');
      } 
    };

    fetchAssignments();
  }, [teacherId]);

  const handleViewLeaderboard = async (assignmentId, assignmentTitle) => {
    try {
      
      const response = await fetch(`https://glowquester-backend.vercel.app/api/leaderboard/${assignmentId}`);
      const data = await response.json();

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
      setLeaderboardData([]); 
      
  }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setLeaderboardData([]); // Reset leaderboard data on modal close
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {error && <Typography color="error">{error}</Typography>}
      {
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
      }
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
          {
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
                        <TableCell>{entry.studentName}</TableCell>
                        <TableCell>{entry.marks}</TableCell>
                        <TableCell>{new Date(entry.submissionDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          }
        </Box>
      </Modal>
    </div>
  );
};


const TeacherLeaderBoard = () => {
  const { teacherId } = useParams();
  
  useEffect(() => {
    console.log(`Loaded Assignments component with teacherId: ${teacherId}`);
  }, [teacherId]);

  return (
    <div className='leaderboard'>
      <TeacherNavbar/>
      <AssignmentsWithLeaderboard teacherId={teacherId} />
    </div>
  );
};

export default TeacherLeaderBoard;
