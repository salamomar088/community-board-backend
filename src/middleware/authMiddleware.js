import { verifyToken } from "../services/tokenService.js";
import AppError from "../services/AppError.js";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Authentication token missing", 401));
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    req.user = decoded; // { id, email, ... }
    next();
  } catch (err) {
    next(new AppError("Invalid or expired token", 403));
  }
};

export default authMiddleware;
