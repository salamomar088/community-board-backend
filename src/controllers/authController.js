import bcrypt from "bcrypt";
import { generateToken } from "../services/tokenService.js";
import logger from "../services/logger.js";
import AppError from "../services/AppError.js";
import { findUserByEmail, createUser } from "../models/userModel.js";

export const register = async (req, res, next) => {
  try {
    const { fullname, username, email, password } = req.body;

    // 1️⃣ Validate input FIRST
    if (!fullname || !username || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    // 2️⃣ Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return next(new AppError("Email already registered", 409));
    }

    // 3️⃣ Hash password BEFORE using it
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    await createUser(fullname, username, email, hashedPassword);

    logger.info(`New user registered: ${email}`);

    // 5️⃣ Respond
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    const user = await findUserByEmail(email);

    if (!user) {
      logger.warn(`Login failed – user not found: ${email}`);
      return next(new AppError("Invalid credentials", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed – wrong password: ${email}`);
      return next(new AppError("Invalid credentials", 401));
    }

    const token = generateToken({ id: user.id, email: user.email });

    logger.info(`User logged in: ${email}`);

    res.json({
      status: "success",
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
