import db from "../database/db.connection.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const registerUser = async (req, res) => {

    try {

        const { value, error } = registerSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { name, email, password } = value;

        const [existingUser] = await db.query(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: "Email Already Registered!" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            `INSERT INTO users (name, email, password) VALUES (?,?,?)`,
            [name, email, hashedPassword]
        );

        const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ success: true, data: { id: result.insertId, name, email, token } });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


const loginUser = async (req, res) => {
    try {

        const { value, error } = loginSchema.validate(req.body, { abortEarly: false })

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message)
            })
        }

        const { email, password } = value;

        const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email])
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" })
        }
        const user = rows[0]
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(400).json({ success: false, message: 'Invalid credentials!' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ success: true, data: { id: user.id, name: user.name, email: user.email, token }, message: "Logged In!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export { registerUser, loginUser }