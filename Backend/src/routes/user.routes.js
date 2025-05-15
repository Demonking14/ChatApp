import express from 'express';
import { getFriends, recCommendUser, recieveFriendRequest, sendFriendRequest, incomingRequests , ongoingRequests } from '../controllers/user.controller.js';
import { verifyUser } from '../middlewares/verifyUser.js';
const Userrouter = express.Router();

Userrouter.use(verifyUser);

Userrouter.get('/recommendUser' , recCommendUser);
Userrouter.get('/friends' , getFriends);
Userrouter.post('/send-friend-request/:id' , sendFriendRequest);
Userrouter.put('/accept-friend-request/:id' , recieveFriendRequest);
Userrouter.get('/incoming-requests' , incomingRequests);
Userrouter.get('/ongoing-requests' , ongoingRequests);

export default Userrouter;