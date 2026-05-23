import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

const authenticate = catchAsync(async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return next(new AppError("No Token Provided", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = { id: decoded.id, email: decoded.email };
  return next();
});

export { authenticate };
