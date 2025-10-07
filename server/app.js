import router from "./routes/index.routes.js";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import env from './config/env.js';

const app = express();


app.use(cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());



app.use('/api/v1', router);

export default app;