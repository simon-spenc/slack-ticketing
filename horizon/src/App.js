import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './Contexts/AuthContext';
import Login from './Components/Login';
import Layout from './Components/Layout';
import Home from './Components/Home';
import TicketList from './Components/TicketList';
import NewTicket from './Components/NewTicket';
import TicketItem from './Components/TicketItem';
import Announcements from './Components/Announcements';
import SignUp from './Components/SignUp';
import UserManagement from './Components/UserManagement';
import PrivateRoute from './Components/PrivateRoute';
import UserProfile from './Components/UserProfile';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <Router>
      <Layout>
        <div className="container">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
            <Route path="/user-management" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/tickets" element={<PrivateRoute><TicketList /></PrivateRoute>} />
            <Route path="/announcements" element={<PrivateRoute><Announcements /></PrivateRoute>} />
            <Route path="/new-ticket" element={<PrivateRoute><NewTicket /></PrivateRoute>} />
            <Route path="/ticket/:id" element={<PrivateRoute><TicketItem /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default App;