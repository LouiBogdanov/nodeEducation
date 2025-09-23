import Joi from 'joi';

export const userRegisterSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(32).required().trim(),
    surname: Joi.string().alphanum().min(3).max(32).required().trim(),
    email: Joi.string().max(40).required().trim(),
    password: Joi.string()
        .min(10)
        .max(100)
        .pattern(new RegExp('^[a-zA-Z0-9]{10,}$'))
        .trim(),
});

export const userLoginSchema = Joi.object({
    email: Joi.string().max(40).required().trim(),
    password: Joi.string()
        .min(10)
        .max(100)
        .pattern(new RegExp('^[a-zA-Z0-9]{10,}$'))
        .trim(),
});
