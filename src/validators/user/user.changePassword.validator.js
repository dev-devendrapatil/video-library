import Joi from "joi";

export const passwordValidator = Joi.object({
    password:  Joi.string()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,16}$"))
      .required()
      .messages({
        'string.pattern.base': 'Password must be 6-16 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
      }),
        newPassword:  Joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,16}$"))
        .required()
        .messages({
          'string.pattern.base': 'New Password must be 6-16 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        }),
})