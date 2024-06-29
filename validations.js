import { body } from "express-validator";

export const loginValidation = [
  body('email', 'Incorrect email').isEmail(),
  body('password').isLength({ min: 5 }),
]

export const registerValidation = [
  body('email', 'Incorrect email').isEmail(),
  body('password').isLength({ min: 5 }),
  body('fullName').isLength({ min: 3 }),
  body('avatarUrl').optional().isURL(),
]

export const postCreateValidation = [
  body('title', 'Add post title').isLength({ min: 3 }).isString(),
  body('text', 'Add post content').isLength({ min: 10 }).isString(),
  body('tags', 'Incorrect tags format').optional().isArray(),
  body('imageUrl', 'Incorrect link for the image url').optional().isURL(),
]
