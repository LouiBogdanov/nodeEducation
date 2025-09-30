import { setUserContext } from '../../contexts/auth_context.js';
import { userInfoService } from '../services/auth_services.js';

export const checkAuth = (req, res, next) => {
    const { token } = req.headers;
    setUserContext(undefined);
    userInfoService(token)
        .then(({ data }) => {
            setUserContext(data);
            next();
        })
        .catch(({ status, data }) => res.status(status).json(data));
};
