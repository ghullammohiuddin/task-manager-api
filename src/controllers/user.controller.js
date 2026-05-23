import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import {
  registerUserService,
  loginUserService,
} from "../services/user.service.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

const registerUserController = catchAsync(async (req, res, next) => {
  const { value, error } = registerSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error)
    return next(
      new AppError(
        error.details.map((e) => e.message),
        400,
      ),
    );

  const user = await registerUserService(
    value.name,
    value.email,
    value.password,
  );

  return res.status(201).json({
    success: true,
    data: user,
    message: "User registered successfully!",
  });
});

const loginUserController = catchAsync(async (req, res, next) => {
  const { value, error } = loginSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error)
    return next(
      new AppError(
        error.details.map((e) => e.message),
        400,
      ),
    );

  const user = await loginUserService(value.email, value.password);

  return res.status(200).json({
    success: true,
    data: user,
    message: "Logged In!",
  });
});

export { registerUserController, loginUserController };
