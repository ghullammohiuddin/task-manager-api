import db from "../database/db.connection.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUserService = async (name, email, password) => {
  const [existingUser] = await db.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);

  if (existingUser.length > 0) {
    throw new AppError("Email Already Registered!", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    `INSERT INTO users (name, email, password) VALUES (?,?,?)`,
    [name, email, hashedPassword],
  );

  const token = jwt.sign(
    { id: result.insertId, email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return {
    id: result.insertId,
    name,
    email,
    token,
  };
};

const loginUserService = async (email, password) => {
  const [existingUser] = await db.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);
  if (existingUser.length === 0) {
    throw new AppError("Invalid Credentials", 401);
  }
  const user = existingUser[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token,
  };
};

export { registerUserService, loginUserService };
