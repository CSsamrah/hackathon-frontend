import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

const CourseCard = ({ courseName, batch, city, roll }) => {
  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px', borderRadius: '10px' }}>
      <Typography variant="h6" component="div">
        {courseName}
      </Typography>
      <Typography variant="body2" component="div">
        Batch: {batch}
      </Typography>
      <Typography variant="body2" component="div">
        City: {city}
      </Typography>
      <Typography variant="body2" component="div">
        Roll: {roll}
      </Typography>
      <Button variant="contained" style={{ marginTop: '10px', backgroundColor: '#e0f7fa', color: '#00796b' }}>
        Enrolled
      </Button>
    </Paper>
  );
};

export default CourseCard;
