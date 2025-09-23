import { Router } from 'express';
import {
    addLagerCount,
    commitDocument,
    createDocument,
    documentLagerInfo,
    documentLagers,
    documentsList,
} from '../controllers/document.js';
import { checkAuth } from '../../auth/middleware/auth_middleware.js';
import {
    checkDocumentAvailability,
    checkIsDocumentMutable,
    checkLagerAvailability,
    checkLagerCount,
} from '../middleware/document_middleware.js';

export const createDocumentRouter = () => {
    const router = Router();

    router.post('/create', checkAuth, createDocument);
    router.get('/list', checkAuth, documentsList);
    router.get('/lagers', checkAuth, checkDocumentAvailability, documentLagers);
    router.get(
        '/lager-info',
        checkAuth,
        checkDocumentAvailability,
        checkLagerAvailability,
        documentLagerInfo
    );
    router.post(
        '/add-lager-count',
        checkAuth,
        checkDocumentAvailability,
        checkIsDocumentMutable,
        checkLagerAvailability,
        checkLagerCount,
        addLagerCount
    );
    router.post(
        '/commit',
        checkAuth,
        checkDocumentAvailability,
        checkIsDocumentMutable,
        commitDocument
    );

    return router;
};
