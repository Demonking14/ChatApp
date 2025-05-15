import express from 'express';
import {signUp , login , logout , onBoarding} from '../controllers/auth.controller.js';
import { verifyUser } from '../middlewares/verifyUser.js';

const routes = express.Router();

routes.post('/signup' , signUp);
routes.post('/login' , login);
routes.post('/logout' , verifyUser, logout);
routes.patch('/onBoard' , verifyUser, onBoarding);

routes.get('/me' , verifyUser , (req , res)=>{
    
    res.status(200).json({
        success:true,
        user:req.user,
        message:'User fetched successfully'
    })
})
export default routes;