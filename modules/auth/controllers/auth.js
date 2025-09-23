import bcrypt from 'bcrypt';
import db from '../../../db/knexConfig.js';
import { generateToken, verifyToken } from '../../../utils/token.js';

export const registerUser = async (req, res) => {
    const { name, surname, email, password } = req.query;

    if (!name || !surname || !email || !password) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    console.log('-------register: ', name, surname, email, password);

    const passwordHash = bcrypt.hashSync(
        String(password),
        bcrypt.genSaltSync(10)
    );

    const userData = {
        name,
        surname,
        email,
        password: passwordHash,
    };

    try {
        const existingUser = await db('users')
            .where('email', '=', email)
            .first();
        if (existingUser) {
            return res.status(409).json({ message: 'User already exist' });
        }
        const newUser = await db('users').insert(userData).returning('*');
        console.log('-----newUser: ', JSON.stringify(newUser));
        const token = generateToken(newUser[0].id);
        console.log('-----token: ', token);
        console.log(verifyToken(token));
        return res.status(201).json({ token: token, user: newUser });
    } catch (error) {
        return res.status(400).json({ message: 'Register error', error });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.query;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
        const user = await db('users').where('email', '=', email).first();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const comparePasswordResult = await bcrypt.compare(
            password,
            user.password
        );

        if (!comparePasswordResult) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = generateToken(user.id);

        return res.status(201).json({ token: token, user: user });
    } catch (error) {
        return res.status(400).json({ message: 'loginUser error', error });
    }
};

export const userInfo = async (req, res) => {
    const { token } = req.headers;

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
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ message: 'userInfo error', error });
    }
};
