import db from '../../../db/knexConfig.js';
import { getUserContext } from '../../auth/middleware/auth_middleware.js';
import { DOCUMENT_STATUSES } from '../constants/constants.js';

export const createDocument = async (req, res) => {
    try {
        const createdDate = new Date();
        const createdUser = getUserContext()?.id;
        const newDocumentData = {
            createdDate,
            createdUser,
            status: DOCUMENT_STATUSES.READY_TO_WORK,
        };
        console.log(newDocumentData);
        const newDocument = await db('documents')
            .insert(newDocumentData)
            .returning('*');
        console.log('-----------newDocument:', newDocument);
        return res.status(200).json(newDocument);
    } catch (error) {
        return res.status(400).json({ message: 'createDocument error', error });
    }
};

export const documentsList = async (req, res) => {
    try {
        const raw_documents = await db.raw(
            'select d.id AS "documentId", d.status, d."createdDate", d."createdUser", u1.email AS createdUserEmail, d."commitDate", d."commitUser", u2."email" commitUserEmail from documents AS d join users AS u1 on u1.id = d."createdUser" left join users AS u2 on u2.id = d."commitUser"'
        );
        const list = raw_documents?.rows;
        console.log('----------------documentsList:', list);
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json({ message: 'documentsList error', error });
    }
};

export const documentLagers = async (req, res) => {
    const { documentId } = req.query;
    try {
        const raw_lagers = await db.raw(
            'select d.id AS "documentId", d."lagerId", l."fullName", d."lagerCount", l.unit, l."isWeight" from "documentsLines" AS d join lagers AS l on l.id = d."lagerId" where d.id = :documentId',
            { documentId }
        );
        const list = raw_lagers?.rows;
        console.log('----------------documentLagers:', list);
        return res.status(200).json(list);
    } catch (error) {
        return res.status(400).json({ message: 'documentLagers error', error });
    }
};

export const documentLagerInfo = async (req, res) => {
    const { documentId, lagerId } = req.query;
    try {
        const raw_lager = await db.raw(
            'select d.id AS "documentId", l.id as "lagerId", l."fullName", d."lagerCount", l.unit, l."isWeight" from lagers AS l left join "documentsLines" AS d on l.id = d."lagerId" and d.id = :documentId where l.id = :lagerId',
            { documentId, lagerId }
        );
        const lagerInfo = raw_lager?.rows[0];
        console.log('----------------documentLagerInfo:', lagerInfo);
        return res.status(200).json(lagerInfo);
    } catch (error) {
        return res
            .status(400)
            .json({ message: 'documentLagerInfo error', error });
    }
};

export const addLagerCount = async (req, res) => {
    const { documentId, lagerId, lagerCount } = req.query;
    try {
        const raw_lager = await db.raw(
            ' select d.id AS "documentId", l.id as "lagerId", l."fullName", d."lagerCount", l.unit, l."isWeight" from lagers AS l left join "documentsLines" AS d on l.id = d."lagerId" where d.id = :documentId and l.id = :lagerId',
            { documentId, lagerId }
        );
        let documentLagerCount = raw_lager?.rows[0]?.lagerCount;
        if (documentLagerCount !== undefined) {
            documentLagerCount =
                Number(documentLagerCount) + Number(lagerCount);

            if (documentLagerCount < 0) {
                documentLagerCount = 0;
            }
            const lager = await db('documentsLines')
                .where('documentId', '=', documentId)
                .where('lagerId', '=', lagerId)
                .update({ lagerCount: documentLagerCount })
                .returning('*');
            console.log('-------lager updated in document:', lager);
            return res
                .status(200)
                .json({ message: 'lagerCountUpdated', lager });
        } else {
            if (lagerCount < 0) {
                return res
                    .status(400)
                    .json({ message: 'Incorrect lager count' });
            }
            const insertData = {
                documentId,
                lagerId,
                lagerCount,
            };
            const newLager = await db('documentsLines')
                .insert(insertData)
                .returning('*');
            console.log('-------lager added in document:', newLager);
            return res.status(200).json({ message: 'newLagerAdded', newLager });
        }
    } catch (error) {
        return res.status(400).json({ message: 'addLagerCount error', error });
    }
};

export const commitDocument = async (req, res) => {
    const { documentId } = req.query;
    const commitUser = getUserContext()?.id;
    const commitDate = new Date();
    const status = DOCUMENT_STATUSES.COMMITTED;
    const updateParams = {
        commitUser,
        commitDate,
        status,
    };
    try {
        const document = await db('documents')
            .where('id', '=', documentId)
            .update(updateParams)
            .returning('*');
        console.log('--------commitDocument:', document);
        return res.status(200).json({ message: 'document commited', document });
    } catch (error) {
        return res.status(400).json({ message: 'commitDocument error', error });
    }
};
