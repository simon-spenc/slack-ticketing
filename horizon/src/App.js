import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Components/Layout';
import Home from './Components/Home';
import TicketList from './Components/TicketList';
import NewTicket from './Components/NewTicket';
import TicketItem from './Components/TicketItem';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/new-ticket" element={<NewTicket />} />
          <Route path="/ticket/:id" element={<TicketItem />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;