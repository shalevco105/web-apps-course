import express from 'express';
import {
    createComment,
    getAllComments,
    getCommentById,
    getCommetnsByPostId,
    updateComment
} from "../controllers/commentsController";

const commentsRouter = express.Router();

commentsRouter.get('/data', getAllComments);

commentsRouter.get('/:comment_id', getCommentById);

commentsRouter.get('/', getCommetnsByPostId);

commentsRouter.post('/', createComment);

commentsRouter.put('/:comment_id', updateComment);

export default commentsRouter;
