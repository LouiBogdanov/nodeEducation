import db from '../../../db/knexConfig.js';
import { DOCUMENT_STATUSES } from '../constants/constants.js';

export const checkDocumentAvailability = async (req, res, next) => {
    const { documentId } = req.query;
    try {
        const raw_documents = await db.raw(
            'select id from documents where id = :documentId',
            { documentId }
        );
        if (!raw_documents?.rows[0]) {
            return res.status(404).json({ message: 'document not found' });
        }
        next();
    } catch (error) {
        return res.status(400).json({
            message: 'checkDocumentAvailability middleware error',
            error,
        });
    }
};

export const checkIsDocumentMutable = async (req, res, next) => {
    const { documentId } = req.query;
    try {
        const raw_documents = await db.raw(
            'select status from documents where id = :documentId',
            { documentId }
        );
        if (
            raw_documents?.rows[0]?.status !== DOCUMENT_STATUSES.READY_TO_WORK
        ) {
            return res
                .status(403)
                .json({ message: 'documents is not mutable' });
        }
        next();
    } catch (error) {
        return res.status(400).json({
            message: 'checkIsDocumentMutable middleware error',
            error,
        });
    }
};

export const checkLagerAvailability = async (req, res, next) => {
    const { lagerId } = req.query;
    try {
        const raw_lager = await db.raw(
            'select id from lagers where id = :lagerId',
            { lagerId }
        );
        if (!raw_lager?.rows) {
            return res.status(404).json({ message: 'lager not found' });
        }
        next();
    } catch (error) {
        return res.status(400).json({
            message: 'checkLagerAvailability middleware error',
            error,
        });
    }
};

export const checkLagerCount = async (req, res, next) => {
    const { lagerId, lagerCount } = req.query;
    try {
        const raw_lager = await db.raw(
            `select "isWeight" from lagers where id = :lagerId`,
            { lagerId }
        );
        const isWeight = raw_lager?.rows[0].isWeight;
        if (!isWeight && !Number.isInteger(Number(lagerCount))) {
            return res.status(403).json({ message: 'incorrect lager count' });
        }
        next();
    } catch (error) {
        return res
            .status(400)
            .json({ message: 'checkLagerCount middleware error', error });
    }
};
