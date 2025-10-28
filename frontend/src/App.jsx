import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Devices from './pages/Devices'
import Locations from './pages/Locations'
import Layout from './components/Layout'
import './styles/index.css'

function App() {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const handleLogin = (newToken) => {
    setToken(newToken)
    localStorage.setItem('token', newToken)
  }

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} />
        
        <Route path="/" element={token ? <Layout onLogout={handleLogout}><Dashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={token ? <Layout onLogout={handleLogout}><Dashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/devices" element={token ? <Layout onLogout={handleLogout}><Devices /></Layout> : <Navigate to="/login" />} />
        <Route path="/locations" element={token ? <Layout onLogout={handleLogout}><Locations /></Layout> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App

