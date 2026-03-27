import "./src/config/env.config.js";
import authRoutes from "./src/routes/auth.route.js"
import taskRoutes from './src/routes/task.route.js'
import express from "express";
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes)



app.listen(process.env.PORT,()=>{
    console.log("server running on port 3000");
    
});