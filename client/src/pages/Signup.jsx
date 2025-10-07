import React, { useState } from 'react'
import { post } from '../lib/api.js'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import toast from 'react-hot-toast'

const signupSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function Signup() {
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    const result = signupSchema.safeParse(form)
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
      await post('/user/signup', form)
      toast.success('Signup successful! Please verify your email.')
      navigate('/verify-otp', { state: { email: form.email } })
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required />
        {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
        <input className="w-full border p-2" placeholder="Email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required />
        {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
        <input className="w-full border p-2" placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required />
        {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
        <button disabled={loading} className="w-full bg-black text-white py-2">{loading? 'Signing up...' : 'Sign up'}</button>
      </form>
      <p className="mt-3 text-sm">Already have an account? <Link to="/login" className="underline">Login</Link></p>
    </div>
  )
}


