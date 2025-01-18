import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../images/logo.png'

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://hackathon-backend-gamma.vercel.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        if (result.role ==="teacher") {
          navigate(`/teacherdashboard/${result.userId}`);
        } else {
          navigate(`/dashboard/${result.userId}`);
        }
      } else {
        setError(result.msg || 'An error occurred');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <section className='login'>
      <div className='Nav-container'>
        <form className='form login-form' onSubmit={submitHandler}>
          <img src={Logo} alt="Navbar Logo" className='register-img' />
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={userData.email}
            onChange={changeInputHandler}
            autoFocus
            required
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={userData.password}
            onChange={changeInputHandler}
            required
          />
          <button type='submit' className='btn login'>Login</button>
          {error && <p className='error'>{error}</p>}
        </form>
        <small>Don't have an account? <Link to='/signup'>Sign up</Link></small>
      </div>
    </section>
  )
}

export default Login
