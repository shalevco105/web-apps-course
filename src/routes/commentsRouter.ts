import express from 'express';
import {
    createComment,
    getAllComments,
    getCommentById,
    getCommentsByPostId,
    updateComment,
} from '../controllers/commentsController';
import { authenticateToken } from '../middlewares/authMiddleware';

const commentsRouter = express.Router();
commentsRouter.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - message
 *         - sender_id
 *         - post_id
 *       properties:
 *         message:
 *           type: string
 *           description: The content of the comment
 *         sender_id:
 *           type: string
 *           description: The ID of the user who sent the comment
 *         post_id:
 *           type: string
 *           description: The ID of the post the comment belongs to
 *     CommentInput:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: The content of the comment
 *         sender_id:
 *           type: string
 *           description: The ID of the user who sent the comment (optional)
 *         post_id:
 *           type: string
 *           description: The ID of the post the comment belongs to
 */

/**
 * @swagger
 * /comments/data:
 *   get:
 *     summary: Get all comments or filter by post ID
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: post_id
 *         schema:
 *           type: string
 *         description: Filter comments by post ID
 *     responses:
 *       200:
 *         description: List of comments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request.
 */
commentsRouter.get('/data', getAllComments);

/**
 * @swagger
 * /comments/{comment_id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: Comment retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found.
 *       400:
 *         description: Bad request.
 */
commentsRouter.get('/:comment_id', getCommentById);

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get comments by post ID
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to filter comments
 *     responses:
 *       200:
 *         description: Comments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Post ID is required.
 *       500:
 *         description: Server error.
 */
commentsRouter.get('/', getCommentsByPostId);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       201:
 *         description: Comment created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request.
 */
commentsRouter.post('/', createComment);

/**
 * @swagger
 * /comments/{comment_id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       201:
 *         description: Comment updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found.
 *       400:
 *         description: Bad request.
 */
commentsRouter.put('/:comment_id', updateComment);

export default commentsRouter;
