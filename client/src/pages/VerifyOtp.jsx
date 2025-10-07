import React, { useState } from 'react'
import { post } from '../lib/api.js'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import toast from 'react-hot-toast'

const otpSchema = z.object({
  email: z.string().email('Invalid email'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

export default function VerifyOtp() {
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  async function onVerify(e) {
    e.preventDefault()
    const result = otpSchema.safeParse({ email, otp })
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
      await post('/user/verify-otp', { email, otp })
      toast.success('Email verified! You can now login.')
      navigate('/login')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function onResend() {
    try {
      await post('/user/resend-otp', { email })
      toast.success('OTP resent to your email')
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-blue-50 rounded shadow-lg border border-blue-200">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Verify Your Email</h1>
      <p className="mb-2 text-blue-700">Please enter the 6-digit OTP sent to your email address to verify your account.</p>
      <form onSubmit={onVerify} className="space-y-3">
        <input className="w-full border p-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
        <input className="w-full border p-2 tracking-widest text-lg text-center" placeholder="Enter 6-digit OTP" value={otp} onChange={e=>setOtp(e.target.value)} required maxLength={6} />
        {errors.otp && <div className="text-red-500 text-sm">{errors.otp}</div>}
        <button disabled={loading} className="w-full bg-blue-700 text-white py-2 rounded">{loading? 'Verifying...' : 'Verify'}</button>
      </form>
      <button onClick={onResend} className="mt-3 underline text-blue-700">Resend OTP</button>
    </div>
  )
}


