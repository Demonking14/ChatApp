import express from 'express';
import { StreamToken } from '../controllers/chat.controller.js';
import { verifyUser } from '../middlewares/verifyUser.js';
const chatRouter = express.Router();

chatRouter.get('/streamtoken',  verifyUser , StreamToken);

export default chatRouter;
