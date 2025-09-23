import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (id) => {
    return jwt.sign({ id: id }, process.env.SECRET, { expiresIn: '100d' });
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET);
};
