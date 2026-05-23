import joi from "joi";

const createTaskSchema = joi.object({
  title: joi.string().min(3).max(100).required().messages({
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 3 characters",
    "any.required": "Title is required",
  }),

  description: joi.string().max(500).allow("").optional().messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
});

const taskIdSchema = joi.object({
  id: joi.number().integer().positive().required().messages({
    "number.base": "Task ID must be a number",
    "number.integer": "Task ID must be an integer",
    "number.positive": "Task ID must be positive",
    "any.required": "Task ID is required",
  }),
});

const getTaskQuerySchema = joi.object({
  page: joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.min": "Page must be at least 1",
  }),

  limit: joi.number().integer().min(1).max(50).default(10).messages({
    "number.base": "Limit must be a number",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 50",
  }),

  status: joi.string().valid("pending", "completed").optional().messages({
    "any.only": "Status must be either pending or completed",
  }),

  sort: joi
    .string()
    .valid("created_at", "title")
    .default("created_at")
    .optional(),

  order: joi.string().valid("asc", "desc").default("desc").optional(),
});

const updateTaskSchema = joi
  .object({
    title: joi.string().min(3).max(100).optional(),
    description: joi.string().max(500).allow("").optional(),
    status: joi.string().valid("pending", "completed").optional(),
  })
  .min(1)
  .messages({
    "object.min": "Please provide at least one field to update",
  });

export { createTaskSchema, taskIdSchema, getTaskQuerySchema, updateTaskSchema };
