import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Logo from '../images/logo.png';
import { FaBars } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const TeacherNavbar = ({ name }) => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [currentTeacherName, setCurrentTeacherName] = useState(name);

  useEffect(() => {
    setCurrentTeacherName(name);
    const handleResize = () => {
      setIsNavShowing(window.innerWidth > 800);
      setIsMobile(window.innerWidth < 800);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [name]);

  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavShowing(false);
    } else {
      setIsNavShowing(true);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('No token found. Please log in again.');
      navigate('/');
      return;
    }

    try {
      const response = await fetch('https://hackathon-backend-gamma.vercel.app/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/');
        window.history.pushState(null, '', window.location.href);
        window.onpopstate = function () {
          navigate('/');
        };
      } else {
        const result = await response.json();
        console.error('Logout failed:', result.message);
        alert(`Logout failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during logout. Please try again later.');
    }
  };

  const avatarInitial = currentTeacherName ? currentTeacherName.charAt(0).toUpperCase() : '';

  return (
    <div className='Nav-container nav_container'>
      <Link to={`/teacherdashboard/${teacherId}`} className="nav_logo" onClick={closeNavHandler}>
        <img src={Logo} alt="Navbar Logo" />
      </Link>
      {isNavShowing && (
        <ul className='nav_menu'>
          <li><Link to={`/teacherdashboard/${teacherId}`} onClick={closeNavHandler}>Submitted</Link></li>
          <li><Link to={`/failedStudents/${teacherId}`} onClick={closeNavHandler}>Failed</Link></li>
          <li><Link to={`/teacherleaderboard/${teacherId}`} onClick={closeNavHandler}>Leaderboard</Link></li>
          <li><Link to={`/upload/${teacherId}`} onClick={closeNavHandler}>Upload</Link></li>
          {isMobile && (
            <li><Link to="#" onClick={handleLogout}>Logout</Link></li>
          )}
          <li className='profile_avatar'>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar>{avatarInitial}</Avatar>
              <div className='selectClass'>
                <IconButton
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            </Stack>
          </li>
        </ul>
      )}
      <button className='nav_toggle-btn' onClick={() => setIsNavShowing(!isNavShowing)}>
        {isNavShowing ? <AiOutlineClose /> : <FaBars />}
      </button>
    </div>
  );
};

export default TeacherNavbar;
