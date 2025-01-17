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
 *   name: Posts
 *   description: API for managing posts
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Add a new post
 *     tags: [Posts]
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
 * /posts/data:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all posts
 *       500:
 *         description: Server error
 */
postRouter.get('/data', getAllPosts);

/**
 * @swagger
 * /posts/{post_id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
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
 * /posts:
 *   get:
 *     summary: Get posts by sender
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *         required: true
 *         description: Sender ID to filter posts
 *     responses:
 *       200:
 *         description: List of posts by sender
 *       500:
 *         description: Server error
 */
postRouter.get('/', getPostsBySender);

/**
 * @swagger
 * /posts/{post_id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
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
