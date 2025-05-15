import express from 'express';
import routes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import Userrouter from './routes/user.routes.js';
import chatRouter from './routes/chat.route.js';
import cors from 'cors';
import path from 'path';


const app = express();


app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());






app.use('/api/v1/auth', routes);
app.use('/api/v1/user', Userrouter);
app.use('/api/v1/chat', chatRouter);

const __dirname = path.resolve();

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "../Frontend/dist")));

    app.get("*" , (req , res)=>{
        res.sendFile(path.resolve(__dirname, "../Frontend/dist/index.html"));
    })
}






export default app;