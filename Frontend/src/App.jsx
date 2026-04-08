import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import ItemDetails from './pages/ItemDetails';
import Messages from './pages/Messages';
import Scanner from './pages/Scanner';
import QRGenerator from './pages/QRGenerator';
import FounderLogin from './pages/FounderLogin';
import FounderRegister from './pages/FounderRegister';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/founder-login" element={<FounderLogin />} />
          <Route path="/founder-register" element={<FounderRegister />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/scan" element={<Scanner />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/qr/:id" element={<QRGenerator />} />
          </Route>
        </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
