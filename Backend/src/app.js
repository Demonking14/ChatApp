import express from 'express';
import routes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import Userrouter from './routes/user.routes.js';
import chatRouter from './routes/chat.route.js';
import cors from 'cors';
import path from 'path';
import connect from './db/connect.js';
import dotenv from 'dotenv';
import debug from 'debug';

const app = express();


debug.enable('express:*');


app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debugging middleware




// Mount API routes
app.use('/api/v1/auth', routes);
app.use('/api/v1/user', Userrouter);
app.use('/api/v1/chat', chatRouter);





export default app;