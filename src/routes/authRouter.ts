import express from 'express';
import { loginUser, refreshAccessToken, registerUser } from '../controllers/authConroller';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/refresh', refreshAccessToken);
export default authRouter;
