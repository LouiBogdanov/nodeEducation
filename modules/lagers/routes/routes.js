import { Router } from 'express';
import {
    allLagers,
    lagerInfoById,
    registerLager,
} from '../controllers/lagers.js';
import { checkAuth } from '../../auth/middleware/auth_middleware.js';

export const createLagerRouter = () => {
    const router = Router();

    router.post('/register', checkAuth, registerLager);
    router.get('/all', checkAuth, allLagers);
    router.get('/info', checkAuth, lagerInfoById);
    return router;
};
