import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import { AccountController } from "./controller/account/AccountController";
import { FoodController } from "./controller/food/FoodController";
import { TaskController } from "./controller/task/TaskController";
import { handleRefreshToken } from "./utils/handleRefreshToken";
import { isAuth } from "./utils/isAuth";
import mysql from "mysql2/promise";
import { AccountModal } from "./model/account/AccountModal";
import { TaskModal } from "./model/task/TaskModal";
import { FoodModal } from "./model/food/FoodModal";

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

AccountModal.initPool(pool);
TaskModal.initPool(pool);
FoodModal.initPool(pool);

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            process.env.CORS_ORIGIN,
            process.env.CORS_ORIGIN.split("://").join("://www."),
          ]
        : process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// refresh token
app.post("/api/refresh_token", (req, res) =>
  handleRefreshToken(req, res, pool)
);

// auth
const account = AccountController.instance;
app.post("/api/auth/login", account.login);
app.post("/api/auth/register", account.register);
app.post("/api/auth/logout", account.logout);
app.post("/api/auth/me", account.me);

// task
const task = TaskController.instance;
app.get("/api/tasks", task.getAllTasks);
app.get("/api/task/:id", task.getTask);
app.post("/api/task", isAuth, task.addTask);
app.put("/api/task", isAuth, task.updateTask);
app.delete("/api/task", isAuth, task.deleteTask);

// subtask
app.post("/api/subtask", isAuth, task.addSubTask);
app.put("/api/subtask", isAuth, task.updateSubTask);
app.delete("/api/subtask", isAuth, task.deleteSubTask);

// food
const food = FoodController.instance;
app.get("/api/foods", food.getAllFoods);
app.get("/api/food/:id", food.getFood);
app.post("/api/food", isAuth, food.addFood);
app.put("/api/food", isAuth, food.updateFood);
app.delete("/api/food", isAuth, food.deleteFood);

// Handle production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(__dirname + "/public/"));

  // Handle SPA
  app.get(/.*/, (_, res) => res.sendFile(__dirname + "/public/index.html"));
}

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Server is running on port ${process.env.SERVER_PORT}`)
);
