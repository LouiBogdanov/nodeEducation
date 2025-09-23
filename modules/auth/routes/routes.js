import { Router } from 'express';
import { loginUser, registerUser, userInfo } from '../controllers/auth.js';
import { validateSchema } from '../../../middleware/validate.schema.js';
import {
    userLoginSchema,
    userRegisterSchema,
} from '../validation/user.schema.js';

export const createAuthRouter = () => {
    const router = Router();

    router.post('/register', validateSchema(userRegisterSchema), registerUser);
    router.post('/login', validateSchema(userLoginSchema), loginUser);
    router.get('/user-info', userInfo);
    return router;
};
