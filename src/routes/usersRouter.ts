import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    logoutUser,
} from '../controllers/usersController';
import { authenticateToken } from '../middlewares/auth';

const usersRouter = express.Router();
usersRouter.use(authenticateToken);

usersRouter.get('/data', getAllUsers);
usersRouter.get('/:user_id', getUserById);
usersRouter.post('/', createUser);
usersRouter.put('/:user_id', updateUser);
usersRouter.delete('/:user_id', deleteUser);
usersRouter.post('/logout', logoutUser);
export default usersRouter;
