import express from 'express';
import cors from 'cors';

import { Router } from 'express';
import { createPostRouter } from './modules/posts/routes/routes.js';

const app = express();

app.use(cors('*'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function addApiRoutes() {
    const router = Router();

    router.use('/posts', createPostRouter());

    return router;
}

app.use('/api', addApiRoutes());

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
