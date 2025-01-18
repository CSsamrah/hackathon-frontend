import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LinkIcon from '@mui/icons-material/Link';
import './fileLinkUploader.css';

export default function FileLinkUploader({ handleFileChange }) {
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [link, setLink] = useState('');

    const handleLinkClick = () => {
        setShowLinkInput(!showLinkInput);
    };

    const handleLinkChange = (event) => {
        setLink(event.target.value);
    };

    return (
        <div className="fileLinkUploader">
            <Box className="uploadContainer">
                <Button
                    variant="contained"
                    component="label"
                    className="uploadButton"
                >
                    <AttachFileIcon />
                    Upload
                    <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
            </Box>
            <Box className="linkContainer">
                <IconButton onClick={handleLinkClick} className="linkIcon">
                    <LinkIcon />
                </IconButton>
                {showLinkInput && (
                    <TextField
                        value={link}
                        onChange={handleLinkChange}
                        placeholder="Enter URL"
                        variant="outlined"
                        className="linkInput"
                    />
                )}
            </Box>
        </div>
    );
}
