import jwt from 'jsonwebtoken'
import env from '../config/env.js'

export const requireAuth = (req, res, next) => {
    const token = req.cookies?.token
    if (!token) {
        return res.status(401).json({ success:false, message:'Not authenticated' })
    }
    try {
        const payload = jwt.verify(token, env.JWT_SECRET)
        req.user = { userId: payload.userId }
        next()
    } catch (err) {
        return res.status(401).json({ success:false, message:'Invalid or expired token' })
    }
}


