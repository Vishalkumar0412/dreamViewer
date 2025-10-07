import React, { useState } from 'react'
import { post } from '../lib/api.js'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors = {}
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const data = await post('/user/login', form)
      navigate('/profile')
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required />
        {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
        <input className="w-full border p-2" placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required />
        {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
        <button disabled={loading} className="w-full bg-black text-white py-2">{loading? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link to="/signup" className="underline">Sign up</Link></p>
    </div>
  )
}


