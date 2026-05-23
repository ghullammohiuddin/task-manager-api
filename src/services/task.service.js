import db from "../database/db.connection.js";
import AppError from "../utils/AppError.js";

const addTaskService = async (userId, title, description) => {
  const [result] = await db.query(
    `INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)`,
    [title, description, userId],
  );

  return {
    id: result.insertId,
    title,
    description,
    userId,
  };
};

const getTasksService = async (userId, queryValue) => {
  const { page, limit, status, sort, order } = queryValue;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;

  // dynamic WHERE clause
  let whereClause = "WHERE user_id = ?";
  let queryParams = [userId];

  if (status) {
    whereClause += " AND status = ?";
    queryParams.push(status);
  }

  // whitelist sort columns — SQL injection prevention
  const allowedSort = ["created_at", "title"];
  const allowedOrder = ["asc", "desc"];
  const sortColumn = allowedSort.includes(sort) ? sort : "created_at";
  const sortOrder = allowedOrder.includes(order) ? order.toUpperCase() : "DESC";

  const [rows] = await db.query(
    `SELECT * FROM tasks ${whereClause} ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`,
    [...queryParams, limitNum, offset],
  );

  // same whereClause so count matches the filter
  const [countResult] = await db.query(
    `SELECT COUNT(*) AS total FROM tasks ${whereClause}`,
    queryParams,
  );

  const totalTasks = Number(countResult[0].total);
  const totalPages = Math.ceil(totalTasks / limitNum);

  console.log('totalTasks:', totalTasks, typeof totalTasks);
console.log('limitNum:', limitNum, typeof limitNum);
console.log('totalPages:', totalPages);

  return {
    rows,
    page: pageNum,
    limit: limitNum,
    totalPages,
    totalTasks,
  };
};

const getTaskbyIdService = async (userId, id) => {
  const [rows] = await db.query(
    `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  if (rows.length === 0) {
    throw new AppError("Task not found!", 404);
  }

  return rows[0];
};

const updateTaskService = async (id, userId, title, description, status) => {
  const [rows] = await db.query(
    `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
    [id, userId],
  );
  if (rows.length === 0) throw new AppError("Task Not Found", 404);

  // build dynamic update query
  const updates = [];
  const values = [];

  if (title) {
    updates.push("title = ?");
    values.push(title);
  }
  if (description) {
    updates.push("description = ?");
    values.push(description);
  }
  if (status) {
    updates.push("status = ?");
    values.push(status);
  }

  values.push(id, userId);
  await db.query(
    `UPDATE tasks SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
    values,
  );

  const [updatedTask] = await db.query(
    `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  return updatedTask[0];
};

const deleteTaskService = async (id, userId) => {
  const [rows] = await db.query(
    `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  if (rows.length === 0) {
    throw new AppError("Task not found!", 404);
  }

  await db.query(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [
    id,
    userId,
  ]);

  return rows[0];
};

export {
  addTaskService,
  getTasksService,
  getTaskbyIdService,
  updateTaskService,
  deleteTaskService,
};
