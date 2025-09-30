import {
    addLagerCountService,
    commitDocumentService,
    createDocumentService,
    documentLagerInfoService,
    documentLagersService,
    documentsListService,
} from '../services/document_service.js';

export const createDocument = (req, res) =>
    createDocumentService()
        .then(({ status, data }) => res.status(status).json(data))
        .catch(({ status, data }) => res.status(status).json(data));

export const documentsList = (req, res) =>
    documentsListService()
        .then(({ status, data }) => res.status(status).json(data))
        .catch(({ status, data }) => res.status(status).json(data));

export const documentLagers = (req, res) => {
    const { documentId } = req.query;
    return documentLagersService(documentId)
        .then(({ status, data }) => res.status(status).json(data))
        .catch(({ status, data }) => res.status(status).json(data));
};

export const documentLagerInfo = (req, res) => {
    const { documentId, lagerId } = req.query;
    return documentLagerInfoService(documentId, lagerId)
        .then(({ status, data }) => res.status(status).json(data))
        .catch(({ status, data }) => res.status(status).json(data));
};

export const addLagerCount = (req, res) => {
    const { documentId, lagerId, lagerCount } = req.query;
    return addLagerCountService(documentId, lagerId, lagerCount)
        .then(({ status, data }) => res.status(status).json(data))
        .catch(({ status, data }) => res.status(status).json(data));
};

export const commitDocument = (req, res) => {
    const { documentId } = req.query;
    return commitDocumentService(documentId)
        .then(({ status, data }) => res.status(status).json(data))
        .catch(({ status, data }) => res.status(status).json(data));
};
