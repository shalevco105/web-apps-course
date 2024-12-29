import { Request, Response } from 'express';
import commentModel, {IComment} from "../models/commentModel";

// Get all comments or filter by post_id
export const getAllComments = async (req: Request, res: Response): Promise<void> => {
    const postId = req.query.post_id as string;

    try {
        const comments = postId
            ? await commentModel.find({ post_id: postId })
            : await commentModel.find();

        res.send(comments);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};

// Get a comment by its ID
export const getCommentById = async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.comment_id;

    try {
        const comment = await commentModel.findById(commentId);
        comment ? res.send(comment) : res.status(404).send('Comment not found');
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};

// Get comments by post ID
export const getCommetnsByPostId = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = req.query.post_id as string;

        if (!postId) {
            res.status(400).send('Post ID is required');
            return;
        }

        const comments = await commentModel.find({ post_id: postId });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

// Create a new comment
export const createComment = async (req: Request, res: Response): Promise<void> => {
    const commentBody: IComment = req.body;

    try {
        const comment = await commentModel.create(commentBody);
        res.status(201).send(comment);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};

// Update an existing comment
export const updateComment = async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.comment_id;
    const commentBody: Partial<IComment> = req.body;

    try {
        const comment = await commentModel.findById(commentId);

        if (comment) {
            const updatedComment = await commentModel.findByIdAndUpdate(commentId, commentBody, {
                new: true,
                runValidators: true,
            });

            res.status(201).send(updatedComment);
        } else {
            res.status(404).send('Comment not found');
        }
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};
