import "./src/config/env.config.js";
import authRoutes from "./src/routes/auth.route.js";
import taskRoutes from "./src/routes/task.route.js";
import errorhandlerMiddleware from "./src/middlewares/errorhandler.middleware.js";
import db from "./src/database/db.connection.js";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();


app.use(helmet());


const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts, please try again later.",
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(globalLimiter);

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/tasks", taskRoutes);

// Error handler — must be last
app.use(errorhandlerMiddleware);

db.getConnection()
  .then((connection) => {
    console.log("Connected to database");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
