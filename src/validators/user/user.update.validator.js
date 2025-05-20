import Joi from "joi";

export const userUpdateValidator = Joi.object({
  userName: Joi.string().trim().alphanum().min(3).max(30).optional(),
  fullName: Joi.string().trim().min(2).max(50).optional(),
  email: Joi.string().trim().email().optional(),
  description:Joi.string().trim().max(250).allow("").optional()
}).or('userName', 'fullName', 'email');
