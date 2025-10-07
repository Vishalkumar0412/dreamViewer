# DreamViewer Quick Setup

1. **Backend:**
   ```bash
   cp server/ENV_EXAMPLE.txt server/.env   # Edit .env with your MongoDB & Gmail info
   cd server
   npm install
   npm run dev
   ```

2. **Frontend:**
   ```bash
   cp client/ENV_EXAMPLE.txt client/.env   # (edit if needed)
   cd client
   npm install
   npm run dev
   ```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

**Sign up, check your email for OTP, verify, then login!**
