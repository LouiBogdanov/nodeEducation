import express from 'express';
import cors from 'cors';

import { Router } from 'express';
import { createAuthRouter } from './modules/auth/routes/routes.js';
import { createLagerRouter } from './modules/lagers/routes/routes.js';
import { createDocumentRouter } from './modules/document/routes/routes.js';

const app = express();

app.use(cors('*'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function addApiRoutes() {
    const router = Router();

    router.use('/auth', createAuthRouter());
    router.use('/lagers', createLagerRouter());
    router.use('/documents', createDocumentRouter());

    return router;
}

app.use('/api', addApiRoutes());

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
