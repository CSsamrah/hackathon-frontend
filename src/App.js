import './App.css';
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard';
import Submitted from './pages/Submitted';
import Failed from './pages/Failed';
import LeaderBoard from './pages/LeaderBoard';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Upload from './pages/Upload';
import AssignmentSubmission from './pages/AssignmentSubmission';
import TeacherDashboard from './pages/TeacherDashboard';
import FailedAssignments from './pages/FailedStudents';
import TeacherLeaderboard from './pages/TeacherLeaderboard';
import ProtectedRoute from './components/ProtectedRoute'; 


function App() {
  return (
    <div className="content">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard/:studentId" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/upload/:teacherId" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/submitted/:studentId" element={<ProtectedRoute><Submitted /></ProtectedRoute>} />
        <Route path="/failed/:studentId" element={<ProtectedRoute><Failed /></ProtectedRoute>} />
        <Route path="/leaderboard/:studentId" element={<ProtectedRoute><LeaderBoard /></ProtectedRoute>} />
        <Route path="/assignmentsubmission/:studentId/:assignmentId" element={<ProtectedRoute><AssignmentSubmission /></ProtectedRoute>} />
        <Route path="/teacherdashboard/:teacherId" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/failedStudents/:teacherId" element={<ProtectedRoute><FailedAssignments /></ProtectedRoute>} />
        <Route path='/teacherLeaderboard/:teacherId' element={<ProtectedRoute><TeacherLeaderboard /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

function MainApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default MainApp;
