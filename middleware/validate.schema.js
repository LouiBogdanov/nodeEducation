export const validateSchema = (schema) => (req, res, next) => {
    console.log('-----------validateSchema------------');
    const dataToValidate =
        Object.keys(req.query).length > 0 ? req.query : req.body;

    const { error } = schema.validate(dataToValidate);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
