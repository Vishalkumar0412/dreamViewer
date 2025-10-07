import {config} from 'dotenv'
config()
const env = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  GMAIL_ID: process.env.GMAIL_ID,
  GMAIL_APP_PASS: process.env.GMAIL_APP_PASS,
  DATABASE_URL: process.env.DATABASE_URL,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  COOKIE_SECURE: process.env.COOKIE_SECURE === 'true',
};

export default env;
