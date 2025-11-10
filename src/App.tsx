import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

const App: React.FC = () => {
  return (
    <div>
      <header style={{ padding: 12, borderBottom: '1px solid #eee' }}>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link>
      </header>
      <main style={{ padding: 12 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
