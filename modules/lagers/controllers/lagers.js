import db from '../../../db/knexConfig.js';

export const registerLager = async (req, res) => {
    const { fullName, unit, isWeight } = req.query;

    if (!fullName || !unit || !isWeight) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    console.log('------------registerLager:', fullName, unit, isWeight);
    const insertData = {
        fullName,
        unit,
        isWeight,
    };

    try {
        const existingLager = await db('lagers')
            .where('fullName', '=', fullName)
            .first();
        if (existingLager) {
            return res.status(409).json({ message: 'Lager already exist' });
        }
        const newLager = await db('lagers').insert(insertData).returning('*');
        console.log('-------------newLager:', JSON.stringify(newLager));
        return res.status(201).json({ lager: newLager });
    } catch (error) {
        return res.status(400).json({ message: 'registerLager error', error });
    }
};

export const allLagers = async (req, res) => {
    try {
        const raw_lagers = await db.raw('select * from lagers', []);
        const lagers = raw_lagers?.rows;
        return res.status(200).json({ allLagers: lagers });
    } catch (error) {
        return res.status(400).json({ message: 'allLagers error', error });
    }
};

export const lagerInfoById = async (req, res) => {
    const { lagerId } = req.query;
    if (!lagerId) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }
    try {
        const raw_lagers = await db.raw(
            'select * from lagers where id = :lagerId',
            { lagerId }
        );
        const lagers = raw_lagers?.rows;
        return res.status(200).json({ lagerInfoById: lagers });
    } catch (error) {
        return res.status(400).json({ message: 'lagerInfoById error', error });
    }
};
