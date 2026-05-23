import {
  addTaskService,
  getTasksService,
  getTaskbyIdService,
  updateTaskService,
  deleteTaskService,
} from "../services/task.service.js";

import {
  createTaskSchema,
  taskIdSchema,
  getTaskQuerySchema,
  updateTaskSchema,
} from "../validators/task.validator.js";

import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

const addTaskController = catchAsync(async (req, res, next) => {
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

  const task = await addTaskService(req.user.id, title, description);

  return res.status(201).json({
    success: true,
    message: "Task created successfully!",
    data: task,
  });
});

const getTasksController = catchAsync(async (req, res, next) => {
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

  const tasks = await getTasksService(req.user.id, queryValue);

  return res.status(200).json({
    success: true,
    data: tasks.rows,
    pagination: {
      page: tasks.page,
      limit: tasks.limit,
      totalPages: tasks.totalPages,
      totalTasks: tasks.totalTasks,
    },
  });
});

const getTaskByIdController = catchAsync(async (req, res, next) => {
  const { value: paramValue, error: paramError } = taskIdSchema.validate(
    req.params,
    {
      convert: true,
    },
  );

  if (paramError) {
    return next(
      new AppError(
        paramError.details.map((err) => err.message),
        400,
      ),
    );
  }

  const id = paramValue.id;
  const userId = req.user.id;

  const task = await getTaskbyIdService(userId, id);

  return res.status(200).json({
    success: true,
    data: task,
  });
});

const updateTaskController = catchAsync(async (req, res, next) => {
  const { value: paramValue, error: paramError } = taskIdSchema.validate(
    req.params,
    { convert: true },
  );
  if (paramError) {
    return next(
      new AppError(
        paramError.details.map((err) => err.message),
        400,
      ),
    );
  }
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

  const updatedTask = await updateTaskService(
    id,
    userId,
    title,
    description,
    status,
  );

  return res.status(200).json({
    success: true,
    message: "Task Updated Successfully",
    data: updatedTask,
  });
});

const deleteTaskController = catchAsync(async (req, res, next) => {
  const { value: paramValue, error: paramError } = taskIdSchema.validate(
    req.params,
    { convert: true },
  );

  if (paramError) {
    return next(
      new AppError(
        paramError.details.map((err) => err.message),
        400,
      ),
    );
  }

  const userId = req.user.id;
  const id = paramValue.id;

  const deletedTask = await deleteTaskService(id, userId);

  return res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: deletedTask,
  });
});

export {
  addTaskController,
  getTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
};
