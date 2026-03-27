import db from "../database/db.connection.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

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
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ success: false, message: "Email and password required!" })
        }

        const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email])
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" })
        }
        const user = rows[0]
        const match = bcrypt.compare(password, user.password)
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