import React, { useState } from 'react'
import { post } from '../lib/api.js'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, 'Old password must be at least 6 characters'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
})

export default function ChangePassword() {
  const [form, setForm] = useState({ oldPassword:'', newPassword:'' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    const result = changePasswordSchema.safeParse(form)
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
      await post('/user/change-password', form)
      alert('Password changed')
      navigate('/profile')
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Change password</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Old password" type="password" value={form.oldPassword} onChange={e=>setForm(f=>({...f,oldPassword:e.target.value}))} required />
        {errors.oldPassword && <div className="text-red-500 text-sm">{errors.oldPassword}</div>}
        <input className="w-full border p-2" placeholder="New password" type="password" value={form.newPassword} onChange={e=>setForm(f=>({...f,newPassword:e.target.value}))} required />
        {errors.newPassword && <div className="text-red-500 text-sm">{errors.newPassword}</div>}
        <button disabled={loading} className="w-full bg-black text-white py-2">{loading? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  )
}


