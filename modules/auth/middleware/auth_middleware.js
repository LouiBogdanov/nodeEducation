import db from '../../../db/knexConfig.js';
import { verifyToken } from '../../../utils/token.js';

let userContext = {
    id: undefined,
    name: undefined,
    surname: undefined,
    email: undefined,
};

export const getUserContext = () => userContext;

export const checkAuth = async (req, res, next) => {
    const { token } = req.headers;
    userContext = undefined;
    try {
        const tokenData = verifyToken(token);

        const raw_user = await db.raw(
            `select id, name, surname, email from users where id = ?`,
            [tokenData.id]
        );
        const user = raw_user?.rows[0];

        if (!user) {
            console.log('user not found');
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User data:', JSON.stringify(user));
        userContext = user;
        next();
    } catch (error) {
        return res.status(400).json({ message: 'userInfo error', error });
    }
};
