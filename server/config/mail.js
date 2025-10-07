import nodemailer from 'nodemailer'
import env from './env.js'
import dotenv from 'dotenv'
dotenv.config()


export const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL_ID,
    pass: env.GMAIL_APP_PASS,
  },
})

export async function sendOtpEmail({ to, otp }) {
  await mailer.sendMail({
    from: env.GMAIL_ID,
    to,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  })
}


