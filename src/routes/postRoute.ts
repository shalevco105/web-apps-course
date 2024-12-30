import { Router } from 'express';
import { addPost, getAllPosts, getPostById, getPostsBySender, updatePost } from '../controllers/postController';
import { authenticateToken } from '../middlewares/auth';

const postRouter: Router = Router();
postRouter.use(authenticateToken);

postRouter.post('/', addPost);
postRouter.get('/data', getAllPosts);
postRouter.get('/:post_id', getPostById);
postRouter.get('/', getPostsBySender);
postRouter.put('/:post_id', updatePost);

export default postRouter;