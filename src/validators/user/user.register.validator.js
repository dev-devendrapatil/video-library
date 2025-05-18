import Joi from 'joi';

export const userSchemaValidator = Joi.object({
  fullName: Joi.string().trim().min(2).max(50).required(),
  userName: Joi.string().trim().alphanum().min(3).max(30).required(),
  email: Joi.string().trim().email().required(),
  password:  Joi.string()
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,16}$"))
  .required()
  .messages({
    'string.pattern.base': 'Password must be 6-16 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  }),
});