export const validateUserId = (req, res, next) => {
    const { id } = req.params;
    console.log('middleware with id ' + id);
    if (id < 10) {
        next();
    } else {
        res.status(400).json({ message: 'Incorrect user id' });
    }
};
