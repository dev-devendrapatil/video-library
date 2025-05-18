import Joi from 'joi';

export const loginValidator = Joi.object({

  userName: Joi.string().trim().alphanum().min(3).max(30),
  email: Joi.string().trim().email(),
  password:  Joi.string()
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,16}$"))
  .required()
  .messages({
    'string.pattern.base': 'Password must be 6-16 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  }),
}).xor('userName', 'email');