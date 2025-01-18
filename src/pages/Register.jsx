import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../images/logo.png';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: '',
    class: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.password2) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('https://hackathon-backend-gamma.vercel.app/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        navigate('/');
      } else {
        setError(result.msg || 'An error occurred');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <section className='register'>
      <div className='Nav-container'>
        <form className='form register-form' onSubmit={submitHandler}>
          <img src={Logo} alt="Navbar Logo" className='register-img' />
          <input
            type='text'
            placeholder='Full name'
            name='name'
            value={userData.name}
            onChange={changeInputHandler}
            autoFocus
            required
          />
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={userData.email}
            onChange={changeInputHandler}
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
          <input
            type='password'
            placeholder='Confirm password'
            name='password2'
            value={userData.password2}
            onChange={changeInputHandler}
            required
          />
          <div className="class-selection">
            <select
              name="class"
              id="class"
              value={userData.class}
              onChange={changeInputHandler}
              required
            >
              <option value="">-- Select Class --</option>
              <option value="G-10">G-10</option>
              {/* <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option> */}
            </select>
          </div>
          <div className="user-role">
            <label>
              <input
                type="radio"
                name="role"
                value="student"
                onChange={changeInputHandler}
                required
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="teacher"
                onChange={changeInputHandler}
                required
              />
              Teacher
            </label>
          </div>

          <button type='submit' className='btn register'>Register</button>
          {error && <p className='error'>{error}</p>}
        </form>
        <small>Already have an account? <Link to='/'>Sign in</Link></small>
      </div>
    </section>
  );
};

export default Register;
