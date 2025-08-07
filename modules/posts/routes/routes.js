import { Router } from 'express';
import { addPost, getAllPosts, getPostById } from '../controllers/posts.js';
import { validateUserId } from '../middleware/validateUserId.js';

export const createPostRouter = () => {
    const router = Router();

    router.get('/all', getAllPosts);
    router.get('/:id', validateUserId, getPostById);
    router.post('/add', addPost);
    return router;
};
