import React from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import './description.css';
import ToggleButtonsMultiple from './ToggleButton';
import FileLinkUploader from './UploadLink';
import { AiOutlineClose } from 'react-icons/ai';

export default function Description({ handleInputChange, handleFileChange, selectedFile, handleRemoveFile }) {
    return (
        <div className='mainDescription'>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                className="formBox"
            >
                <Input placeholder="Title" inputProps={{ 'aria-label': 'description' }} className="titleInput" name="title" onChange={handleInputChange} />
            </Box>
            <Box
                className="descriptionBox"
            >
                <TextField
                    fullWidth
                    placeholder="Instructions (optional)"
                    id="fullWidth"
                    multiline
                    rows={4}
                    variant="outlined"
                    className="descriptionInput"
                    name="description"
                    onChange={handleInputChange}
                />
            </Box>
            <div className="editorToolbar">
                <ToggleButtonsMultiple /> 
                <FileLinkUploader handleFileChange={handleFileChange} />
            </div>
            {selectedFile && (
                <div className="selectedFile">
                    <span>{selectedFile.name}</span>
                    <button className="removeFileButton" onClick={handleRemoveFile}>
                        <AiOutlineClose />
                    </button>
                </div>
            )}
        </div>
    );
}
