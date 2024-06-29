import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: passwordHashed,
    })

    const user = await doc.save();

    const token = jwt.sign({
      _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );
    
    res.status(200).json({
      ...user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration is failed"
    });
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if(!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if(!isValidPass) {
      return req.status(404).json({
        message: "Wrong password or login"
      });
    }

    const token = jwt.sign({
      _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.status(200).json({
      ...userData,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "User isn't authorized"
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if(!user) {
      return res.status(404).json({
        message: "User is not exist"
      })
    }

    const { passwordHash, ...userData } = user._doc;

    res.status(200).json(userData);
  } catch (error) {
    res.status(404).json({
      message: "Auth me route is failed"
    })
  }
}
