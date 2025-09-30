import db from '../../../db/knexConfig.js';
import { verifyToken } from '../../../utils/token.js';

export const userInfoService = async (token) => {
    try {
        const tokenData = verifyToken(token);

        const raw_user = await db.raw(
            `select id, name, surname, email from users where id = ?`,
            [tokenData.id]
        );
        const user = raw_user?.rows[0];

        if (!user) {
            return Promise.reject({
                status: 404,
                data: { message: 'User not found' },
            });
        }
        return Promise.resolve({
            status: 200,
            data: user,
        });
    } catch (error) {
        return Promise.reject({
            status: 400,
            data: { message: 'userInfo error', error },
        });
    }
};
