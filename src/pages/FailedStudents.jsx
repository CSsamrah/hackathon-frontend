import React, { useState, useEffect } from 'react';
import TeacherNavbar from '../components/TeacherNavbar';
import { useParams } from 'react-router-dom';
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

const AssignmentsPageFailed = ({ teacherId }) => {
    const [assignments, setAssignments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch assignments on component mount
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const cacheBuster = new Date().getTime();
                console.log(`Fetching assignments for teacherId: ${teacherId}`);
                const response = await fetch(`https://hackathon-backend-gamma.vercel.app/api/studentsfailed/${teacherId}?cacheBuster=${cacheBuster}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setAssignments(data);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching assignments:', error);
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [teacherId]);

    // Update search term on input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter assignments and students based on search term
    const filteredAssignments = assignments.filter((assignment) => {
        const isAssignmentMatch = assignment.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const isStudentMatch = assignment.studentsNotSubmitted.some(student =>
            student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return isAssignmentMatch || isStudentMatch;
    });

    if (loading) {
        return <Typography variant="h6">Loading failed assignments...</Typography>;
    }

    if (filteredAssignments.length === 0) {
        return <Typography variant="h6">No failed assignments found</Typography>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bolder', padding: '10px 20px' }}>
                Failed Assignments
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: '#bfd3e0' }}>
                            <TableCell>#</TableCell>
                            <TableCell>Student</TableCell>
                            <TableCell>Assignment</TableCell>
                            <TableCell>Deadline</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAssignments.map((assignment, assignmentIndex) =>
                            assignment.studentsNotSubmitted.map((student, studentIndex) => (
                                <TableRow key={`${assignment.assignmentId}-${student.studentId}`}>
                                    {/* Sequential numbering based on student entries */}
                                    <TableCell>
                                        {assignmentIndex * assignment.studentsNotSubmitted.length + studentIndex + 1}
                                    </TableCell>
                                    <TableCell>{student.studentName}</TableCell>
                                    <TableCell>{assignment.assignmentTitle}</TableCell>
                                    <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <span style={{ color: 'red', fontWeight: 'bold' }}>Failed</span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

const FailedAssignments = () => {
    const { teacherId } = useParams();

    useEffect(() => {
        console.log(`Loaded FailedAssignments component with teacherId: ${teacherId}`);
    }, [teacherId]);

    return (
        <div className='FailedDashboard'>
            <TeacherNavbar />
            <AssignmentsPageFailed teacherId={teacherId} />
        </div>
    );
};

export default FailedAssignments;
