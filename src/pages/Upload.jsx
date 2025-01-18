import React, { useState } from 'react';
import Button from '@mui/material/Button';
import './upload.css';
import Description from '../components/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Sidebar from '../components/SideBar';
import { AiOutlineClose } from 'react-icons/ai';
import { Link, useParams } from 'react-router-dom';

export default function Upload() {
    const { teacherId } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        classTeaches: '',
        students: '',
        points: '',
        dueDate: '',
        topic: '',
        file: null,
        courseName: '', // Add any other fields needed
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAssign = async () => {
        setLoading(true); // Set loading state to true
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const response = await fetch('https://hackathon-backend-gamma.vercel.app/api/create', {
                method: 'POST',
                body: data,
            });

            const result = await response.json();
            setLoading(false); // Set loading state to false
            if (response.ok) {
                alert('Assignment assigned to students!');
                console.log(result);
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            setLoading(false); // Set loading state to false
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            file: file,
        }));
        setSelectedFile(file);
    };

    const handleRemoveFile = () => {
        setFormData((prevData) => ({
            ...prevData,
            file: null,
        }));
        setSelectedFile(null);
    };

    return (
        <div className="container">
            <div className="header2">
                <div className="icondiv">
                    <button className='crossBtn'>
                        <Link to={`/teacherdashboard/${teacherId}`}><AiOutlineClose /></Link>
                    </button>
                    <AssignmentIcon />
                    <h1>Assignment</h1>
                </div>
                <Button variant="contained" className="assign-button" onClick={handleAssign}>
                {loading ? 'Uploading...' : 'Assign'}
                </Button>
            </div>
            <div className="mainUpload">
                <Description 
                    handleInputChange={handleInputChange} 
                    handleFileChange={handleFileChange} 
                    selectedFile={selectedFile}
                    handleRemoveFile={handleRemoveFile}
                />
                <Sidebar handleInputChange={handleInputChange} />
            </div>
        </div>
    );
}
