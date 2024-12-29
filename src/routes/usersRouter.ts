import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    registerUser,
    loginUser,
    logoutUser,
} from '../controllers/usersController';

const usersRouter = express.Router();

usersRouter.get('/data', getAllUsers);
usersRouter.get('/:user_id', getUserById);
usersRouter.post('/', createUser);
usersRouter.put('/:user_id', updateUser);
usersRouter.delete('/:user_id', deleteUser);
usersRouter.post('/register', registerUser);
usersRouter.post('/login', loginUser);
usersRouter.post('/logout', logoutUser);
export default usersRouter;
