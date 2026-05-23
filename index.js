import "./src/config/env.config.js";
import authRoutes from "./src/routes/auth.route.js";
import taskRoutes from "./src/routes/task.route.js";
import errorhandlerMiddleware from "./src/middlewares/errorhandler.middleware.js";
import db from "./src/database/db.connection.js";
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


app.use(errorhandlerMiddleware);


db.getConnection()
  .then(connection => {
    console.log('Connected to database');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});