import React from 'react'

const Login: React.FC = () => {
  const handleLogin = () => {
    // fake login for scaffold
    localStorage.setItem('token', 'dev-token')
    window.location.href = '/'
  }

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Sign in (dev)</button>
    </div>
  )
}

export default Login
