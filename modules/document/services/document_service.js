import db from '../../../db/knexConfig.js';
import { getUserContext } from '../../contexts/auth_context.js';
import { DOCUMENT_STATUSES } from '../constants/constants.js';

export const createDocumentService = async () => {
    try {
        const createdDate = new Date();
        const createdUser = getUserContext()?.id;
        const newDocumentData = {
            createdDate,
            createdUser,
            status: DOCUMENT_STATUSES.READY_TO_WORK,
        };
        const newDocument = await db('documents')
            .insert(newDocumentData)
            .returning('*');
        return Promise.resolve({ status: 200, data: newDocument });
    } catch (error) {
        return Promise.reject({
            status: 400,
            data: { message: 'createDocument error', error },
        });
    }
};

export const documentsListService = async () => {
    try {
        const raw_documents = await db.raw(
            'select d.id AS "documentId", d.status, d."createdDate", d."createdUser", u1.email AS createdUserEmail, d."commitDate", d."commitUser", u2."email" commitUserEmail from documents AS d join users AS u1 on u1.id = d."createdUser" left join users AS u2 on u2.id = d."commitUser"'
        );
        const list = raw_documents?.rows;
        return Promise.resolve({
            status: 200,
            data: list,
        });
    } catch (error) {
        return Promise.reject({
            status: 400,
            data: { message: 'documentsList error', error },
        });
    }
};

export const documentLagersService = async (documentId) => {
    try {
        const raw_lagers = await db.raw(
            'select d.id AS "documentId", d."lagerId", l."fullName", d."lagerCount", l.unit, l."isWeight" from "documentsLines" AS d join lagers AS l on l.id = d."lagerId" where d.id = :documentId',
            { documentId }
        );
        const list = raw_lagers?.rows;
        return Promise.resolve({
            status: 200,
            data: list,
        });
    } catch (error) {
        return Promise.reject({
            status: 400,
            data: { message: 'documentsLagers error', error },
        });
    }
};

export const documentLagerInfoService = async (documentId, lagerId) => {
    try {
        const raw_lager = await db.raw(
            'select d.id AS "documentId", l.id as "lagerId", l."fullName", d."lagerCount", l.unit, l."isWeight" from lagers AS l left join "documentsLines" AS d on l.id = d."lagerId" and d.id = :documentId where l.id = :lagerId',
            { documentId, lagerId }
        );
        const lagerInfo = raw_lager?.rows[0];
        return Promise.resolve({
            status: 200,
            data: lagerInfo,
        });
    } catch (error) {
        return Promise.reject({
            status: 400,
            data: { message: 'documentLagerInfo error', error },
        });
    }
};

export const addLagerCountService = async (documentId, lagerId, lagerCount) => {
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
            return Promise.resolve({
                status: 200,
                data: newLager,
            });
        } else {
            if (lagerCount < 0) {
                return Promise.reject({
                    status: 400,
                    data: { message: 'Incorrect lager count' },
                });
            }
            const insertData = {
                documentId,
                lagerId,
                lagerCount,
            };
            const newLager = await db('documentsLines')
                .insert(insertData)
                .returning('*');
            return Promise.resolve({
                status: 200,
                data: newLager,
            });
        }
    } catch (error) {
        return Promise.reject({
            status: 400,
            data: { message: 'documentLagerInfoService error', error },
        });
    }
};

export const commitDocumentService = async (documentId) => {
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
        return Promise.resolve({
            status: 200,
            data: document,
        });
    } catch (error) {
        return Promise.reject({
            status: 400,
            data: { message: 'commitDocument error', error },
        });
    }
};
