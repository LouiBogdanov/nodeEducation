import bcrypt from 'bcrypt';
import db from '../../../db/knexConfig.js';
import { generateToken } from '../../../utils/token.js';
import { userInfoService } from '../services/auth_services.js';

export const registerUser = async (req, res) => {
    const { name, surname, email, password } = req.query;

    if (!name || !surname || !email || !password) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

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
        const token = generateToken(newUser[0].id);
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

export const userInfo = (req, res) => {
    const { token } = req.headers;
    userInfoService(token)
        .then(({ status, data }) => res.status(status).json(data))
        .catch(({ status, data }) => res.status(status).json(data));
};
