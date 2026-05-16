import db from "../database/db.connection.js";
import {
  createTaskSchema,
  taskIdSchema,
  getTaskQuerySchema,
  updateTaskSchema,
} from "../validators/task.validator.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

const addTask = catchAsync(async (req, res, next) => {
  const { value: bodyValue, error: bodyError } = createTaskSchema.validate(
    req.body,
    {
      abortEarly: false,
    },
  );

  if (bodyError) {
    return next(
      new AppError(
        bodyError.details.map((err) => err.message),
        400,
      ),
    );
  }

  const { title, description } = bodyValue;
  const userId = req.user.id;

  const [result] = await db.query(
    `INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)`,
    [title, description, userId],
  );

  return res.status(201).json({
    success: true,
    message: "Task created successfully!",
    data: {
      id: result.insertId,
      title,
      description,
      userId,
    },
  });
});

const getTasks = catchAsync(async (req, res, next) => {
  const { value: queryValue, error: queryError } = getTaskQuerySchema.validate(
    req.query,
    {
      abortEarly: false,
      convert: true,
    },
  );

  if (queryError) {
    return next(
      new AppError(
        queryError.details.map((err) => err.message),
        400,
      ),
    );
  }

  const { page, limit, status, sort, order } = queryValue;
  const offset = (page - 1) * limit;
  const userId = req.user.id;

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
    [...queryParams, limit, offset],
  );

  // same whereClause so count matches the filter
  const [countResult] = await db.query(
    `SELECT COUNT(*) AS total FROM tasks ${whereClause}`,
    queryParams,
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
      totalTasks,
    },
  });
});

const getTaskById = catchAsync(async (req, res, next) => {
  const { value: paramValue, error: paramError } = taskIdSchema.validate(
    req.params,
    {
      convert: true,
    },
  );

  if (paramError) {
    return next(new AppError(paramError.details[0].message, 400));
  }

  const id = paramValue.id;
  const userId = req.user.id;

  const [rows] = await db.query(
    `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  if (rows.length === 0) {
    return next(new AppError("Task not found!", 404));
  }

  return res.status(200).json({
    success: true,
    data: rows[0],
  });
});

const updateTask = catchAsync(async (req, res, next) => {
  // use taskIdSchema for consistent ID validation — same as getTaskById
  const { value: paramValue, error: paramError } = taskIdSchema.validate(
    req.params,
    { convert: true },
  );
  if (paramError) return next(new AppError("Invalid task ID", 400));

  // validate body with Joi instead of manual checks
  const { value: bodyValue, error: bodyError } = updateTaskSchema.validate(
    req.body,
    { abortEarly: false },
  );
  if (bodyError)
    return next(
      new AppError(
        bodyError.details.map((err) => err.message),
        400,
      ),
    );

  const id = paramValue.id;
  const userId = req.user.id;
  const { title, description, status } = bodyValue;

  // check task exists and belongs to user
  const [rows] = await db.query(
    `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
    [id, userId],
  );
  if (rows.length === 0) return next(new AppError("Task Not Found", 404));

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

  return res.status(200).json({
    success: true,
    message: "Task Updated Successfully",
    data: updatedTask[0],
  });
});

const deleteTask = catchAsync(async (req, res, next) => {
  const { value: paramValue, error: paramError } = taskIdSchema.validate(
    req.params,
    { convert: true },
  );

  if (paramError) {
    return next(new AppError(paramError.details[0].message, 400));
  }

  const userId = req.user.id;
  const id = paramValue.id;

  const [rows] = await db.query(
    `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  if (rows.length === 0) {
    return next(new AppError("Task not found!", 404));
  }

  await db.query(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [
    id,
    userId,
  ]);

  return res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    deletedTask: rows[0],
  });
});

export { addTask, getTasks, getTaskById, updateTask, deleteTask };
