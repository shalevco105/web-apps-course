import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/usersController';
import { authenticateToken } from '../middlewares/authMiddleware';

const usersRouter = express.Router();
usersRouter.use(authenticateToken);

/**
 * @swagger
 * /user/data:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error.
 */
usersRouter.get('/data', getAllUsers);

/**
 * @swagger
 * /user/{user_id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
usersRouter.get('/:user_id', getUserById);

/**
 * @swagger
 * /user/{user_id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
usersRouter.put('/:user_id', updateUser);

/**
 * @swagger
 * /user/{user_id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
usersRouter.delete('/:user_id', deleteUser);

export default usersRouter;
