import React, { useEffect, useState } from 'react'
import { get } from '../lib/api.js'
import { Link, useNavigate } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    get('/user/profile')
      .then(data => setUser(data.user))
      .catch(() => navigate('/login'))
  }, [navigate])

  function logout() {
    fetch((import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1') + '/user/logout', { method:'POST', credentials:'include' })
      .finally(() => navigate('/login'))
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Welcome {user?.name || ''}</h1>
      <p className="text-gray-600 mb-6">{user?.email}</p>
      <div className="space-x-3">
        <Link to="/change-password" className="underline">Change password</Link>
        <button onClick={logout} className="underline">Logout</button>
      </div>
    </div>
  )
}


