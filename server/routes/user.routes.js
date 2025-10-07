import {Router} from 'express'
import { signup, verifyOtp, resendOtp, login, getProfile, changePassword, logout } from '../controllers/user.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router=Router();

router.post('/signup', signup)
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)
router.post('/login', login)
router.get('/profile', requireAuth, getProfile)
router.post('/change-password', requireAuth, changePassword)
router.post('/logout', requireAuth, logout)

export default router;
