import Joi from "joi";

export const newVideoValidator = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must be at most 30 characters',
      'any.required': 'Title is required'
    }),

  isPublished: Joi.string()
    .valid("true", "false")
    .required()
    .messages({
      'any.only': 'isPublished must be either "true" or "false"',
      'string.empty': 'isPublished is required',
      'any.required': 'isPublished is required'
    }),

  description: Joi.string()
    .trim()
    .max(250)
    .required()
    .messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description is required',
      'string.max': 'Description must be at most 250 characters',
      'any.required': 'Description is required'
    })
});
