import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import './sidebar.css';

export default function Sidebar({ handleInputChange }) {
    return (
        <div className="sidebar">
            <FormControl variant="outlined" className="form-control">
                <InputLabel>Class</InputLabel>
                <Select
                    name="classTeaches"
                    onChange={handleInputChange}
                    label="Class"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value="G-10">G-10</MenuItem>
                    <MenuItem value="G-12">G-12</MenuItem>
                </Select>
            </FormControl>

            <FormControl variant="outlined" className="form-control">
                <InputLabel>Course Name</InputLabel>
                <Select
                    name="courseName"
                    onChange={handleInputChange}
                    label="CourseName"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value="web development">web development </MenuItem>
                    <MenuItem value="Graphic designing">Graphic designing</MenuItem>
                </Select>
            </FormControl>

            <FormControl variant="outlined" className="form-control">
                <InputLabel>Points</InputLabel>
                <Select
                    name="points"
                    onChange={handleInputChange}
                    label="Points"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={200}>200</MenuItem>
                </Select>
            </FormControl>

            <FormControl variant="outlined" className="form-control">
                <TextField
                    type="date"
                    name="dueDate"
                    onChange={handleInputChange}
                    label="Due Date"
                    InputLabelProps={{ shrink: true }}
                />
            </FormControl>

            <FormControl variant="outlined" className="form-control">
                <TextField
                    name="topic"
                    placeholder="Topic"
                    id="fullWidth"
                    multiline
                    variant="outlined"
                    onChange={handleInputChange}
                >
                </TextField>
            </FormControl>
        </div>
    );
}
