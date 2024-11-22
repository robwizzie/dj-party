import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { Home } from './pages/home';
import { PartyRoom } from './pages/party-room';
import { AuthCallback } from './pages/auth-callback';

export default function App() {
  console.log('App rendering'); // Add this to verify the component is mounting

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/party/:roomId" element={<PartyRoom />} />
          <Route path="/callback" element={<AuthCallback />} />
        </Route>
      </Routes>
    </Router>
  );
}