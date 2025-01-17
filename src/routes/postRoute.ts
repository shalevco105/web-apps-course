import { Router } from 'express';
import {
    addPost,
    getAllPosts,
    getPostById,
    getPostsBySender,
    updatePost,
} from '../controllers/postController';
import { authenticateToken } from '../middlewares/authMiddleware';

const postRouter: Router = Router();
postRouter.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: API for managing post
 */

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Add a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - sender_id
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               sender_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       500:
 *         description: Server error
 */
postRouter.post('/', addPost);

/**
 * @swagger
 * /post/data:
 *   get:
 *     summary: Get all post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all post
 *       500:
 *         description: Server error
 */
postRouter.get('/data', getAllPosts);

/**
 * @swagger
 * /post/{post_id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
postRouter.get('/:post_id', getPostById);

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get post by sender
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *         required: true
 *         description: Sender ID to filter post
 *     responses:
 *       200:
 *         description: List of post by sender
 *       500:
 *         description: Server error
 */
postRouter.get('/', getPostsBySender);

/**
 * @swagger
 * /post/{post_id}:
 *   put:
 *     summary: Update a post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
postRouter.put('/:post_id', updatePost);

export default postRouter;
