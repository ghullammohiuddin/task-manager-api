import db from "../database/db.connection.js";


const addTask = async (req, res) => {
    try {
        const { title, description = null } = req.body;
        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title can't be empty!"
            });
        }

        const [result] = await db.query(
            `INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)`,
            [title, description, userId]
        );

        return res.status(201).json({
            success: true,
            message: "Task created successfully!",
            data: {
                id: result.insertId,
                title,
                description,
                userId
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getTasks = async (req, res) => {
    try {

        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        
        if (page < 1) page = 1;
        if (limit < 1) limit = 10;
        if (limit > 50) limit = 50;

        const offset = (page - 1) * limit;
        const userId = req.user.id;


        const [rows] = await db.query(
            `SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );

        const [countResult] = await db.query(
            'SELECT COUNT(*) AS total FROM tasks WHERE user_id = ?',
            [userId]
        );

        const totalTasks = countResult[0].total;
        const totalPages = Math.ceil(totalTasks / limit);

        return res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                page,
                limit,
                totalPages,
                totalTasks
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getTaskById = async (req, res) => {

    try {
        const id = parseInt(req.params.id);
        const userId = req.user.id;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID"
            });
        }

        const [rows] = await db.query(
            `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
            [id, userId]
        )

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task Not Found"
            })
        }

        return res.status(200).json({
            success: true,
            data: rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const userId = req.user.id;
        const id = parseInt(req.params.id);

        let updates = [];
        let values = [];

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID"
            });
        }

        if (!title && !description && !status) {
            return res.status(400).json({
                success: false,
                message: "Please provide the parameters to update task!"
            })
        }

        const allowedStatus = ["pending", "completed"];

        if (status, !allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const [rows] = await db.query(
            `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
            [id, userId]
        )

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task Not Found"
            })
        }

        if (title) {
            updates.push("title = ?");
            values.push(title)
        }

        if (description) {
            updates.push("description = ?");
            values.push(description);
        }

        if (status) {
            updates.push("status = ?");
            values.push(status);
        }

        const updateQuery = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`

        values.push(id, userId);

        await db.query(updateQuery, values);

        const [updatedTask] = await db.query(
            `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
            [id, userId]
        );

        return res.status(200).json({
            success: true,
            message: "Task Updated Successfully",
            data: updatedTask[0]
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteTask = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.id;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID"
            });
        }

        const [rows] = await db.query(
            `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
            [id, userId]
        )

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task Not Found"
            })
        }

        await db.query(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [id, userId])

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            deletedTask: rows[0]
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export { addTask, getTasks, getTaskById, updateTask, deleteTask }