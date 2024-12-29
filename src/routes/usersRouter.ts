import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from '../controllers/usersController';

const usersRouter = express.Router();

usersRouter.get('/data', getAllUsers);
usersRouter.get('/:user_id', getUserById);
usersRouter.post('/', createUser);
usersRouter.put('/:user_id', updateUser);
usersRouter.delete('/:user_id', deleteUser);

export default usersRouter;
