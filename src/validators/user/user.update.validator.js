import Joi from "joi";

export const userUpdateValidator = Joi.object({
  userName: Joi.string().trim().alphanum().min(3).max(30),
  fullName: Joi.string().trim().min(2).max(50),
  email: Joi.string().trim().email(),
}).xor('userName','fullName','email');
